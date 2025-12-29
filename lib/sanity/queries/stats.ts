import { defineQuery } from "next-sanity";

// ============================================
// Métricas Básicas (Cards do Dashboard)
// ============================================

/**
 * Contagem total de produtos
 */
export const PRODUCT_COUNT_QUERY = defineQuery(`count(*[_type == "product"])`);

/**
 * Contagem total de pedidos (Renomeado para evitar conflito com orders.ts)
 */
export const STATS_ORDER_COUNT_QUERY = defineQuery(`count(*[_type == "order"])`);

/**
 * Receita total de pedidos concluídos (Renomeado)
 */
export const STATS_TOTAL_REVENUE_QUERY = defineQuery(`math::sum(*[
  _type == "order"
  && status in ["paid", "shipped", "delivered"]
].total)`);

// ============================================
// Queries Avançadas para Insights da IA
// ============================================

/**
 * Pedidos dos últimos 7 dias com detalhes (Renomeado)
 * Exclui rascunhos
 */
export const STATS_ORDERS_LAST_7_DAYS_QUERY = defineQuery(`*[
  _type == "order"
  && createdAt >= $startDate
  && !(_id in path("drafts.**"))
] | order(createdAt desc) {
  _id,
  orderNumber,
  total,
  status,
  createdAt,
  "itemCount": count(items),
  items[]{
    quantity,
    priceAtPurchase,
    "productName": product->name,
    "productId": product->_id
  }
}`);

/**
 * Distribuição de status dos pedidos (Renomeado)
 * Exclui rascunhos para contagem precisa
 */
export const STATS_ORDER_STATUS_DISTRIBUTION_QUERY = defineQuery(`{
  "paid": count(*[_type == "order" && status == "paid" && !(_id in path("drafts.**"))]),
  "shipped": count(*[_type == "order" && status == "shipped" && !(_id in path("drafts.**"))]),
  "delivered": count(*[_type == "order" && status == "delivered" && !(_id in path("drafts.**"))]),
  "cancelled": count(*[_type == "order" && status == "cancelled" && !(_id in path("drafts.**"))])
}`);

/**
 * Produtos mais vendidos por quantidade
 * Exclui rascunhos
 */
export const TOP_SELLING_PRODUCTS_QUERY = defineQuery(`*[
  _type == "order"
  && status in ["paid", "shipped", "delivered"]
  && !(_id in path("drafts.**"))
] {
  items[]{
    "productId": product->_id,
    "productName": product->name,
    "productPrice": product->price,
    quantity
  }
}.items[]`);

/**
 * Inventário completo com dados de estoque para análise
 */
export const PRODUCTS_INVENTORY_QUERY = defineQuery(`*[_type == "product" && !(_id in path("drafts.**"))] {
  _id,
  name,
  price,
  stock,
  "category": category->title
}`);

/**
 * Pedidos não atendidos (pagos mas não enviados)
 * Exclui rascunhos
 */
export const UNFULFILLED_ORDERS_QUERY = defineQuery(`*[
  _type == "order"
  && status == "paid"
  && !(_id in path("drafts.**"))
] | order(createdAt asc) {
  _id,
  orderNumber,
  total,
  createdAt,
  email,
  "itemCount": count(items)
}`);

/**
 * Comparação de receita (período atual vs anterior)
 * Exclui rascunhos
 */
export const REVENUE_BY_PERIOD_QUERY = defineQuery(`{
  "currentPeriod": math::sum(*[
    _type == "order"
    && status in ["paid", "shipped", "delivered"]
    && createdAt >= $currentStart
    && !(_id in path("drafts.**"))
  ].total),
  "previousPeriod": math::sum(*[
    _type == "order"
    && status in ["paid", "shipped", "delivered"]
    && createdAt >= $previousStart
    && createdAt < $currentStart
    && !(_id in path("drafts.**"))
  ].total),
  "currentOrderCount": count(*[
    _type == "order"
    && createdAt >= $currentStart
    && !(_id in path("drafts.**"))
  ]),
  "previousOrderCount": count(*[
    _type == "order"
    && createdAt >= $previousStart
    && createdAt < $currentStart
    && !(_id in path("drafts.**"))
  ])
}`);