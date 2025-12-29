import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

// Se você não tiver esse arquivo de constantes, o código vai quebrar.
// Vou colocar a lista direto aqui para garantir que funcione agora.
const ORDER_STATUS_LIST = [
  { title: "Pendente", value: "pending" },
  { title: "Pago", value: "paid" },
  { title: "Enviado", value: "shipped" },
  { title: "Entregue", value: "delivered" },
  { title: "Cancelado", value: "cancelled" },
];

export const orderType = defineType({
  name: "order",
  title: "Pedido",
  type: "document",
  icon: BasketIcon,
  groups: [
    { name: "details", title: "Detalhes do Pedido", default: true },
    { name: "customer", title: "Cliente" },
    { name: "payment", title: "Pagamento" },
  ],
  fields: [
    defineField({
      name: "orderNumber",
      title: "Número do Pedido",
      type: "string",
      group: "details",
      readOnly: true,
      validation: (rule) => [rule.required().error("O número do pedido é obrigatório")],
    }),
    defineField({
      name: "items",
      title: "Itens",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Produto",
              type: "reference",
              to: [{ type: "product" }],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "quantity",
              title: "Quantidade",
              type: "number",
              initialValue: 1,
              validation: (rule) => rule.required().min(1),
            }),
            defineField({
              name: "priceAtPurchase",
              title: "Preço na Compra",
              type: "number",
              description: "Preço no momento da compra",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "product.name",
              quantity: "quantity",
              price: "priceAtPurchase",
              media: "product.images.0",
            },
            prepare({ title, quantity, price, media }) {
              return {
                title: title ?? "Produto",
                subtitle: `Qtd: ${quantity} • R$ ${price}`,
                media,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "total",
      title: "Total",
      type: "number",
      group: "details",
      readOnly: true,
      description: "Valor total do pedido",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "details",
      initialValue: "paid",
      options: {
        list: ORDER_STATUS_LIST,
        layout: "radio",
      },
    }),
    defineField({
      name: "customer",
      title: "Cliente",
      type: "reference",
      to: [{ type: "customer" }],
      group: "customer",
      description: "Referência ao registro do cliente",
    }),
    defineField({
      name: "clerkUserId",
      title: "ID do Usuário Clerk",
      type: "string",
      group: "customer",
      readOnly: true,
      description: "ID do usuário Clerk",
    }),
    defineField({
      name: "email",
      title: "E-mail",
      type: "string",
      group: "customer",
      readOnly: true,
    }),
    defineField({
      name: "address",
      title: "Endereço",
      type: "object",
      group: "customer",
      fields: [
        defineField({ name: "name", type: "string", title: "Nome Completo" }),
        defineField({ name: "line1", type: "string", title: "Endereço Linha 1" }),
        defineField({ name: "line2", type: "string", title: "Endereço Linha 2" }),
        defineField({ name: "city", type: "string", title: "Cidade" }),
        defineField({ name: "postcode", type: "string", title: "CEP" }),
        defineField({ name: "country", type: "string", title: "País" }),
      ],
    }),
    // --- CAMPO DO ASAAS ---
    defineField({
      name: "asaasPaymentId",
      title: "ID de Pagamento Asaas",
      type: "string",
      group: "payment",
      readOnly: true,
      description: "ID da cobrança/pagamento no Asaas",
    }),
    // ----------------------
    defineField({
      name: "createdAt",
      title: "Criado em",
      type: "datetime",
      group: "details",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      orderNumber: "orderNumber",
      email: "email",
      total: "total",
      status: "status",
    },
    prepare({ orderNumber, email, total, status }) {
      return {
        title: `Pedido ${orderNumber ?? "N/A"}`,
        subtitle: `${email ?? "Sem e-mail"} • R$ ${total ?? 0} • ${status ?? "pago"}`,
      };
    },
  },
  orderings: [
    {
      title: "Mais recentes primeiro",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
});