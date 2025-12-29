// components/app/StockBadge.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Package,
  PackageCheck,
  PackageX,
  AlertTriangle,
  Clock,
  Truck,
  ShoppingCart,
  TrendingUp,
  Flame,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCartItem } from "@/lib/store/cart-store-provider";
import { cn } from "@/lib/utils";
import { isLowStock as checkLowStock } from "@/lib/constants/stock";

interface StockBadgeProps {
  productId: string;
  stock: number;
  className?: string;
  variant?: "default" | "compact" | "detailed";
  showIcon?: boolean;
}

export function StockBadge({
  productId,
  stock,
  className,
  variant = "default",
  showIcon = true,
}: StockBadgeProps) {
  const cartItem = useCartItem(productId);
  const [isPulsing, setIsPulsing] = useState(false);

  const quantityInCart = cartItem?.quantity ?? 0;
  const remainingStock = stock - quantityInCart;
  const isAtMax = quantityInCart >= stock && stock > 0;
  const isOutOfStock = stock <= 0;
  const lowStock = checkLowStock(stock);
  const veryLowStock = stock > 0 && stock <= 2;
  const isInCart = quantityInCart > 0;

  // Pulse animation for very low stock
  useEffect(() => {
    if (veryLowStock && !isOutOfStock) {
      const interval = setInterval(() => {
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 1000);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [veryLowStock, isOutOfStock]);

  // ============================================
  // OUT OF STOCK
  // ============================================
  if (isOutOfStock) {
    return (
      <Badge
        variant="destructive"
        className={cn(
          "gap-1.5",
          "bg-red-100 text-red-700 border-red-200",
          "dark:bg-red-950/50 dark:text-red-400 dark:border-red-900",
          "hover:bg-red-100 dark:hover:bg-red-950/50",
          variant === "compact" && "text-[10px] px-2 py-0.5",
          className
        )}
      >
        {showIcon && <PackageX className={cn("h-3 w-3", variant === "compact" && "h-2.5 w-2.5")} />}
        <span>Esgotado</span>
      </Badge>
    );
  }

  // ============================================
  // MAX IN CART
  // ============================================
  if (isAtMax) {
    return (
      <Badge
        className={cn(
          "gap-1.5",
          "bg-blue-100 text-blue-700 border-blue-200",
          "dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900",
          "hover:bg-blue-100 dark:hover:bg-blue-950/50",
          variant === "compact" && "text-[10px] px-2 py-0.5",
          className
        )}
      >
        {showIcon && <ShoppingCart className={cn("h-3 w-3", variant === "compact" && "h-2.5 w-2.5")} />}
        <span>Máx. no carrinho</span>
      </Badge>
    );
  }

  // ============================================
  // VERY LOW STOCK (1-2 items)
  // ============================================
  if (veryLowStock) {
    return (
      <Badge
        className={cn(
          "gap-1.5",
          "bg-red-50 text-red-600 border-red-200",
          "dark:bg-red-950/30 dark:text-red-400 dark:border-red-900",
          "hover:bg-red-50 dark:hover:bg-red-950/30",
          isPulsing && "animate-pulse",
          variant === "compact" && "text-[10px] px-2 py-0.5",
          className
        )}
      >
        {showIcon && (
          <span className="relative">
            <Flame className={cn("h-3 w-3", variant === "compact" && "h-2.5 w-2.5")} />
            {/* Pulsing indicator */}
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
          </span>
        )}
        <span className="font-semibold">
          {stock === 1 ? "Última unidade!" : `Últimas ${stock}!`}
        </span>
      </Badge>
    );
  }

  // ============================================
  // LOW STOCK (3-5 items)
  // ============================================
  if (lowStock) {
    return (
      <Badge
        className={cn(
          "gap-1.5",
          "bg-amber-50 text-amber-700 border-amber-200",
          "dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
          "hover:bg-amber-50 dark:hover:bg-amber-950/30",
          variant === "compact" && "text-[10px] px-2 py-0.5",
          className
        )}
      >
        {showIcon && (
          <Clock className={cn("h-3 w-3", variant === "compact" && "h-2.5 w-2.5")} />
        )}
        <span>
          {variant === "detailed" ? (
            <>Restam apenas <span className="font-semibold">{stock}</span> unidades</>
          ) : (
            <>Restam {stock}</>
          )}
        </span>
      </Badge>
    );
  }

  // ============================================
  // IN CART INDICATOR (when not low stock)
  // ============================================
  if (isInCart && variant === "detailed") {
    return (
      <Badge
        className={cn(
          "gap-1.5",
          "bg-green-50 text-green-700 border-green-200",
          "dark:bg-green-950/30 dark:text-green-400 dark:border-green-800",
          "hover:bg-green-50 dark:hover:bg-green-950/30",
            "text-[10px] px-2 py-0.5",
          className
        )}
      >
        {showIcon && <ShoppingCart className={cn("h-3 w-3", "h-2.5 w-2.5")} />}
        <span>
          {quantityInCart} no carrinho
          {remainingStock > 0 && ` (${remainingStock} disponíveis)`}
        </span>
      </Badge>
    );
  }

  // ============================================
  // IN STOCK (DETAILED VARIANT ONLY)
  // ============================================
  if (variant === "detailed" && stock > 5) {
    return (
      <Badge
        className={cn(
          "gap-1.5",
          "bg-green-50 text-green-700 border-green-200",
          "dark:bg-green-950/30 dark:text-green-400 dark:border-green-800",
          "hover:bg-green-50 dark:hover:bg-green-950/30",
          className
        )}
      >
        {showIcon && <PackageCheck className="h-3 w-3" />}
        <span>Em estoque</span>
      </Badge>
    );
  }

  // Default: return null if no special state
  return null;
}

// ============================================
// COMPACT INLINE STOCK INDICATOR
// ============================================

interface StockIndicatorProps {
  stock: number;
  className?: string;
}

export function StockIndicator({ stock, className }: StockIndicatorProps) {
  const isOutOfStock = stock <= 0;
  const veryLowStock = stock > 0 && stock <= 2;
  const lowStock = stock > 0 && stock <= 5;

  if (isOutOfStock) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1",
          "text-xs font-medium text-red-600 dark:text-red-400",
          className
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Esgotado
      </span>
    );
  }

  if (veryLowStock) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1",
          "text-xs font-medium text-red-600 dark:text-red-400",
          className
        )}
      >
        <span className="relative h-1.5 w-1.5">
          <span className="absolute inset-0 rounded-full bg-red-500 animate-ping" />
          <span className="relative block h-1.5 w-1.5 rounded-full bg-red-500" />
        </span>
        {stock === 1 ? "Última!" : `Últimas ${stock}!`}
      </span>
    );
  }

  if (lowStock) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1",
          "text-xs font-medium text-amber-600 dark:text-amber-400",
          className
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Restam {stock}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1",
        "text-xs font-medium text-green-600 dark:text-green-400",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
      Em estoque
    </span>
  );
}

