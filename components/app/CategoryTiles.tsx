// components/app/CategoryTiles.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Grid3X3, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  _id: string;
  title: string | null;
  slug: string | null;
  image?: {
    asset?: {
      url: string | null;
    } | null;
  } | null;
  productCount?: number;
}

interface CategoryTilesProps {
  categories: Category[];
  activeCategory?: string;
}

export function CategoryTiles({
  categories,
  activeCategory,
}: CategoryTilesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isHovering, setIsHovering] = useState<string | null>(null);

  // Verifica se pode scrollar
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Ícones de categoria (fallback quando não há imagem)
  const getCategoryIcon = (slug: string | null) => {
    const icons: Record<string, string> = {
      sofas: "🛋️",
      cadeiras: "🪑",
      mesas: "🪟",
      camas: "🛏️",
      armarios: "🗄️",
      estantes: "📚",
      decoracao: "🏺",
      iluminacao: "💡",
    };
    return icons[slug || ""] || "📦";
  };

  return (
    <div className="relative">
      {/* Container Principal */}
      <div
        className={cn(
          "relative",
          "bg-white dark:bg-zinc-950",
          "py-4 sm:py-6"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4 text-zinc-400" />
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Categorias
              </span>
            </div>

            {/* Scroll Controls - Desktop */}
            <div className="hidden items-center gap-1 sm:flex">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={cn(
                  "flex h-8 w-8 items-center justify-center",
                  "rounded-full",
                  "border border-zinc-200 dark:border-zinc-700",
                  "bg-white dark:bg-zinc-800",
                  "text-zinc-600 dark:text-zinc-400",
                  "transition-all duration-200",
                  "hover:border-zinc-300 hover:bg-zinc-50",
                  "dark:hover:border-zinc-600 dark:hover:bg-zinc-700",
                  "disabled:opacity-30 disabled:cursor-not-allowed"
                )}
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={cn(
                  "flex h-8 w-8 items-center justify-center",
                  "rounded-full",
                  "border border-zinc-200 dark:border-zinc-700",
                  "bg-white dark:bg-zinc-800",
                  "text-zinc-600 dark:text-zinc-400",
                  "transition-all duration-200",
                  "hover:border-zinc-300 hover:bg-zinc-50",
                  "dark:hover:border-zinc-600 dark:hover:bg-zinc-700",
                  "disabled:opacity-30 disabled:cursor-not-allowed"
                )}
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Container */}
          <div className="relative">
            {/* Fade Left */}
            <div
              className={cn(
                "pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8",
                "bg-gradient-to-r from-white to-transparent",
                "dark:from-zinc-950 dark:to-transparent",
                "transition-opacity duration-200",
                canScrollLeft ? "opacity-100" : "opacity-0"
              )}
            />

            {/* Fade Right */}
            <div
              className={cn(
                "pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8",
                "bg-gradient-to-l from-white to-transparent",
                "dark:from-zinc-950 dark:to-transparent",
                "transition-opacity duration-200",
                canScrollRight ? "opacity-100" : "opacity-0"
              )}
            />

            {/* Categories */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className={cn(
                "flex gap-2 sm:gap-3",
                "overflow-x-auto scrollbar-hide",
                "pb-2 -mb-2" // Espaço para sombras
              )}
            >
              {/* Botão "Todos" */}
              <Link
                href="/"
                onMouseEnter={() => setIsHovering("all")}
                onMouseLeave={() => setIsHovering(null)}
                className={cn(
                  "group relative flex-shrink-0",
                  "flex items-center gap-2",
                  "px-4 py-2.5 sm:px-5 sm:py-3",
                  "rounded-xl sm:rounded-2xl",
                  "border-2",
                  "transition-all duration-300 ease-out",
                  "hover:-translate-y-0.5",
                  !activeCategory
                    ? [
                        "border-zinc-900 dark:border-zinc-100",
                        "bg-zinc-900 dark:bg-zinc-100",
                        "text-white dark:text-zinc-900",
                        "shadow-lg shadow-zinc-900/20 dark:shadow-zinc-100/20",
                      ]
                    : [
                        "border-zinc-200 dark:border-zinc-700",
                        "bg-white dark:bg-zinc-800",
                        "text-zinc-700 dark:text-zinc-300",
                        "hover:border-zinc-300 dark:hover:border-zinc-600",
                        "hover:shadow-md",
                      ]
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center",
                    "rounded-lg",
                    "transition-all duration-300",
                    !activeCategory
                      ? "bg-white/20"
                      : "bg-zinc-100 dark:bg-zinc-700"
                  )}
                >
                  <Sparkles
                    className={cn(
                      "h-4 w-4",
                      "transition-transform duration-300",
                      isHovering === "all" && "rotate-12 scale-110"
                    )}
                  />
                </div>

                {/* Text */}
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Todos</span>
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      !activeCategory
                        ? "text-white/70 dark:text-zinc-900/70"
                        : "text-zinc-500 dark:text-zinc-400"
                    )}
                  >
                    Ver tudo
                  </span>
                </div>
              </Link>

              {/* Category Items */}
              {categories.map((category) => {
                const isActive = activeCategory === category.slug;
                const imageUrl = category.image?.asset?.url;

                return (
                  <Link
                    key={category._id}
                    href={`/?category=${category.slug}`}
                    onMouseEnter={() => setIsHovering(category._id)}
                    onMouseLeave={() => setIsHovering(null)}
                    className={cn(
                      "group relative flex-shrink-0",
                      "flex items-center gap-2",
                      "px-3 py-2.5 sm:px-4 sm:py-3",
                      "rounded-xl sm:rounded-2xl",
                      "border-2",
                      "transition-all duration-300 ease-out",
                      "hover:-translate-y-0.5",
                      isActive
                        ? [
                            "border-amber-500 dark:border-amber-400",
                            "bg-amber-50 dark:bg-amber-950/30",
                            "text-amber-900 dark:text-amber-100",
                            "shadow-lg shadow-amber-500/20",
                          ]
                        : [
                            "border-zinc-200 dark:border-zinc-700",
                            "bg-white dark:bg-zinc-800",
                            "text-zinc-700 dark:text-zinc-300",
                            "hover:border-zinc-300 dark:hover:border-zinc-600",
                            "hover:shadow-md",
                          ]
                    )}
                  >
                    {/* Category Image/Icon */}
                    <div
                      className={cn(
                        "relative flex-shrink-0",
                        "h-9 w-9 sm:h-10 sm:w-10",
                        "rounded-lg overflow-hidden",
                        "transition-all duration-300",
                        isActive
                          ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-amber-50 dark:ring-offset-amber-950/30"
                          : "ring-1 ring-zinc-200 dark:ring-zinc-600"
                      )}
                    >
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={category.title ?? "Categoria"}
                          fill
                          className={cn(
                            "object-cover",
                            "transition-transform duration-500",
                            "group-hover:scale-110"
                          )}
                          sizes="40px"
                        />
                      ) : (
                        <div
                          className={cn(
                            "flex h-full w-full items-center justify-center",
                            "text-lg",
                            isActive
                              ? "bg-amber-100 dark:bg-amber-900/50"
                              : "bg-zinc-100 dark:bg-zinc-700"
                          )}
                        >
                          {getCategoryIcon(category.slug)}
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div
                        className={cn(
                          "absolute inset-0",
                          "bg-black/0 group-hover:bg-black/10",
                          "transition-colors duration-300"
                        )}
                      />
                    </div>

                    {/* Category Info */}
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold truncate">
                        {category.title}
                      </span>
                      {category.productCount !== undefined && (
                        <span
                          className={cn(
                            "text-[10px] font-medium",
                            isActive
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-zinc-500 dark:text-zinc-400"
                          )}
                        >
                          {category.productCount} produtos
                        </span>
                      )}
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <div
                        className={cn(
                          "absolute -bottom-px left-1/2 -translate-x-1/2",
                          "h-1 w-8",
                          "bg-amber-500 dark:bg-amber-400",
                          "rounded-full"
                        )}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Scroll Hint */}
      <div
        className={cn(
          "flex items-center justify-center gap-2",
          "py-2 sm:hidden",
          "text-[10px] text-zinc-400 dark:text-zinc-500",
          canScrollRight ? "opacity-100" : "opacity-0",
          "transition-opacity duration-300"
        )}
      >
        <span>Arraste para ver mais</span>
        <ChevronRight className="h-3 w-3 animate-pulse" />
      </div>
    </div>
  );
}