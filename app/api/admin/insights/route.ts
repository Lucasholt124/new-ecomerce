import { generateText, gateway } from "ai";
import { client } from "@/sanity/lib/client";
import {
  STATS_ORDERS_LAST_7_DAYS_QUERY,
  STATS_ORDER_STATUS_DISTRIBUTION_QUERY,
  TOP_SELLING_PRODUCTS_QUERY,
  PRODUCTS_INVENTORY_QUERY,
  UNFULFILLED_ORDERS_QUERY,
  REVENUE_BY_PERIOD_QUERY,
} from "@/lib/sanity/queries/stats";

interface OrderItem {
  quantity: number;
  priceAtPurchase: number;
  productName: string;
  productId: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  itemCount: number;
  items: OrderItem[];
}

interface StatusDistribution {
  paid: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

interface ProductSale {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface UnfulfilledOrder {
  _id: string;
  orderNumber: string;
  total: number;
  createdAt: string;
  email: string;
  itemCount: number;
}

interface RevenuePeriod {
  currentPeriod: number;
  previousPeriod: number;
  currentOrderCount: number;
  previousOrderCount: number;
}

export async function GET() {
  try {
    // 1. AJUSTE DE DATA: Buscando 365 dias para aparecerem seus dados de teste antigos
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - (365 * 2) * 24 * 60 * 60 * 1000);

    // Fetch all analytics data in parallel
    const [
      recentOrders,
      statusDistribution,
      productSales,
      productsInventory,
      unfulfilledOrders,
      revenuePeriod,
    ] = await Promise.all([
      client.fetch<Order[]>(STATS_ORDERS_LAST_7_DAYS_QUERY, {
        startDate: sevenDaysAgo.toISOString(),
      }),
      client.fetch<StatusDistribution>(STATS_ORDER_STATUS_DISTRIBUTION_QUERY),
      client.fetch<ProductSale[]>(TOP_SELLING_PRODUCTS_QUERY),
      client.fetch<Product[]>(PRODUCTS_INVENTORY_QUERY),
      client.fetch<UnfulfilledOrder[]>(UNFULFILLED_ORDERS_QUERY),
      client.fetch<RevenuePeriod>(REVENUE_BY_PERIOD_QUERY, {
        currentStart: sevenDaysAgo.toISOString(),
        previousStart: fourteenDaysAgo.toISOString(),
      }),
    ]);

    // Aggregate top selling products
    const productSalesMap = new Map<
      string,
      { name: string; totalQuantity: number; revenue: number }
    >();

    for (const sale of productSales) {
      if (!sale.productId) continue;
      const existing = productSalesMap.get(sale.productId);
      if (existing) {
        existing.totalQuantity += sale.quantity;
        existing.revenue += sale.quantity * (sale.productPrice || 0);
      } else {
        productSalesMap.set(sale.productId, {
          name: sale.productName || "Desconhecido",
          totalQuantity: sale.quantity,
          revenue: sale.quantity * (sale.productPrice || 0),
        });
      }
    }

    const topProducts = Array.from(productSalesMap.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);

    // Find products needing restock (low stock but high sales)
    const productSalesById = new Map(
      Array.from(productSalesMap.entries()).map(([id, data]) => [
        id,
        data.totalQuantity,
      ])
    );

    const needsRestock = productsInventory
      .filter((p) => {
        const salesQty = productSalesById.get(p._id) || 0;
        return p.stock <= 5 && salesQty > 0;
      })
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);

    // Slow moving inventory (in stock but no sales)
    const slowMoving = productsInventory
      .filter((p) => {
        const salesQty = productSalesById.get(p._id) || 0;
        return p.stock > 10 && salesQty === 0;
      })
      .slice(0, 5);

    // Helper to calculate days since order
    const getDaysSinceOrder = (createdAt: string) => {
      const orderDate = new Date(createdAt);
      const diffTime = now.getTime() - orderDate.getTime();
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    };

    // Calculate metrics
    const currentRevenue = revenuePeriod.currentPeriod || 0;
    const previousRevenue = revenuePeriod.previousPeriod || 0;
    const revenueChange =
      previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
        : currentRevenue > 0
        ? 100
        : 0;

    const avgOrderValue =
      recentOrders.length > 0
        ? recentOrders.reduce((sum, o) => sum + (o.total || 0), 0) /
          recentOrders.length
        : 0;

