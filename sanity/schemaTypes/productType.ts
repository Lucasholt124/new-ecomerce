import { COLORS_SANITY_LIST, MATERIALS_SANITY_LIST } from "@/lib/constants/filters";
import { PackageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Produto", // Traduzido
  type: "document",
  icon: PackageIcon,
  groups: [
    { name: "details", title: "Detalhes", default: true }, // Traduzido
    { name: "media", title: "Mídia" }, // Traduzido
    { name: "inventory", title: "Estoque" }, // Traduzido
  ],
  fields: [
    defineField({
      name: "name",
      title: "Nome", // Adicionado
      type: "string",
      group: "details",
      validation: (rule) => [rule.required().error("O nome do produto é obrigatório")], // Traduzido
    }),
    defineField({
      name: "slug",
      title: "Slug", // Adicionado
      type: "slug",
      group: "details",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => [
        rule.required().error("O slug é obrigatório para a geração da URL"), // Traduzido
      ],
    }),
    defineField({
      name: "description",
      title: "Descrição", // Adicionado
      type: "text",
      group: "details",
      rows: 4,
      description: "Descrição do produto", // Traduzido
    }),
    defineField({
      name: "price",
      title: "Preço", // Adicionado
      type: "number",
      group: "details",
      description: "Preço em R$ (ex: 599.99)", // Traduzido e moeda alterada
      validation: (rule) => [
        rule.required().error("O preço é obrigatório"), // Traduzido
        rule.positive().error("O preço deve ser um número positivo"), // Traduzido
      ],
    }),
    defineField({
      name: "category",
      title: "Categoria", // Adicionado
      type: "reference",
      to: [{ type: "category" }],
      group: "details",
      validation: (rule) => [rule.required().error("A categoria é obrigatória")], // Traduzido
    }),
    defineField({
      name: "material",
      title: "Material", // Adicionado
      type: "string",
      group: "details",
      options: {
        list: MATERIALS_SANITY_LIST,
        layout: "radio",
      },
    }),
    defineField({
      name: "color",
      title: "Cor", // Adicionado
      type: "string",
      group: "details",
      options: {
        list: COLORS_SANITY_LIST,
        layout: "radio",
      },
    }),
    defineField({
      name: "dimensions",
      title: "Dimensões", // Adicionado
      type: "string",
      group: "details",
      description: 'ex: "120cm x 80cm x 75cm"', // Traduzido
    }),
    defineField({
      name: "images",
      title: "Imagens", // Adicionado
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (rule) => [
        rule.min(1).error("Pelo menos uma imagem é obrigatória"), // Traduzido
      ],
    }),
    defineField({
      name: "stock",
      title: "Estoque", // Adicionado
      type: "number",
      group: "inventory",
      initialValue: 0,
      description: "Quantidade de itens em estoque", // Traduzido
      validation: (rule) => [
        rule.min(0).error("O estoque não pode ser negativo"), // Traduzido
        rule.integer().error("O estoque deve ser um número inteiro"), // Traduzido
      ],
    }),
    defineField({
      name: "featured",
      title: "Destaque", // Adicionado
      type: "boolean",
      group: "inventory",
      initialValue: false,
      description: "Exibir na página inicial e promoções", // Traduzido
    }),
    defineField({
      name: "assemblyRequired",
      title: "Requer Montagem", // Adicionado
      type: "boolean",
      group: "inventory",
      initialValue: false,
      description: "Este produto requer montagem?", // Traduzido
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category.title",
      media: "images.0",
      price: "price",
    },
    prepare({ title, subtitle, media, price }) {
      return {
        title,
        subtitle: `${subtitle ? subtitle + " • " : ""}R$ ${price ?? 0}`, // Traduzido moeda para R$
        media,
      };
    },
  },
});