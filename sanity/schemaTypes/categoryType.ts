import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Categoria", // Traduzido
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Título", // Adicionado para aparecer "Título" em vez de "Title"
      type: "string",
      validation: (rule) => [
        rule.required().error("O título da categoria é obrigatório"), // Traduzido
      ],
    }),
    defineField({
      name: "slug",
      title: "Slug", // Adicionado
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => [
        rule.required().error("O slug é obrigatório para a geração da URL"), // Traduzido
      ],
    }),
    defineField({
      name: "image",
      title: "Imagem", // Adicionado
      type: "image",
      options: {
        hotspot: true,
      },
      description: "Imagem de miniatura da categoria", // Traduzido
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
});