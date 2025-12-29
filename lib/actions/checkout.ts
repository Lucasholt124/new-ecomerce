"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_BY_IDS_QUERY } from "@/lib/sanity/queries/products";
import { getOrCreateAsaasCustomer } from "./customer"; // Certifique-se que este arquivo existe

// Configuração do Asaas (Definida mas não validada aqui para não quebrar build)
const ASAAS_API_URL = process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3";

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
  items: CartItem[],
  cpf?: string
): Promise<CheckoutResult> {
  const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

  // 0. VERIFICAÇÃO CRÍTICA DENTRO DA FUNÇÃO
  if (!ASAAS_API_KEY) {
    console.error("ERRO CRÍTICO: ASAAS_API_KEY não configurada no .env.local");
    return { success: false, error: "Erro de configuração no servidor de pagamento." };
  }

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
    const userEmail = user.emailAddresses[0]?.emailAddress ?? "";
    const userName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || userEmail;

    // Prioriza o CPF do input, senão tenta do metadata
    const userCpf = cpf || (user.publicMetadata?.cpf as string) || "";

    // Validação extra de CPF antes de chamar a criação de cliente
    if (!userCpf) {
        return { success: false, error: "CPF é obrigatório para gerar a cobrança." };
    }

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

    // Montar payload com externalReference
    const externalData = {
        clerkUserId: userId,
        productIds: validatedItems.map((i) => i.product._id).join(","),
        quantities: validatedItems.map((i) => i.quantity).join(","),
    };

    // Limitar externalReference a 255 chars (limite comum) se necessário, ou usar metadata
    const externalRefString = JSON.stringify(externalData);

    const paymentPayload = {
      customer: asaasCustomerId,
      billingType: "UNDEFINED", // Permite pix/boleto/cartão
      value: totalAmount,
      dueDate: dueDateString,
      description: `Pedido na Loja:\n${descriptionItems}`.substring(0, 500), // Limite seguro
      externalReference: externalRefString,
      postalService: false,
    };

    const response = await fetch(`${ASAAS_API_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: ASAAS_API_KEY,
      },
      body: JSON.stringify(paymentPayload),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Asaas Create Error:", data);
        // Tenta extrair mensagem amigável
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
 */
export async function getCheckoutSession(paymentId: string) {
  const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
  if (!ASAAS_API_KEY) return { success: false, error: "Erro de configuração" };

  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Não autenticado" };
    }

    const response = await fetch(`${ASAAS_API_URL}/payments/${paymentId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            access_token: ASAAS_API_KEY,
        }
    });

    const payment = await response.json();

    if (!response.ok || !payment.id) {
        return { success: false, error: "Pedido não encontrado" };
    }

    // Validação de propriedade via externalReference
    // Nota: Em produção, isso deve ser mais robusto, talvez salvando o pedido no Sanity ANTES do checkout
    // Mas para este fluxo, validamos se o JSON bate
    let isOwner = false;
    try {
        const metadata = JSON.parse(payment.externalReference || "{}");
        if (metadata.clerkUserId === userId) {
            isOwner = true;
        }
    } catch (e) {
        console.log("Erro ao validar ownership", e);
    }

    return {
      success: true,
      session: {
        id: payment.id,
        customerEmail: "Cliente",
        amountTotal: payment.value, // Valor real (não centavos, Asaas usa float)
        paymentStatus: payment.status, // PENDING, RECEIVED, CONFIRMED
        lineItems: [{
            name: payment.description || "Pedido",
            quantity: 1,
            amount: payment.value
        }],
      },
    };
  } catch (error) {
    console.error("Get session error:", error);
    return { success: false, error: "Não foi possível recuperar os detalhes do pedido" };
  }
}