    // Prepare data summary for AI
    const dataSummary = {
      salesTrends: {
        currentWeekRevenue: currentRevenue,
        previousWeekRevenue: previousRevenue,
        revenueChangePercent: revenueChange.toFixed(1),
        currentWeekOrders: revenuePeriod.currentOrderCount || 0,
        previousWeekOrders: revenuePeriod.previousOrderCount || 0,
        avgOrderValue: avgOrderValue.toFixed(2),
        topProducts: topProducts.map((p) => ({
          name: p.name,
          unitsSold: p.totalQuantity,
          revenue: p.revenue.toFixed(2),
        })),
      },
      inventory: {
        needsRestock: needsRestock.map((p) => ({
          name: p.name,
          stock: p.stock,
          category: p.category,
        })),
        slowMoving: slowMoving.map((p) => ({
          name: p.name,
          stock: p.stock,
          category: p.category,
        })),
        totalProducts: productsInventory.length,
        lowStockCount: productsInventory.filter((p) => p.stock <= 5).length,
      },
      operations: {
        statusDistribution,
        unfulfilledOrders: unfulfilledOrders.map((o) => ({
          orderNumber: o.orderNumber,
          total: o.total,
          daysSinceOrder: getDaysSinceOrder(o.createdAt),
          itemCount: o.itemCount,
        })),
        urgentOrders: unfulfilledOrders.filter(
          (o) => getDaysSinceOrder(o.createdAt) > 2
        ).length,
      },
    };

    // 2. CRIAÇÃO DOS DADOS PADRÃO (FALLBACK)
    // Isso garante que o painel mostre dados mesmo sem IA
    let insights = {
      salesTrends: {
        summary: `Receita: R$ ${currentRevenue.toFixed(2)} (${revenueChange > 0 ? "+" : ""}${revenueChange.toFixed(1)}%).`,
        highlights: [
          `${revenuePeriod.currentOrderCount || 0} pedidos no período`,
          `Ticket médio: R$ ${avgOrderValue.toFixed(2)}`,
          topProducts[0] ? `Top: ${topProducts[0].name}` : "Sem vendas recentes",
        ],
        trend: revenueChange > 5 ? "up" as const : revenueChange < -5 ? "down" as const : "stable" as const,
      },
      inventory: {
        summary: `${needsRestock.length} itens com estoque baixo e ${slowMoving.length} parados.`,
        alerts: needsRestock.slice(0, 2).map((p) => `${p.name}: apenas ${p.stock}`),
        recommendations: ["Repor itens mais vendidos", "Criar ofertas para itens parados"],
      },
      actionItems: {
        urgent: unfulfilledOrders.length > 0 ? [`${unfulfilledOrders.length} pedidos a enviar`] : ["Nenhum envio pendente"],
        recommended: ["Verificar níveis de estoque", "Analisar preços"],
        opportunities: ["Destacar produtos populares"],
      },
    };

    // 3. TENTATIVA SEGURA DE USAR IA
    try {
      const { text } = await generateText({
        model: gateway("anthropic/claude-sonnet-4"),
        system: `Você é um analista de e-commerce. Gere um JSON com insights em PT-BR. Use R$.
        Estrutura obrigatória:
        {
          "salesTrends": { "summary": string, "highlights": string[], "trend": "up"|"down"|"stable" },
          "inventory": { "summary": string, "alerts": string[], "recommendations": string[] },
          "actionItems": { "urgent": string[], "recommended": string[], "opportunities": string[] }
        }`,
        prompt: `Dados: ${JSON.stringify(dataSummary)}`,
      });

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // Se der erro (falta de cartão), ignora silenciosamente e usa o objeto 'insights' padrão criado acima
    }

    return Response.json({
      success: true,
      insights,
      rawMetrics: {
        currentRevenue,
        previousRevenue,
        revenueChange: revenueChange.toFixed(1),
        orderCount: revenuePeriod.currentOrderCount || 0,
        avgOrderValue: avgOrderValue.toFixed(2),
        unfulfilledCount: unfulfilledOrders.length,
        lowStockCount: productsInventory.filter((p) => p.stock <= 5).length,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to generate insights:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to generate insights",
      },
      { status: 500 }
    );
  }
}