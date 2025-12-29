// components/app/ProductGrid.tsx
"use client";

import { useState, useEffect } from "react";
import {
  PackageSearch,
  Search,
  Sparkles,
  TrendingUp,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Tipos
interface Product {
  _id: string;
  name: string | null;
  slug: string | null;
  price: number | null;
  stock: number | null;
  originalPrice?: number | null;
  rating?: number | null;
  reviewCount?: number | null;
  isBestSeller?: boolean;
  isNew?: boolean;
  images?: Array<{
    _key?: string;
    asset?: {
      url: string | null;
    } | null;
  }> | null;
  category?: {
    title: string | null;
    slug: string | null;
  } | null;
  material?: string | null;
  color?: string | null;
}

interface ProductGridProps {
  products: Product[];
  viewMode?: "grid-large" | "grid-small" | "list";
  loading?: boolean;
}

export function ProductGrid({
  products,
  viewMode = "grid-large",
  loading = false,
}: ProductGridProps) {
  const [isAnimating, setIsAnimating] = useState(true);

  // Reset animation when products change
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [products]);

  // Loading State
  if (loading) {
    return <ProductGridSkeleton viewMode={viewMode} />;
  }

  // Empty State
  if (products.length === 0) {
    return <EmptyProductState />;
  }

  return (
    <div className="@container">
      {/* Grid Container */}
      <div
        className={cn(
          "grid",
          "transition-all duration-300",

          // Grid Large (default)
          viewMode === "grid-large" && [
            "grid-cols-1 gap-4",
            "sm:grid-cols-2 sm:gap-5",
            "lg:grid-cols-3 lg:gap-6",
            "2xl:grid-cols-4",
          ],

          // Grid Small
          viewMode === "grid-small" && [
            "grid-cols-2 gap-3",
            "sm:grid-cols-3 sm:gap-4",
            "lg:grid-cols-4 lg:gap-5",
            "2xl:grid-cols-5",
          ],

          // List View
          viewMode === "list" && [
            "grid-cols-1 gap-4",
          ]
        )}
      >
        {products.map((product, index) => (
          <div
            key={product._id}
            className={cn(
              isAnimating && [
                "animate-in fade-in slide-in-from-bottom-4",
                "duration-500",
              ]
            )}
            style={{
              animationDelay: isAnimating ? `${index * 50}ms` : undefined,
              animationFillMode: "backwards",
            }}
          >
            <ProductCard
              product={product}
              priority={index < 4}
            />
          </div>
        ))}
      </div>

      {/* Results Footer */}
      {products.length > 0 && (
        <div
          className={cn(
            "mt-10 pt-8",
            "border-t border-zinc-200 dark:border-zinc-800",
            "text-center"
          )}
        >
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Mostrando{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {products.length}
            </span>{" "}
            {products.length === 1 ? "produto" : "produtos"}
          </p>

          {/* Load More Button (if needed) */}
          {products.length >= 12 && (
            <Button
              variant="outline"
              className="mt-4 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Carregar mais produtos
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// EMPTY STATE COMPONENT
// ============================================

function EmptyProductState() {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "min-h-[500px] py-16 px-6",
        "rounded-2xl",
        "bg-gradient-to-br from-zinc-50 to-zinc-100",
        "dark:from-zinc-900 dark:to-zinc-800",
        "border-2 border-dashed border-zinc-200 dark:border-zinc-700",
        "text-center"
      )}
    >
      {/* Animated Illustration */}
      <div className="relative mb-8">
        {/* Background circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full bg-amber-500/10 animate-ping" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 rounded-full bg-amber-500/20 animate-pulse" />
        </div>

        {/* Icon */}
        <div
          className={cn(
            "relative z-10",
            "flex h-20 w-20 items-center justify-center",
            "rounded-2xl",
            "bg-white dark:bg-zinc-800",
            "shadow-xl shadow-zinc-900/10",
            "border border-zinc-200 dark:border-zinc-700"
          )}
        >
          <PackageSearch className="h-10 w-10 text-zinc-400" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Nenhum produto encontrado
      </h3>

      {/* Description */}
      <p className="mt-3 max-w-md text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
        Não encontramos produtos que correspondam à sua busca ou filtros.
        Tente ajustar os critérios ou explore nossas categorias populares.
      </p>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={() => (window.location.href = "/")}
          className={cn(
            "gap-2",
            "bg-gradient-to-r from-amber-500 to-orange-500",
            "hover:from-amber-600 hover:to-orange-600",
            "shadow-lg shadow-amber-500/25"
          )}
        >
          <Sparkles className="h-4 w-4" />
          Ver todos os produtos
        </Button>

        <Button
          variant="outline"
          onClick={() => (window.location.href = "/?sort=bestseller")}
          className="gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Mais vendidos
        </Button>
      </div>

      {/* Category Suggestions */}
      <div className="mt-12">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
          Explore por categoria
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { label: "Sofás", slug: "sofas", emoji: "🛋️" },
            { label: "Cadeiras", slug: "cadeiras", emoji: "🪑" },
            { label: "Mesas", slug: "mesas", emoji: "🪟" },
            { label: "Camas", slug: "camas", emoji: "🛏️" },
            { label: "Armários", slug: "armarios", emoji: "🗄️" },
          ].map((cat) => (
            <a
              key={cat.slug}
              href={`/?category=${cat.slug}`}
              className={cn(
                "group",
                "flex items-center gap-2",
                "px-4 py-2.5",
                "text-sm font-medium",
                "bg-white dark:bg-zinc-800",
                "hover:bg-zinc-50 dark:hover:bg-zinc-700",
                "border border-zinc-200 dark:border-zinc-700",
                "hover:border-amber-300 dark:hover:border-amber-700",
                "rounded-full",
                "shadow-sm",
                "transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-md"
              )}
            >
              <span>{cat.emoji}</span>
              <span className="text-zinc-700 dark:text-zinc-300">
                {cat.label}
              </span>
              <ArrowRight
                className={cn(
                  "h-3.5 w-3.5 text-zinc-400",
                  "transition-transform duration-200",
                  "group-hover:translate-x-0.5 group-hover:text-amber-500"
                )}
              />
            </a>
          ))}
        </div>
      </div>

      {/* AI Suggestion */}
      <div
        className={cn(
          "mt-10 p-4",
          "max-w-sm mx-auto",
          "bg-gradient-to-r from-amber-50 to-orange-50",
          "dark:from-amber-950/30 dark:to-orange-950/30",
          "border border-amber-200 dark:border-amber-800",
          "rounded-xl"
        )}
      >
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">
            Precisa de ajuda?
          </span>
        </div>
        <p className="mt-1 text-xs text-amber-600 dark:text-amber-500">
          Nossa IA pode ajudar você a encontrar o móvel perfeito.
        </p>
      </div>
    </div>
  );
}

// ============================================
// SKELETON LOADING
// ============================================

function ProductGridSkeleton({ viewMode }: { viewMode: string }) {
  const skeletonCount = viewMode === "grid-small" ? 8 : 6;

  return (
    <div
      className={cn(
        "grid",
        viewMode === "grid-large" && [
          "grid-cols-1 gap-4",
          "sm:grid-cols-2 sm:gap-5",
          "lg:grid-cols-3 lg:gap-6",
        ],
        viewMode === "grid-small" && [
          "grid-cols-2 gap-3",
          "sm:grid-cols-3 sm:gap-4",
          "lg:grid-cols-4 lg:gap-5",
        ],
        viewMode === "list" && "grid-cols-1 gap-4"
      )}
    >
      {[...Array(skeletonCount)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-2xl overflow-hidden",
            "bg-white dark:bg-zinc-900",
            "border border-zinc-200 dark:border-zinc-800",
            "animate-pulse"
          )}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {/* Image Skeleton */}
          <div className="aspect-[4/5] bg-zinc-200 dark:bg-zinc-800" />

          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 w-20 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
          </div>

          {/* Button Skeleton */}
          <div className="p-4 pt-0">
            <div className="h-12 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
          </div>
        </div>
      ))}
    </div>
  );
}