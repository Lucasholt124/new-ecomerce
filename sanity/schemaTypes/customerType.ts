import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const customerType = defineType({
  name: "customer",
  title: "Cliente",
  type: "document",
  icon: UserIcon,
  groups: [
    { name: "details", title: "Detalhes do Cliente", default: true },
    { name: "asaas", title: "Asaas" }, // Grupo Asaas
  ],
  fields: [
    defineField({
      name: "email",
      title: "E-mail",
      type: "string",
      group: "details",
      validation: (rule) => [rule.required().error("O e-mail é obrigatório")],
    }),
    defineField({
      name: "name",
      title: "Nome",
      type: "string",
      group: "details",
      description: "Nome completo do cliente",
    }),
    defineField({
      name: "clerkUserId",
      title: "ID do Usuário Clerk",
      type: "string",
      group: "details",
      description: "ID do usuário Clerk para autenticação",
    }),
    // --- CAMPO ASAAS ---
    defineField({
      name: "asaasCustomerId",
      title: "ID do Cliente Asaas",
      type: "string",
      group: "asaas",
      readOnly: true,
      description: "ID do cliente Asaas para pagamentos",
      validation: (rule) => [
        rule.required().error("O ID do cliente Asaas é obrigatório"),
      ],
    }),
    // -------------------
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
      email: "email",
      name: "name",
      asaasCustomerId: "asaasCustomerId",
    },
    prepare({ email, name, asaasCustomerId }) {
      return {
        title: name ?? email ?? "Cliente Desconhecido",
        subtitle: asaasCustomerId
          ? `${email ?? ""} • ${asaasCustomerId}`
          : (email ?? ""),
      };
    },
  },
  orderings: [
    {
      title: "Mais recentes primeiro",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
    {
      title: "E-mail A-Z",
      name: "emailAsc",
      by: [{ field: "email", direction: "asc" }],
    },
  ],
});