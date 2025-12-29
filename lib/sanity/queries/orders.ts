import { defineQuery } from "next-sanity";

// Buscar pedidos por usuário (Clerk ID)
export const ORDERS_BY_USER_QUERY = defineQuery(`
  *[_type == "order" && clerkUserId == $clerkUserId] | order(createdAt desc) {
    _id,
    orderNumber,
    total,
    status,
    createdAt,
    "itemNames": items[].product->name,
    "itemImages": items[].product->images[0].asset->url,
    "itemCount": count(items)
  }
`);

// Buscar um pedido específico pelo ID (Usado na página de detalhes do pedido)
export const ORDER_BY_ID_QUERY = defineQuery(`
  *[_type == "order" && _id == $id][0] {
    _id,
    orderNumber,
    clerkUserId,
    email,
    total,
    status,
    createdAt,
    stripePaymentId,
    asaasPaymentId,
    address,
    items[]{
      _key,
      quantity,
      priceAtPurchase,
      product->{
        _id,
        name,
        "slug": slug.current,
        "image": images[0]{
          asset->{
            url
          }
        }
      }
    }
  }
`);

// Buscar um pedido específico pelo ID de pagamento do Asaas
export const ORDER_BY_ASAAS_PAYMENT_ID_QUERY = defineQuery(`
  *[_type == "order" && asaasPaymentId == $asaasPaymentId][0] {
    _id,
    orderNumber,
    status,
    items[]{
      quantity,
      product
    }
  }
`);

// Contar total de pedidos
export const ORDER_COUNT_QUERY = defineQuery(`count(*[_type == "order"])`);

// Calcular receita total (apenas pedidos pagos/enviados/entregues)
export const TOTAL_REVENUE_QUERY = defineQuery(`math::sum(*[
  _type == "order"
  && status in ["paid", "shipped", "delivered"]
].total)`);

// Pedidos dos últimos 7 dias
export const ORDERS_LAST_7_DAYS_QUERY = defineQuery(`*[
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

// Distribuição de status dos pedidos
export const ORDER_STATUS_DISTRIBUTION_QUERY = defineQuery(`{
  "paid": count(*[_type == "order" && status == "paid" && !(_id in path("drafts.**"))]),
  "shipped": count(*[_type == "order" && status == "shipped" && !(_id in path("drafts.**"))]),
  "delivered": count(*[_type == "order" && status == "delivered" && !(_id in path("drafts.**"))]),
  "cancelled": count(*[_type == "order" && status == "cancelled" && !(_id in path("drafts.**"))])
}`);