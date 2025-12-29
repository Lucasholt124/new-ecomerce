// components/app/CartSheet.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Loader2,
  ShoppingBag,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  Package,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  useCartItems,
  useCartIsOpen,
  useCartActions,
  useTotalItems,
  useTotalPrice,
} from "@/lib/store/cart-store-provider";
import { useCartStock } from "@/lib/hooks/useCartStock";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { cn, formatPrice } from "@/lib/utils";

// Threshold para frete grátis
const FREE_SHIPPING_THRESHOLD = 299;

export function CartSheet() {
  const items = useCartItems();
  const isOpen = useCartIsOpen();
  const totalItems = useTotalItems();
  const totalPrice = useTotalPrice();
  const { closeCart } = useCartActions();
  const { stockMap, isLoading, hasStockIssues } = useCartStock(items);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calcula progresso para frete grátis
  const shippingProgress = Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - totalPrice;
  const hasFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;

  // Animação quando abre
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        className={cn(
          "flex w-full flex-col p-0",
          "sm:max-w-md md:max-w-lg",
          "bg-zinc-50 dark:bg-zinc-900"
        )}
      >
        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <SheetHeader
          className={cn(
            "relative",
            "px-5 py-4",
            "bg-white dark:bg-zinc-950",
            "border-b border-zinc-200 dark:border-zinc-800"
          )}
        >
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center",
                  "rounded-full",
                  "bg-zinc-100 dark:bg-zinc-800",
                  isAnimating && "animate-bounce"
                )}
              >
                <ShoppingBag className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
              </div>
              <div>
                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Seu Carrinho
                </span>
                <p className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                  {totalItems === 0 ? (
                    "Nenhum item"
                  ) : (
                    <>
                      {totalItems} {totalItems === 1 ? "item" : "itens"}
                      {isLoading && (
                        <Loader2 className="ml-1 inline h-3 w-3 animate-spin" />
                      )}
                    </>
                  )}
                </p>
              </div>
            </SheetTitle>

            {/* Custom Close Button */}
            <button
              onClick={() => closeCart()}
              className={cn(
                "flex h-8 w-8 items-center justify-center",
                "rounded-full",
                "text-zinc-400 hover:text-zinc-600",
                "dark:text-zinc-500 dark:hover:text-zinc-300",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                "transition-colors duration-200"
              )}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Fechar carrinho</span>
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          {items.length > 0 && (
            <div className="mt-4">
              {hasFreeShipping ? (
                <div
                  className={cn(
                    "flex items-center gap-2",
                    "px-3 py-2",
                    "bg-green-50 dark:bg-green-950/30",
                    "border border-green-200 dark:border-green-900",
                    "rounded-lg"
                  )}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                    <Truck className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    Parabéns! Você ganhou frete grátis 🎉
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400">
                      Frete grátis a partir de {formatPrice(FREE_SHIPPING_THRESHOLD)}
                    </span>
                    <span className="font-medium text-amber-600 dark:text-amber-400">
                      Faltam {formatPrice(remainingForFreeShipping)}
                    </span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0",
                        "bg-gradient-to-r from-amber-500 to-orange-500",
                        "rounded-full",
                        "transition-all duration-500 ease-out"
                      )}
                      style={{ width: `${shippingProgress}%` }}
                    />
                    {/* Animated shimmer */}
                    <div
                      className={cn(
                        "absolute inset-0",
                        "bg-gradient-to-r from-transparent via-white/30 to-transparent",
                        "-translate-x-full animate-[shimmer_2s_infinite]"
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetHeader>

        {/* ============================================ */}
        {/* CONTENT */}
        {/* ============================================ */}
        {items.length === 0 ? (
          /* Empty State */
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div
              className={cn(
                "flex h-20 w-20 items-center justify-center",
                "rounded-full",
                "bg-zinc-100 dark:bg-zinc-800"
              )}
            >
              <Package className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
            </div>

            <h3 className="mt-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Seu carrinho está vazio
            </h3>
            <p className="mt-2 max-w-[240px] text-sm text-zinc-500 dark:text-zinc-400">
              Explore nossa coleção e encontre peças perfeitas para sua casa
            </p>

            <Button
              onClick={() => closeCart()}
              className={cn(
                "mt-8 gap-2",
                "bg-zinc-900 hover:bg-zinc-800",
                "dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900"
              )}
              asChild
            >
              <Link href="/">
                <Sparkles className="h-4 w-4" />
                Explorar produtos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            {/* Trust Badges - Empty State */}
            <div className="mt-10 grid grid-cols-3 gap-4 w-full max-w-xs">
              {[
                { icon: Truck, label: "Frete Grátis" },
                { icon: ShieldCheck, label: "Compra Segura" },
                { icon: CreditCard, label: "12x Sem Juros" },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <badge.icon className="h-5 w-5 text-zinc-400" />
                  </div>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Stock Issues Banner */}
            {hasStockIssues && !isLoading && (
              <div
                className={cn(
                  "mx-4 mt-4",
                  "flex items-start gap-3",
                  "px-4 py-3",
                  "bg-amber-50 dark:bg-amber-950/30",
                  "border border-amber-200 dark:border-amber-900",
                  "rounded-xl"
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Atenção ao estoque
                  </p>
                  <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">
                    Alguns itens têm disponibilidade limitada. Revise antes de
                    finalizar.
                  </p>
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={item.productId}
                    className={cn(
                      "animate-in slide-in-from-right-5 fade-in",
                      "duration-300"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CartItem
                      item={item}
                      stockInfo={stockMap.get(item.productId)}
                    />
                  </div>
                ))}
              </div>

              {/* Recommended Products Teaser */}
              <div
                className={cn(
                  "mt-6 p-4",
                  "bg-gradient-to-br from-amber-50 to-orange-50",
                  "dark:from-amber-950/20 dark:to-orange-950/20",
                  "border border-amber-200 dark:border-amber-900/50",
                  "rounded-xl"
                )}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    Você também pode gostar
                  </span>
                </div>
                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  Nossa IA pode recomendar produtos que combinam com seu
                  carrinho
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "mt-2 h-8 gap-1.5 px-3",
                    "text-amber-700 dark:text-amber-400",
                    "hover:bg-amber-100 dark:hover:bg-amber-900/30"
                  )}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Ver sugestões
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Cart Summary (Footer) */}
            <CartSummary hasStockIssues={hasStockIssues} />
          </>
        )}

        {/* Mini Trust Bar - Bottom */}
        {items.length > 0 && (
          <div
            className={cn(
              "px-5 py-2",
              "bg-zinc-100 dark:bg-zinc-800",
              "border-t border-zinc-200 dark:border-zinc-700"
            )}
          >
            <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-green-500" />
                Compra 100% segura
              </span>
              <span className="flex items-center gap-1">
                <CreditCard className="h-3 w-3 text-blue-500" />
                Até 12x sem juros
              </span>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}