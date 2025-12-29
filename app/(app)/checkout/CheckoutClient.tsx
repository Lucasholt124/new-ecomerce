"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react"; // Adicionado
import { ArrowLeft, ShoppingBag, AlertTriangle, Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Certifique-se de ter este componente
import { Label } from "@/components/ui/label"; // Certifique-se de ter este componente
import { formatPrice } from "@/lib/utils";
import {
  useCartItems,
  useTotalPrice,
  useTotalItems,
} from "@/lib/store/cart-store-provider";
import { useCartStock } from "@/lib/hooks/useCartStock";
import { CheckoutButton } from "@/components/app/CheckoutButton";

// --- Funções Auxiliares de CPF (Totalmente funcionais) ---

// Formata o CPF visualmente (000.000.000-00)
const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

// Validação matemática real de CPF (Algoritmo da Receita Federal)
const isValidCPF = (cpf: string) => {
  if (typeof cpf !== "string") return false;
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;

  const values = cpf.split("").map((el) => +el);
  const rest = (count: number) =>
    ((values
      .slice(0, count - 12)
      .reduce((syt, el, idx) => syt + el * (count - idx), 0) *
      10) %
      11) %
    10;

  return rest(10) === values[9] && rest(11) === values[10];
};

export function CheckoutClient() {
  const items = useCartItems();
  const totalPrice = useTotalPrice();
  const totalItems = useTotalItems();
  const { stockMap, isLoading, hasStockIssues } = useCartStock(items);

  // Estados para o CPF
  const [cpf, setCpf] = useState("");
  const [cpfError, setCpfError] = useState("");

  // Handler para mudança do input
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatCPF(rawValue);
    setCpf(formattedValue);

    // Validação em tempo real
    if (formattedValue.length >= 14) {
      if (!isValidCPF(formattedValue)) {
        setCpfError("CPF inválido.");
      } else {
        setCpfError("");
      }
    } else {
        // Limpa erro enquanto digita, mas valida no final
       setCpfError("");
    }
  };

  // Verifica se o formulário está pronto para envio
  const isCpfValid = cpf.length === 14 && isValidCPF(cpf);
  const isReadyToCheckout = !isLoading && !hasStockIssues && isCpfValid;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-zinc-300 dark:text-zinc-600" />
          <h1 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Seu carrinho está vazio
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Adicione alguns itens ao seu carrinho antes de finalizar.
          </p>
          <Button asChild className="mt-8">
            <Link href="/">Continuar Comprando</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continuar Comprando
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Finalizar Compra
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Cart Items */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Resumo do Pedido ({totalItems} itens)
              </h2>
            </div>

            {/* Stock Issues Warning */}
            {hasStockIssues && !isLoading && (
              <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span>
                  Alguns itens têm problemas de estoque. Por favor, atualize seu carrinho antes de prosseguir.
                </span>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                <span className="ml-2 text-sm text-zinc-500">
                  Verificando estoque...
                </span>
              </div>
            )}

            {/* Items List */}
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {items.map((item) => {
                const stockInfo = stockMap.get(item.productId);
                const hasIssue =
                  stockInfo?.isOutOfStock || stockInfo?.exceedsStock;

                return (
                  <div
                    key={item.productId}
                    className={`flex gap-4 px-6 py-4 ${
                      hasIssue ? "bg-red-50 dark:bg-red-950/20" : ""
                    }`}
                  >
                    {/* Image */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                          Sem imagem
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                          Qtd: {item.quantity}
                        </p>
                        {stockInfo?.isOutOfStock && (
                          <p className="mt-1 text-sm font-medium text-red-600">
                            Esgotado
                          </p>
                        )}
                        {stockInfo?.exceedsStock && !stockInfo.isOutOfStock && (
                          <p className="mt-1 text-sm font-medium text-amber-600">
                            Apenas {stockInfo.currentStock} disponíveis
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-zinc-500">
                          {formatPrice(item.price)} cada
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Total & Checkout */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Resumo do Pagamento
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Subtotal
                </span>
                <span className="text-zinc-900 dark:text-zinc-100">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Frete
                </span>
                <span className="text-zinc-900 dark:text-zinc-100">
                  Calculado na finalização
                </span>
              </div>
              <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-zinc-900 dark:text-zinc-100">
                    Total
                  </span>
                  <span className="text-zinc-900 dark:text-zinc-100">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* --- INPUT DE CPF OBRIGATÓRIO PARA O ASAAS --- */}
            <div className="mt-6 space-y-2">
              <Label htmlFor="cpf" className="text-sm font-medium">
                CPF do Titular <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCpfChange}
                  maxLength={14}
                  className={`pl-9 ${
                    cpfError ? "border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                />
              </div>
              {cpfError && (
                <p className="text-xs text-red-500">{cpfError}</p>
              )}
              <p className="text-xs text-zinc-500">
                Obrigatório para emissão da cobrança e nota fiscal.
              </p>
            </div>

            <div className="mt-6">
              {/* Passamos o CPF para o botão de Checkout */}
              <CheckoutButton
                disabled={!isReadyToCheckout}
                cpf={cpf.replace(/\D/g, "")} // Envia apenas números
              />
            </div>

            <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
              Você será redirecionado para o checkout seguro do Asaas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}