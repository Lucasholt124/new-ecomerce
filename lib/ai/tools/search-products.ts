import { tool } from "ai";
import { z } from "zod";
import { sanityFetch } from "@/sanity/lib/live";
import { AI_SEARCH_PRODUCTS_QUERY } from "@/lib/sanity/queries/products";
import { formatPrice } from "@/lib/utils";
import { getStockStatus, getStockMessage } from "@/lib/constants/stock";
import { MATERIAL_VALUES, COLOR_VALUES } from "@/lib/constants/filters";
import type { AI_SEARCH_PRODUCTS_QUERYResult } from "@/sanity.types";
import type { SearchProduct } from "@/lib/ai/types";

const productSearchSchema = z.object({
  query: z
    .string()
    .optional()
    .default("")
    .describe(
      "Termo de busca para encontrar produtos por nome, descrição ou categoria (ex: 'mesa de carvalho', 'sofá de couro', 'jantar')"
    ),
  category: z
    .string()
    .optional()
    .default("")
    .describe(
      "Filtrar por slug da categoria (ex: 'sofas', 'mesas', 'cadeiras', 'armarios')"
    ),
  material: z
    .enum(["", ...MATERIAL_VALUES])
    .optional()
    .default("")
    .describe("Filtrar por tipo de material"),
  color: z
    .enum(["", ...COLOR_VALUES])
    .optional()
    .default("")
    .describe("Filtrar por cor"),
  minPrice: z
    .number()
    .optional()
    .default(0)
    .describe("Preço mínimo em R$ (ex: 100)"),
  maxPrice: z
    .number()
    .optional()
    .default(0)
    .describe("Preço máximo em R$ (ex: 5000). Use 0 para sem máximo."),
});

export const searchProductsTool = tool({
  description:
    "Busca produtos na loja de móveis. Pode buscar por nome, descrição ou categoria, e filtrar por material, cor e faixa de preço. Retorna detalhes do produto incluindo disponibilidade de estoque.",
  inputSchema: productSearchSchema,
  execute: async ({ query, category, material, color, minPrice, maxPrice }) => {
    console.log("[SearchProducts] Query recebida:", {
      query,
      category,
      material,
      color,
      minPrice,
      maxPrice,
    });

    try {
      const { data: products } = await sanityFetch({
        query: AI_SEARCH_PRODUCTS_QUERY,
        params: {
          searchQuery: query || "",
          categorySlug: category || "",
          material: material || "",
          color: color || "",
          minPrice: minPrice || 0,
          maxPrice: maxPrice || 0,
        },
      });

      console.log("[SearchProducts] Produtos encontrados:", products.length);

      if (products.length === 0) {
        return {
          found: false,
          message:
            "Nenhum produto encontrado com seus critérios. Tente termos ou filtros diferentes.",
          products: [],
          filters: {
            query,
            category,
            material,
            color,
            minPrice,
            maxPrice,
          },
        };
      }

      // Formatar resultados com status de estoque para a IA comunicar
      const formattedProducts: SearchProduct[] = (
        products as AI_SEARCH_PRODUCTS_QUERYResult
      ).map((product) => ({
        id: product._id,
        name: product.name ?? null,
        slug: product.slug ?? null,
        description: product.description ?? null,
        price: product.price ?? null,
        priceFormatted: product.price ? formatPrice(product.price) : null,
        category: product.category?.title ?? null,
        categorySlug: product.category?.slug ?? null,
        material: product.material ?? null,
        color: product.color ?? null,
        dimensions: product.dimensions ?? null,
        stockCount: product.stock ?? 0,
        stockStatus: getStockStatus(product.stock),
        stockMessage: getStockMessage(product.stock),
        featured: product.featured ?? false,
        assemblyRequired: product.assemblyRequired ?? false,
        imageUrl: product.image?.asset?.url ?? null,
        productUrl: product.slug ? `/products/${product.slug}` : null,
      }));

      return {
        found: true,
        message: `Encontrado(s) ${products.length} produto(s) correspondente(s) à sua busca.`,
        totalResults: products.length,
        products: formattedProducts,
        filters: {
          query,
          category,
          material,
          color,
          minPrice,
          maxPrice,
        },
      };
    } catch (error) {
      console.error("[SearchProducts] Erro:", error);
      return {
        found: false,
        message: "Ocorreu um erro ao buscar produtos.",
        products: [],
        error: error instanceof Error ? error.message : "Erro desconhecido",
        filters: {
          query,
          category,
          material,
          color,
          minPrice,
          maxPrice,
        },
      };
    }
  },
});