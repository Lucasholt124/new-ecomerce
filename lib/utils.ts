import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata um valor monetário para o padrão Brasileiro (BRL)
 * @param amount - O valor do preço (pode ser nulo/indefinido)
 * @returns String de preço formatada (ex: "R$ 1.599,90")
 */
export function formatPrice(amount: number | null | undefined): string {
  if (amount === undefined || amount === null) {
    return "R$ 0,00";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

type DateFormatOption = "short" | "long" | "datetime";

const DATE_FORMAT_OPTIONS: Record<
  DateFormatOption,
  Intl.DateTimeFormatOptions
> = {
  short: { day: "numeric", month: "short" },
  long: { day: "numeric", month: "long", year: "numeric" },
  datetime: {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  },
};

/**
 * Formata uma string de data com formatação específica do local (pt-BR)
 */
export function formatDate(
  date: string | null | undefined,
  format: DateFormatOption = "long",
  fallback = "Data desconhecida"
): string {
  if (!date) return fallback;
  return new Date(date).toLocaleDateString(
    "pt-BR", // Garante formato brasileiro
    DATE_FORMAT_OPTIONS[format]
  );
}

/**
 * Formata um número de pedido para exibição
 */
export function formatOrderNumber(
  orderNumber: string | null | undefined
): string {
  if (!orderNumber) return "N/D";
  return orderNumber.split("-").pop() ?? orderNumber;
}