// ============================================
// STOCK PROGRESS BAR
// ============================================

interface StockProgressProps {
  stock: number;
  maxStock?: number;
  className?: string;
  showLabel?: boolean;
}

export function StockProgress({
  stock,
  maxStock = 20,
  className,
  showLabel = true,
}: StockProgressProps) {
  const isOutOfStock = stock <= 0;
  const veryLowStock = stock > 0 && stock <= 2;
  const lowStock = stock > 0 && stock <= 5;
  const percentage = Math.min((stock / maxStock) * 100, 100);

  const getColor = () => {
    if (isOutOfStock) return "bg-red-500";
    if (veryLowStock) return "bg-red-500";
    if (lowStock) return "bg-amber-500";
    return "bg-green-500";
  };

  const getLabel = () => {
    if (isOutOfStock) return "Esgotado";
    if (veryLowStock) return stock === 1 ? "Última unidade" : `Últimas ${stock}`;
    if (lowStock) return `Restam ${stock}`;
    return "Em estoque";
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span
            className={cn(
              "font-medium",
              isOutOfStock && "text-red-600 dark:text-red-400",
              veryLowStock && "text-red-600 dark:text-red-400",
              lowStock && !veryLowStock && "text-amber-600 dark:text-amber-400",
              !lowStock && "text-green-600 dark:text-green-400"
            )}
          >
            {getLabel()}
          </span>
          {!isOutOfStock && (
            <span className="text-zinc-400 dark:text-zinc-500">
              {stock} disponíveis
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "h-1.5 w-full overflow-hidden rounded-full",
          "bg-zinc-200 dark:bg-zinc-700"
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            getColor(),
            veryLowStock && "animate-pulse"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}