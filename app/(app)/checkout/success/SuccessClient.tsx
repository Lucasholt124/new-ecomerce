"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCartActions } from "@/lib/store/cart-store-provider";

interface SuccessClientProps {
  // Mantive a estrutura flexível para funcionar com os dados que vêm do servidor
  session: {
    id: string;
    customerEmail?: string | null;
    customerName?: string | null;
    amountTotal?: number | null;
    paymentStatus: string;
    shippingAddress?: {
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      state?: string | null;
      postal_code?: string | null;
      country?: string | null;
    } | null;
    lineItems?: {
      name?: string | null;
      quantity?: number | null;
      amount: number;
    }[];
  };
}

export function SuccessClient({ session }: SuccessClientProps) {
  const { clearCart } = useCartActions();

  // Limpa o carrinho assim que a página de sucesso carrega
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const address = session.shippingAddress;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Pedido Confirmado!
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Obrigado pela sua compra. Enviamos uma confirmação para{" "}
          <span className="font-medium">{session.customerEmail}</span>
        </p>
      </div>

      {/* Detalhes do Pedido */}
      <div className="mt-10 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
            Detalhes do Pedido
          </h2>
        </div>

        <div className="px-6 py-4">
          {/* Itens */}
          {session.lineItems && session.lineItems.length > 0 && (
            <div className="space-y-3">
              {session.lineItems.map((item) => (
                <div
                  key={`${item.name}-${item.quantity}-${item.amount}`}
                  className="flex justify-between text-sm"
                >
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {formatPrice(item.amount / 100)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Total */}
          <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <div className="flex justify-between text-base font-semibold">
              <span className="text-zinc-900 dark:text-zinc-100">Total</span>
              <span className="text-zinc-900 dark:text-zinc-100">
                {formatPrice((session.amountTotal ?? 0) / 100)}
              </span>
            </div>
          </div>
        </div>

        {/* Endereço de Entrega */}
        {address && (
          <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Entregar em
            </h3>
            <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {session.customerName && <p>{session.customerName}</p>}
              {address.line1 && <p>{address.line1}</p>}
              {address.line2 && <p>{address.line2}</p>}
              <p>
                {[address.city, address.state, address.postal_code]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {address.country && <p>{address.country}</p>}
            </div>
          </div>
        )}

        {/* Status do Pagamento */}
        <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-zinc-400" />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Status do pagamento:{" "}
              <span className="font-medium capitalize text-green-600">
                {session.paymentStatus === "paid" ? "Pago" : session.paymentStatus}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild variant="outline">
          <Link href="/orders">
            Ver Meus Pedidos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild>
          <Link href="/">Continuar Comprando</Link>
        </Button>
      </div>
    </div>
  );
}