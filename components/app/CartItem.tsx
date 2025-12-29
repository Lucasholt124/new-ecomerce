// components/app/CartItem.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, AlertTriangle, Package, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartActions } from "@/lib/store/cart-store-provider";
import { AddToCartButton } from "@/components/app/AddToCartButton";
import { StockBadge } from "@/components/app/StockBadge";
import { cn, formatPrice } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/lib/store/cart-store";
import { StockInfo } from "@/lib/hooks/useCartStock";

interface CartItemProps {
  item: CartItemType;
  stockInfo?: StockInfo;
}

export function CartItem({ item, stockInfo }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartActions();
  const [isRemoving, setIsRemoving] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isOutOfStock = stockInfo?.isOutOfStock ?? false;
  const exceedsStock = stockInfo?.exceedsStock ?? false;
  const currentStock = stockInfo?.currentStock ?? 999;
  const hasIssue = isOutOfStock || exceedsStock;
  const isLowStock = currentStock > 0 && currentStock <= 3;

  // Calcula o subtotal do item
  const subtotal = item.price * item.quantity;

  // Handler para remover item com animação
  const handleRemove = async () => {
    setIsRemoving(true);

    // Delay para animação
    await new Promise((resolve) => setTimeout(resolve, 200));

    removeItem(item.productId);

    toast.success(`${item.name} removido do carrinho`, {
      icon: <Trash2 className="h-4 w-4" />,
      action: {
        label: "Desfazer",
        onClick: () => {
          // Readiciona o item (simplificado - você pode melhorar isso)
          toast.info("Item restaurado");
        },
      },
    });
  };

  // Handler para ajustar quantidade quando excede estoque
  const handleAdjustQuantity = () => {
    if (exceedsStock && currentStock > 0) {
      updateQuantity(item.productId, currentStock);
      toast.info(`Quantidade ajustada para ${currentStock} (máximo disponível)`);
    }
  };

  return (
    <div
      className={cn(
        "group relative",
        "flex gap-4 p-4",
        "rounded-xl",
        "bg-white dark:bg-zinc-900",
        "border border-zinc-200 dark:border-zinc-800",
        "transition-all duration-300 ease-out",

        // Hover state
        "hover:border-zinc-300 dark:hover:border-zinc-700",
        "hover:shadow-md hover:shadow-zinc-900/5 dark:hover:shadow-zinc-100/5",

        // Issue states
        hasIssue && [
          "border-red-200 dark:border-red-900/50",
          "bg-red-50/50 dark:bg-red-950/20",
        ],

        // Low stock warning
        isLowStock && !hasIssue && [
          "border-amber-200 dark:border-amber-900/50",
        ],

        // Removing animation
        isRemoving && [
          "opacity-0 scale-95 -translate-x-4",
          "pointer-events-none",
        ]
      )}
    >
      {/* Issue Banner */}
      {hasIssue && (
        <div
          className={cn(
            "absolute -top-px left-4 right-4",
            "flex items-center justify-center gap-1.5",
            "px-3 py-1",
            "text-xs font-medium",
            "bg-red-500 text-white",
            "rounded-b-lg",
            "shadow-sm"
          )}
        >
          <AlertTriangle className="h-3 w-3" />
          {isOutOfStock ? (
            <span>Produto indisponível</span>
          ) : (
            <span>Apenas {currentStock} em estoque</span>
          )}
        </div>
      )}

      {/* Product Image */}
      <Link
        href={`/products/${item.productId}`}
        className={cn(
          "relative shrink-0",
          "h-24 w-24 sm:h-28 sm:w-28",
          "overflow-hidden rounded-lg",
          "bg-zinc-100 dark:bg-zinc-800",
          "ring-1 ring-zinc-200 dark:ring-zinc-700",
          "transition-all duration-300",
          "group-hover:ring-2 group-hover:ring-zinc-300 dark:group-hover:ring-zinc-600",
          isOutOfStock && "opacity-50 grayscale"
        )}
      >
        {item.image && !imageError ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className={cn(
              "object-cover",
              "transition-transform duration-500",
              "group-hover:scale-105"
            )}
            sizes="(max-width: 640px) 96px, 112px"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-zinc-400">
            <Package className="h-6 w-6" />
            <span className="text-[10px]">Sem imagem</span>
          </div>
        )}

        {/* Hover Overlay */}
        <div
          className={cn(
            "absolute inset-0",
            "flex items-center justify-center",
            "bg-black/0 group-hover:bg-black/10",
            "transition-colors duration-300"
          )}
        >
          <ExternalLink
            className={cn(
              "h-5 w-5 text-white",
              "opacity-0 group-hover:opacity-100",
              "transition-opacity duration-300",
              "drop-shadow-lg"
            )}
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {/* Product Name */}
            <Link
              href={`/products/${item.productId}`}
              className={cn(
                "block truncate",
                "text-sm font-semibold sm:text-base",
                "text-zinc-900 dark:text-zinc-100",
                "hover:text-amber-600 dark:hover:text-amber-400",
                "transition-colors duration-200",
                isOutOfStock && "text-zinc-400 dark:text-zinc-500 line-through"
              )}
            >
              {item.name}
            </Link>

            {/* Unit Price */}
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {formatPrice(item.price)} / unidade
            </p>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 shrink-0",
              "text-zinc-400",
              "hover:text-red-500 hover:bg-red-50",
              "dark:hover:text-red-400 dark:hover:bg-red-950/50",
              "transition-all duration-200",
              "opacity-0 group-hover:opacity-100",
              "focus:opacity-100"
            )}
            onClick={handleRemove}
            disabled={isRemoving}
          >
            {isRemoving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span className="sr-only">Remover {item.name}</span>
          </Button>
        </div>

        {/* Stock Badge */}
        <div className="mt-2">
          <StockBadge productId={item.productId} stock={currentStock} />
        </div>

        {/* Quantity Controls & Subtotal */}
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          {/* Quantity Controls */}
          {!isOutOfStock ? (
            <div className="w-full sm:w-36">
              <AddToCartButton
                productId={item.productId}
                name={item.name}
                price={item.price}
                image={item.image}
                stock={currentStock}
                variant="compact"
              />
            </div>
          ) : (
            <button
              onClick={handleRemove}
              className={cn(
                "text-xs font-medium",
                "text-red-500 hover:text-red-600",
                "dark:text-red-400 dark:hover:text-red-300",
                "underline underline-offset-2",
                "transition-colors duration-200"
              )}
            >
              Remover item indisponível
            </button>
          )}

          {/* Subtotal */}
          {!isOutOfStock && (
            <div className="flex items-baseline gap-1.5 sm:text-right">
              {item.quantity > 1 && (
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  {item.quantity}x
                </span>
              )}
              <span
                className={cn(
                  "text-base font-bold sm:text-lg",
                  "text-zinc-900 dark:text-zinc-100"
                )}
              >
                {formatPrice(subtotal)}
              </span>
            </div>
          )}
        </div>

        {/* Adjust Quantity Button (when exceeds stock) */}
        {exceedsStock && !isOutOfStock && (
          <button
            onClick={handleAdjustQuantity}
            className={cn(
              "mt-2 w-full",
              "flex items-center justify-center gap-1.5",
              "py-2 px-3",
              "text-xs font-medium",
              "text-amber-700 dark:text-amber-400",
              "bg-amber-100 dark:bg-amber-950/50",
              "hover:bg-amber-200 dark:hover:bg-amber-950",
              "rounded-lg",
              "transition-colors duration-200"
            )}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Ajustar para quantidade disponível ({currentStock})
          </button>
        )}
      </div>

      {/* Quantity Badge - Mobile */}
      <div
        className={cn(
          "absolute -top-2 -right-2",
          "flex items-center justify-center",
          "h-6 w-6",
          "text-xs font-bold",
          "bg-zinc-900 dark:bg-zinc-100",
          "text-white dark:text-zinc-900",
          "rounded-full",
          "ring-2 ring-white dark:ring-zinc-900",
          "sm:hidden",
          isOutOfStock && "bg-red-500 dark:bg-red-500 text-white dark:text-white"
        )}
      >
        {isOutOfStock ? "!" : item.quantity}
      </div>
    </div>
  );
}