// components/app/AddToCartButton.tsx
"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Check, AlertCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartActions, useCartItem } from "@/lib/store/cart-store-provider";

interface AddToCartButtonProps {
  productId: string;
  name: string;
  price: number;
  image?: string;
  stock: number;
  className?: string;
  variant?: "default" | "compact" | "prominent";
}

export function AddToCartButton({
  productId,
  name,
  price,
  image,
  stock,
  className,
  variant = "default",
}: AddToCartButtonProps) {
  const { addItem, updateQuantity } = useCartActions();
  const cartItem = useCartItem(productId);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const quantityInCart = cartItem?.quantity ?? 0;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 3;
  const isAtMax = quantityInCart >= stock;

  const handleAdd = async () => {
    if (quantityInCart >= stock) {
      toast.error("Estoque máximo atingido", {
        description: `Apenas ${stock} unidades disponíveis`,
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    setIsAdding(true);

    // Simula um pequeno delay para feedback visual
    await new Promise((resolve) => setTimeout(resolve, 150));

    addItem({ productId, name, price, image }, 1);

    setIsAdding(false);
    setShowSuccess(true);

    toast.success(`${name} adicionado ao carrinho`, {
      description: quantityInCart === 0
        ? "Clique no carrinho para finalizar"
        : `Agora você tem ${quantityInCart + 1} no carrinho`,
      icon: <Check className="h-4 w-4" />,
    });

    // Reset success state after animation
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const handleDecrement = () => {
    if (quantityInCart > 0) {
      updateQuantity(productId, quantityInCart - 1);

      if (quantityInCart === 1) {
        toast.info(`${name} removido do carrinho`, {
          icon: <ShoppingBag className="h-4 w-4" />,
        });
      }
    }
  };

  const handleIncrement = () => {
    handleAdd();
  };

  // ============================================
  // OUT OF STOCK STATE
  // ============================================
  if (isOutOfStock) {
    return (
      <div className={cn("space-y-2", className)}>
        <Button
          disabled
          variant="secondary"
          className={cn(
            "relative h-12 w-full overflow-hidden",
            "bg-zinc-100 dark:bg-zinc-800",
            "text-zinc-400 dark:text-zinc-500",
            "cursor-not-allowed"
          )}
        >
          <span className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Produto Esgotado
          </span>
        </Button>

        {/* Notify Button */}
        <button
          className={cn(
            "w-full py-2 text-xs font-medium",
            "text-amber-600 dark:text-amber-400",
            "hover:text-amber-700 dark:hover:text-amber-300",
            "transition-colors duration-200",
            "underline-offset-2 hover:underline"
          )}
        >
          Avise-me quando disponível
        </button>
      </div>
    );
  }

  // ============================================
  // NOT IN CART - SHOW ADD BUTTON
  // ============================================
  if (quantityInCart === 0) {
    return (
      <div className={cn("space-y-2", className)}>
        {/* Low Stock Warning */}
        {isLowStock && (
          <div className="flex items-center justify-center gap-1.5 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
            <span className="font-medium text-amber-600 dark:text-amber-400">
              Apenas {stock} {stock === 1 ? "unidade" : "unidades"} restantes
            </span>
          </div>
        )}

        <Button
          onClick={handleAdd}
          disabled={isAdding}
          className={cn(
            "group relative h-12 w-full overflow-hidden",
            "bg-gradient-to-r from-zinc-900 to-zinc-800",
            "hover:from-zinc-800 hover:to-zinc-700",
            "dark:from-zinc-100 dark:to-zinc-200",
            "dark:hover:from-white dark:hover:to-zinc-100",
            "dark:text-zinc-900",
            "shadow-lg shadow-zinc-900/10 dark:shadow-zinc-100/10",
            "transition-all duration-300",
            "hover:shadow-xl hover:shadow-zinc-900/20 dark:hover:shadow-zinc-100/20",
            "hover:-translate-y-0.5",
            "disabled:opacity-70 disabled:cursor-wait disabled:hover:translate-y-0",
            variant === "prominent" && [
              "h-14 text-base",
              "bg-gradient-to-r from-amber-500 to-orange-500",
              "hover:from-amber-600 hover:to-orange-600",
              "text-white dark:text-white",
              "shadow-amber-500/25 hover:shadow-amber-500/40",
            ]
          )}
        >
          {/* Shimmer Effect */}
          <div
            className={cn(
              "absolute inset-0 -translate-x-full",
              "bg-gradient-to-r from-transparent via-white/20 to-transparent",
              "group-hover:translate-x-full",
              "transition-transform duration-700 ease-in-out"
            )}
          />

          {/* Button Content */}
          <span className="relative flex items-center justify-center gap-2">
            {isAdding ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Adicionando...</span>
              </>
            ) : showSuccess ? (
              <>
                <Check className="h-4 w-4 animate-in zoom-in duration-200" />
                <span>Adicionado!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                <span>Adicionar ao Carrinho</span>
                {variant === "prominent" && (
                  <Sparkles className="h-4 w-4 ml-1 opacity-70" />
                )}
              </>
            )}
          </span>
        </Button>

        {/* Trust Indicators */}
        {variant === "prominent" && (
          <div className="flex items-center justify-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Compra segura
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Frete grátis
            </span>
          </div>
        )}
      </div>
    );
  }

  // ============================================
  // IN CART - SHOW QUANTITY CONTROLS
  // ============================================
  return (
    <div className={cn("space-y-2", className)}>
      {/* Low Stock Warning when in cart */}
      {isLowStock && !isAtMax && (
        <div className="flex items-center justify-center gap-1.5 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
          </span>
          <span className="font-medium text-amber-600 dark:text-amber-400">
            Restam {stock - quantityInCart} disponíveis
          </span>
        </div>
      )}

      {/* Quantity Controls */}
      <div
        className={cn(
          "flex h-12 w-full items-center overflow-hidden rounded-xl",
          "border-2 border-zinc-900 dark:border-zinc-100",
          "bg-white dark:bg-zinc-900",
          "shadow-sm",
          "transition-all duration-200",
          variant === "prominent" && "h-14"
        )}
      >
        {/* Decrement Button */}
        <button
          onClick={handleDecrement}
          className={cn(
            "flex h-full flex-1 items-center justify-center",
            "text-zinc-700 dark:text-zinc-300",
            "hover:bg-zinc-100 dark:hover:bg-zinc-800",
            "active:bg-zinc-200 dark:active:bg-zinc-700",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
          )}
          aria-label="Diminuir quantidade"
        >
          <Minus className="h-4 w-4" />
        </button>

        {/* Quantity Display */}
        <div
          className={cn(
            "flex flex-[2] flex-col items-center justify-center",
            "border-x-2 border-zinc-900 dark:border-zinc-100",
            "bg-zinc-50 dark:bg-zinc-800"
          )}
        >
          <span className="text-base font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
            {quantityInCart}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            no carrinho
          </span>
        </div>

        {/* Increment Button */}
        <button
          onClick={handleIncrement}
          disabled={isAtMax || isAdding}
          className={cn(
            "flex h-full flex-1 items-center justify-center",
            "text-zinc-700 dark:text-zinc-300",
            "hover:bg-zinc-100 dark:hover:bg-zinc-800",
            "active:bg-zinc-200 dark:active:bg-zinc-700",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500",
            "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          )}
          aria-label="Aumentar quantidade"
        >
          {isAdding ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Max Stock Warning */}
      {isAtMax && (
        <p className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <AlertCircle className="h-3.5 w-3.5" />
          Quantidade máxima disponível
        </p>
      )}

      {/* Quick Remove Link */}
      <button
        onClick={() => {
          updateQuantity(productId, 0);
          toast.info(`${name} removido do carrinho`);
        }}
        className={cn(
          "w-full py-1 text-xs font-medium",
          "text-zinc-400 dark:text-zinc-500",
          "hover:text-red-500 dark:hover:text-red-400",
          "transition-colors duration-200",
          "underline-offset-2 hover:underline"
        )}
      >
        Remover do carrinho
      </button>
    </div>
  );
}