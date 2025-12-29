import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { client, writeClient } from "@/sanity/lib/client";
import { ORDER_BY_ASAAS_PAYMENT_ID_QUERY } from "@/lib/sanity/queries/orders";

export async function POST(req: Request) {
  const body = await req.json();
  const headersList = await headers();

  // 1. Verificação de Segurança (Autenticação do Webhook)
  const token = headersList.get("asaas-access-token");
  const secret = process.env.ASAAS_WEBHOOK_SECRET;

  if (!token || token !== secret) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid Asaas Token" },
      { status: 401 }
    );
  }

  // 2. Manipular o evento
  const { event, payment } = body;

  try {
    switch (event) {
      case "PAYMENT_CONFIRMED":
      case "PAYMENT_RECEIVED": {
        await handlePaymentConfirmed(payment.id);
        break;
      }
      case "PAYMENT_REFUNDED": {
        // Opcional: Lidar com estorno
        console.log(`Pagamento estornado: ${payment.id}`);
        break;
      }
      default:
        console.log(`Evento ignorado: ${event}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Erro no processamento do webhook:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentConfirmed(asaasPaymentId: string) {
  console.log(`Processando pagamento confirmado: ${asaasPaymentId}`);

  // 1. Buscar o pedido no Sanity pelo ID do Asaas
  // Nota: O pedido já deve ter sido criado como "pending" na action de checkout
  const order = await client.fetch(ORDER_BY_ASAAS_PAYMENT_ID_QUERY, {
    asaasPaymentId,
  });

  if (!order) {
    console.error(`Pedido não encontrado para o pagamento ${asaasPaymentId}`);
    return;
  }

  if (order.status === "paid" || order.status === "shipped") {
    console.log(`Pedido ${order.orderNumber} já está pago. Ignorando.`);
    return;
  }

  // 2. Atualizar status para "paid"
  await writeClient
    .patch(order._id)
    .set({ status: "paid" })
    .commit();

  console.log(`Pedido ${order.orderNumber} atualizado para PAGO.`);

  // 3. Baixar estoque (usando os itens que já estão no pedido salvo)
  if (order.items && order.items.length > 0) {
    const transaction = writeClient.transaction();

    order.items.forEach((item: any) => {
      if (item.product?._ref && item.quantity) {
        transaction.patch(item.product._ref, (p) =>
          p.dec({ stock: item.quantity })
        );
      }
    });

    await transaction.commit();
    console.log(`Estoque atualizado para o pedido ${order.orderNumber}`);
  }
}