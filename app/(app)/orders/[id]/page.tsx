import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, CreditCard, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { sanityFetch } from "@/sanity/lib/live";
import { ORDER_BY_ID_QUERY } from "@/lib/sanity/queries/orders";
import { getOrderStatus } from "@/lib/constants/orderStatus";
import { formatPrice, formatDate } from "@/lib/utils";

export const metadata = {
  title: "Detalhes do Pedido | Loja de Móveis",
  description: "Visualize os detalhes do seu pedido",
};

// 1. Definição das Interfaces (Tipagem Manual)
interface OrderItem {
  _key: string;
  quantity: number;
  priceAtPurchase: number;
  product: {
    _id: string;
    name: string;
    slug: string;
    image: {
      asset: {
        url: string;
      } | null;
    } | null;
  } | null;
}

interface Order {
  _id: string;
  orderNumber: string;
  clerkUserId: string;
  email: string;
  total: number;
  status: string;
  createdAt: string;
  stripePaymentId?: string;
  asaasPaymentId?: string;
  address: {
    name: string;
    line1: string;
    line2: string | null;
    city: string;
    postcode: string;
    country: string;
  } | null;
  items: OrderItem[] | null;
}

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
  const { id } = await params;
  const { userId } = await auth();

  // 2. CORREÇÃO: Tipamos o retorno da função, não o genérico da chamada.
  const result = await sanityFetch({
    query: ORDER_BY_ID_QUERY,
    params: { id },
  });

  // Forçamos o TypeScript a entender que 'data' é do tipo Order
  const order = result.data as Order | null;

  // Verifica se o pedido existe e pertence ao usuário atual
  if (!order || order.clerkUserId !== userId) {
    notFound();
  }

  const status = getOrderStatus(order.status);
  const StatusIcon = status.icon;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/orders"
          className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Pedidos
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Pedido #{order.orderNumber}
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Realizado em {formatDate(order.createdAt, "datetime")}
            </p>
          </div>
          <Badge className={`${status.color} flex items-center gap-1.5`}>
            <StatusIcon className="h-4 w-4" />
            {status.label}
          </Badge>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Itens do Pedido */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Itens ({order.items?.length ?? 0})
              </h2>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {/* O erro do 'item' sumirá pois agora 'order.items' tem tipagem correta */}
              {order.items?.map((item) => (
                <div key={item._key} className="flex gap-4 px-6 py-4">
                  {/* Imagem */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                    {item.product?.image?.asset?.url ? (
                      <Image
                        src={item.product.image.asset.url}
                        alt={item.product.name ?? "Produto"}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                        Sem img
                      </div>
                    )}
                  </div>

                  {/* Detalhes */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${item.product?.slug}`}
                        className="font-medium text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
                      >
                        {item.product?.name ?? "Produto Desconhecido"}
                      </Link>
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Qtd: {item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Preço */}
                  <div className="text-right">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {formatPrice(
                        (item.priceAtPurchase ?? 0) * (item.quantity ?? 1),
                      )}
                    </p>
                    {(item.quantity ?? 1) > 1 && (
                      <p className="text-sm text-zinc-500">
                        {formatPrice(item.priceAtPurchase)} cada
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resumo do Pedido & Detalhes */}
        <div className="space-y-6 lg:col-span-2">
          {/* Resumo */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Resumo do Pedido
            </h2>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Subtotal
                </span>
                <span className="text-zinc-900 dark:text-zinc-100">
                  {formatPrice(order.total)}
                </span>
              </div>
              <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800">
                <div className="flex justify-between font-semibold">
                  <span className="text-zinc-900 dark:text-zinc-100">
                    Total
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-100">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Endereço de Entrega */}
          {order.address && (
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-zinc-400" />
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Endereço de Entrega
                </h2>
              </div>
              <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                {order.address.name && <p>{order.address.name}</p>}
                {order.address.line1 && <p>{order.address.line1}</p>}
                {order.address.line2 && <p>{order.address.line2}</p>}
                <p>
                  {[order.address.city, order.address.postcode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {order.address.country && <p>{order.address.country}</p>}
              </div>
            </div>
          )}

          {/* Informações de Pagamento */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-zinc-400" />
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Pagamento
              </h2>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-light tracking-wide">Status</span>
                <span className="text-sm font-medium capitalize text-green-600">
                  {order.status}
                </span>
              </div>
              {order.email && (
                <div className="flex items-center justify-between">
                  <p className="text-xs font-light tracking-wide">E-mail</p>
                  <p className="min-w-0 truncate text-sm text-zinc-900 dark:text-zinc-100">
                    {order.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}