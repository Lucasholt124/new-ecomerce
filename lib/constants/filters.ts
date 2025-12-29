// ============================================
// Product Attribute Constants
// Shared between frontend filters and Sanity schema
// ============================================

export const COLORS = [
  { value: "black", label: "Preto" },
  { value: "white", label: "Branco" },
  { value: "oak", label: "Carvalho" },
  { value: "walnut", label: "Nogueira" },
  { value: "grey", label: "Cinza" },
  { value: "natural", label: "Natural" },
] as const;

export const MATERIALS = [
  { value: "wood", label: "Madeira" },
  { value: "metal", label: "Metal" },
  { value: "fabric", label: "Tecido" },
  { value: "leather", label: "Couro" },
  { value: "glass", label: "Vidro" },
] as const;

export const SORT_OPTIONS = [
  { value: "name", label: "Nome (A-Z)" },
  { value: "price_asc", label: "Preço: Menor para Maior" },
  { value: "price_desc", label: "Preço: Maior para Menor" },
  { value: "relevance", label: "Relevância" },
] as const;

// Type exports
export type ColorValue = (typeof COLORS)[number]["value"];
export type MaterialValue = (typeof MATERIALS)[number]["value"];
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

// ============================================
// Sanity Schema Format Exports
// Format compatible with Sanity's options.list
// ============================================

/** Colors formatted for Sanity schema options.list */
export const COLORS_SANITY_LIST = COLORS.map(({ value, label }) => ({
  title: label,
  value,
}));

/** Materials formatted for Sanity schema options.list */
export const MATERIALS_SANITY_LIST = MATERIALS.map(({ value, label }) => ({
  title: label,
  value,
}));

/** Color values array for zod enums or validation */
export const COLOR_VALUES = COLORS.map((c) => c.value) as [
  ColorValue,
  ...ColorValue[],
];

/** Material values array for zod enums or validation */
export const MATERIAL_VALUES = MATERIALS.map((m) => m.value) as [
  MaterialValue,
  ...MaterialValue[],
];