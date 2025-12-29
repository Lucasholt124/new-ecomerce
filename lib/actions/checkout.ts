"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_BY_IDS_QUERY } from "@/lib/sanity/queries/products";
import { getOrCreateAsaasCustomer } from "./customer";

// Configuração do Asaas
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_API_URL = process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3"; // Padrão Sandbox

if (!ASAAS_API_KEY) {
  throw new Error("ASAAS_API_KEY is not defined");
}

// Types
interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Cria uma cobrança no Asaas baseada nos itens do carrinho
 */
export async function createCheckoutSession(
  items: CartItem[]
): Promise<CheckoutResult> {
  try {
    // 1. Verify user is authenticated
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return { success: false, error: "Por favor, faça login para continuar." };
    }

    // 2. Validate cart is not empty
    if (!items || items.length === 0) {
      return { success: false, error: "Seu carrinho está vazio." };
    }

    // 3. Fetch current product data from Sanity to validate prices/stock
    const productIds = items.map((item) => item.productId);
    const products = await client.fetch(PRODUCTS_BY_IDS_QUERY, {
      ids: productIds,
    });

    // 4. Validate each item & Calculate Total
    const validationErrors: string[] = [];
    let totalAmount = 0;
    const validatedItems: {
      product: (typeof products)[number];
      quantity: number;
    }[] = [];

    // Para descrição no Asaas (Lista de itens)
    let descriptionItems = "";

    for (const item of items) {
      const product = products.find(
        (p: { _id: string }) => p._id === item.productId
      );

      if (!product) {
        validationErrors.push(`Produto "${item.name}" não está mais disponível.`);
        continue;
      }

      if ((product.stock ?? 0) === 0) {
        validationErrors.push(`"${product.name}" está esgotado.`);
        continue;
      }

      if (item.quantity > (product.stock ?? 0)) {
        validationErrors.push(
          `Apenas ${product.stock} unidades de "${product.name}" disponíveis.`
        );
        continue;
      }

      const itemTotal = (product.price ?? 0) * item.quantity;
      totalAmount += itemTotal;

      validatedItems.push({ product, quantity: item.quantity });
      descriptionItems += `${item.quantity}x ${product.name}\n`;
    }

    if (validationErrors.length > 0) {
      return { success: false, error: validationErrors.join(". ") };
    }

    // 5. Get or create Asaas customer
    // Assumindo que você atualizará o arquivo actions/customer.ts para exportar essa função
    const userEmail = user.emailAddresses[0]?.emailAddress ?? "";
    const userName =
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || userEmail;

    // Precisamos do CPF para o Asaas em produção, mas na sandbox ou dependendo da config, pode ser opcional.
    // Aqui tentamos pegar do metadata do Clerk se existir, ou passamos vazio (o Asaas pode reclamar se não tiver CPF/CNPJ)
    const userCpf = user.publicMetadata?.cpf as string || "";

    const { asaasCustomerId } = await getOrCreateAsaasCustomer(
      userEmail,
      userName,
      userId,
      userCpf
    );

    // 6. Create Asaas Payment (Cobrança)

    // Data de vencimento (Hoje + 3 dias)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);
    const dueDateString = dueDate.toISOString().split('T')[0];

    // Montar payload
    // Usamos externalReference para guardar o ID do Clerk e IDs dos produtos para o Webhook recuperar depois
    const externalData = {
        clerkUserId: userId,
        productIds: validatedItems.map((i) => i.product._id).join(","),
        quantities: validatedItems.map((i) => i.quantity).join(","),
    };

    const paymentPayload = {
      customer: asaasCustomerId,
      billingType: "UNDEFINED", // Permite ao usuário escolher (Pix, Boleto, Cartão) na tela do Asaas
      value: totalAmount,
      dueDate: dueDateString,
      description: `Pedido no E-commerce:\n${descriptionItems}`,
      externalReference: JSON.stringify(externalData), // Limitado a chars, cuidado se for muito longo
      postalService: false,
    };

    const response = await fetch(`${ASAAS_API_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: ASAAS_API_KEY!, // Adicionado o ! aqui
      },
      body: JSON.stringify(paymentPayload),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Asaas Create Error:", data);
        const errorMessage = data.errors?.[0]?.description || "Erro ao criar cobrança no Asaas";
        return { success: false, error: errorMessage };
    }

    // 7. Return Invoice URL
    return { success: true, url: data.invoiceUrl };

  } catch (error) {
    console.error("Checkout error:", error);
    return {
      success: false,
      error: "Algo deu errado. Por favor, tente novamente.",
    };
  }
}

/**
 * Retrieves a checkout session by ID (for success page)
 * No Asaas, isso seria buscar a cobrança pelo ID
 */
export async function getCheckoutSession(paymentId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Não autenticado" };
    }

    const response = await fetch(`${ASAAS_API_URL}/payments/${paymentId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            access_token: ASAAS_API_KEY!, // Adicionado o ! aqui também
        }
    });

    const payment = await response.json();

    if (!response.ok || !payment.id) {
        return { success: false, error: "Pedido não encontrado" };
    }

    // Tentar validar se o pedido pertence ao usuário
    // Parse externalReference para verificar ownership
    let isOwner = false;
    try {
        const metadata = JSON.parse(payment.externalReference || "{}");
        if (metadata.clerkUserId === userId) {
            isOwner = true;
        }
    } catch (e) {
        console.log("Erro ao validar ownership via externalReference", e);
    }

    return {
      success: true,
      session: {
        id: payment.id,
        customerEmail: "Cliente Asaas", // O endpoint /payments/{id} não retorna email do cliente direto
        amountTotal: payment.value * 100, // Frontend espera centavos (padrão stripe/shopify)
        paymentStatus: payment.status, // PENDING, RECEIVED, CONFIRMED
        lineItems: [{
            name: payment.description,
            quantity: 1,
            amount: payment.value * 100
        }],
      },
    };
  } catch (error) {
    console.error("Get session error:", error);
    return { success: false, error: "Não foi possível recuperar os detalhes do pedido" };
  }
}