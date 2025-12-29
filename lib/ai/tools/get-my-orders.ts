import { tool } from "ai";
import { z } from "zod";
import { sanityFetch } from "@/sanity/lib/live";
import { ORDERS_BY_USER_QUERY } from "@/lib/sanity/queries/orders";
import {
  ORDER_STATUS_VALUES,
  getOrderStatusEmoji,
} from "@/lib/constants/orderStatus";
import { formatPrice } from "@/lib/utils";

// --- TIPAGEM MANUAL (Para evitar erro do sanity.types) ---
interface SanityOrder {
  _id: string;
  orderNumber: string | null;
  total: number | null;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | null;
  itemCount: number | null;
  itemNames: (string | null)[] | null;
  itemImages: (string | null)[] | null;
  createdAt: string | null;
}
// ---------------------------------------------------------

const getMyOrdersSchema = z.object({
  status: z
    .enum(["", ...ORDER_STATUS_VALUES])
    .optional()
    .default("")
    .describe("Filtrar pedidos por status (deixe vazio para todos os pedidos)"),
});

export interface OrderSummary {
  id: string;
  orderNumber: string | null;
  total: number | null;
  totalFormatted: string | null;
  status: string | null;
  statusDisplay: string;
  itemCount: number;
  itemNames: string[];
  itemImages: string[];
  createdAt: string | null;
  orderUrl: string;
}

export interface GetMyOrdersResult {
  found: boolean;
  message: string;
  orders: OrderSummary[];
  totalOrders: number;
  isAuthenticated: boolean;
  error?: string;
}

/**
 * Creates a getMyOrders tool bound to a specific user ID
 * Returns null if no userId provided (user not authenticated)
 */
export function createGetMyOrdersTool(userId: string | null) {
  if (!userId) {
    return null;
  }

  return tool({
    description:
      "Obter os pedidos do usuário atual. Pode filtrar opcionalmente por status. Funciona apenas para usuários autenticados.",
    inputSchema: getMyOrdersSchema,
    execute: async ({ status }) => {
      console.log("[GetMyOrders] Buscando pedidos para o usuário:", userId, {
        status,
      });

      try {
        const { data: orders } = await sanityFetch({
          query: ORDERS_BY_USER_QUERY,
          params: { clerkUserId: userId },
        });

        console.log("[GetMyOrders] Pedidos encontrados:", orders.length);

        // Filter by status if provided
        // Usamos a tipagem manual aqui
        let filteredOrders = orders as SanityOrder[];

        if (status) {
          filteredOrders = filteredOrders.filter(
            (order) => order.status === status
          );
        }

        if (filteredOrders.length === 0) {
          return {
            found: false,
            message: status
              ? `Nenhum pedido encontrado com status "${status}".`
              : "Você ainda não tem pedidos.",
            orders: [],
            totalOrders: 0,
            isAuthenticated: true,
          } satisfies GetMyOrdersResult;
        }

        const formattedOrders: OrderSummary[] = filteredOrders.map((order) => ({
          id: order._id,
          orderNumber: order.orderNumber,
          total: order.total,
          totalFormatted: order.total ? formatPrice(order.total) : null,
          status: order.status,
          statusDisplay: getOrderStatusEmoji(order.status),
          itemCount: order.itemCount ?? 0,
          itemNames: (order.itemNames ?? []).filter(
            (name): name is string => name !== null
          ),
          itemImages: (order.itemImages ?? []).filter(
            (url): url is string => url !== null
          ),
          createdAt: order.createdAt,
          orderUrl: `/orders/${order._id}`,
        }));

        return {
          found: true,
          message: `Encontrei ${filteredOrders.length} pedido${filteredOrders.length === 1 ? "" : "s"}.`,
          orders: formattedOrders,
          totalOrders: filteredOrders.length,
          isAuthenticated: true,
        } satisfies GetMyOrdersResult;
      } catch (error) {
        console.error("[GetMyOrders] Erro:", error);
        return {
          found: false,
          message: "Ocorreu um erro ao buscar seus pedidos.",
          orders: [],
          totalOrders: 0,
          isAuthenticated: true,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        };
      }
    },
  });
}