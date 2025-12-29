"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Grid2x2, ChevronLeft, ChevronRight } from "lucide-react";
import type { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";

interface CategoryTilesProps {
  categories: ALL_CATEGORIES_QUERYResult;
  activeCategory?: string;
}

export function CategoryTiles({
  categories,
  activeCategory,
}: CategoryTilesProps) {
  // Referência para o container de rolagem
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Função para rolar para esquerda ou direita
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Quantidade de pixels para rolar
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav aria-label="Navegação de Categorias" className="relative w-full">
      {/* Container Principal com Botões de Navegação */}
      <div className="relative group/container">

        {/* === BOTÃO ESQUERDO (Apenas Desktop) === */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden lg:flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white dark:bg-zinc-800/90 dark:hover:bg-zinc-800 disabled:opacity-0"
          aria-label="Rolar para esquerda"
        >
          <ChevronLeft className="h-6 w-6 text-zinc-700 dark:text-zinc-200" />
        </button>

        {/* === LISTA DE CATEGORIAS === */}
        <div
          ref={scrollContainerRef}
          className="
            flex w-full gap-4 overflow-x-auto py-6 pl-4 pr-4 sm:pl-8 sm:pr-8
            snap-x snap-mandatory scroll-smooth

            /* ESTILIZAÇÃO DA BARRA DE ROLAGEM (MOBILE) */
            scrollbar-thin
            scrollbar-track-transparent
            scrollbar-thumb-zinc-300
            dark:scrollbar-thumb-zinc-700
            hover:scrollbar-thumb-zinc-400
            dark:hover:scrollbar-thumb-zinc-600

            /* Suporte para Firefox */
            [scrollbar-width:thin]

            /* Suporte para Webkit (Chrome/Safari/Edge) via Tailwind Arbitrary Values */
            [&::-webkit-scrollbar]:h-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-zinc-200/50
            dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700/50
          "
          role="list"
        >
          {/* Card: Todos os Produtos */}
          <Link
            href="/"
            role="listitem"
            aria-current={!activeCategory ? "page" : undefined}
            className={`group relative flex-shrink-0 snap-center overflow-hidden rounded-2xl transition-all duration-300 ease-in-out ${
              !activeCategory
                ? "ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-zinc-950 scale-105 shadow-lg shadow-amber-500/20"
                : "opacity-80 hover:opacity-100 hover:ring-2 hover:ring-zinc-300 hover:ring-offset-2 dark:hover:ring-zinc-700 dark:hover:ring-offset-zinc-950"
            }`}
          >
            <div className="relative h-28 w-44 sm:h-40 sm:w-64">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 dark:from-zinc-800 dark:to-black" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Grid2x2 className="h-10 w-10 text-white/70 transition-transform duration-500 group-hover:scale-110 group-hover:text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                <span className="block text-sm font-bold text-white drop-shadow-md sm:text-base">
                  Todos
                </span>
              </div>
            </div>
          </Link>

          {/* Cards das Categorias Dinâmicas */}
          {categories.map((category) => {
            const categorySlug = typeof category.slug === 'string'
              ? category.slug
              : (category.slug as any)?.current;

            const isActive = activeCategory === categorySlug;
            const imageUrl = category.image?.asset?.url;

            return (
              <Link
                key={category._id}
                href={`/?category=${categorySlug}`}
                role="listitem"
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex-shrink-0 snap-center overflow-hidden rounded-2xl transition-all duration-300 ease-in-out ${
                  isActive
                    ? "ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-zinc-950 scale-105 shadow-lg shadow-amber-500/20"
                    : "opacity-80 hover:opacity-100 hover:ring-2 hover:ring-zinc-300 hover:ring-offset-2 dark:hover:ring-zinc-700 dark:hover:ring-offset-zinc-950"
                }`}
              >
                <div className="relative h-28 w-44 sm:h-40 sm:w-64">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={category.title ?? "Categoria"}
                      fill
                      sizes="(max-width: 640px) 176px, 256px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-700" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 group-hover:via-black/40" />

                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    <span className="block truncate text-sm font-bold text-white drop-shadow-md sm:text-base">
                      {category.title}
                    </span>
                  </div>

                  {isActive && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                      <span className="flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500 border border-white/20" />
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* === BOTÃO DIREITO (Apenas Desktop) === */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden lg:flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white dark:bg-zinc-800/90 dark:hover:bg-zinc-800"
          aria-label="Rolar para direita"
        >
          <ChevronRight className="h-6 w-6 text-zinc-700 dark:text-zinc-200" />
        </button>
      </div>
    </nav>
  );
}