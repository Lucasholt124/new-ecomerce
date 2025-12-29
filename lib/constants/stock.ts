/**
 * Limite de estoque para avisos de "estoque baixo"
 * Produtos neste nível ou abaixo mostrarão indicadores de estoque baixo
 */
export const LOW_STOCK_THRESHOLD = 5;

/**
 * Verifica se um produto é considerado com estoque baixo
 * @param stock - Contagem atual do estoque
 * @returns true se o estoque for maior que 0 mas menor ou igual ao limite
 */
export const isLowStock = (stock: number): boolean =>
  stock > 0 && stock <= LOW_STOCK_THRESHOLD;

/**
 * Verifica se um produto está esgotado
 * @param stock - Contagem atual do estoque
 * @returns true se o estoque for 0 ou menos
 */
export const isOutOfStock = (stock: number): boolean => stock <= 0;

/**
 * Obtém o status do estoque para fins de exibição
 * @param stock - Contagem atual do estoque
 * @returns Status do estoque: "out_of_stock", "low_stock", "in_stock" ou "unknown"
 */
export const getStockStatus = (
  stock: number | null | undefined
): "out_of_stock" | "low_stock" | "in_stock" | "unknown" => {
  if (stock === null || stock === undefined) return "unknown";
  if (stock <= 0) return "out_of_stock";
  if (stock <= LOW_STOCK_THRESHOLD) return "low_stock";
  return "in_stock";
};

/**
 * Obtém mensagem de estoque legível para humanos
 * @param stock - Contagem atual do estoque
 * @returns Mensagem descritiva do estoque
 */
export const getStockMessage = (stock: number | null | undefined): string => {
  const status = getStockStatus(stock);
  switch (status) {
    case "out_of_stock":
      return "ESGOTADO - Atualmente indisponível"; // Traduzido
    case "low_stock":
      return `ESTOQUE BAIXO - Restam apenas ${stock}`; // Traduzido
    case "in_stock":
      return `Em estoque (${stock} disponíveis)`; // Traduzido
    default:
      return "Status de estoque desconhecido"; // Traduzido
  }
};