"use client";

import { useState } from "react";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductFilters } from "./ProductFilters";
import { ProductGrid } from "./ProductGrid";

// --- TIPAGEM MANUAL (Para evitar erro do sanity.types) ---
interface Category {
  _id: string;
  title: string | null;
  slug: string | null;
  image?: {
    asset?: {
      url: string | null;
    } | null;
  } | null;
}

interface Product {
  _id: string;
  name: string | null;
  slug: string | null;
  price: number | null;
  stock: number | null;
  images?: Array<{
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
// ---------------------------------------------------------

interface ProductSectionProps {
  categories: Category[];
  products: Product[];
  searchQuery?: string;
}

export function ProductSection({
  categories,
  products,
  searchQuery,
}: ProductSectionProps) {
  const [filtersOpen, setFiltersOpen] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      {/* Header with results count and filter toggle */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {products.length} {products.length === 1 ? "produto" : "produtos"}{" "}
          encontrado{products.length !== 1 && "s"}
          {searchQuery && (
            <span>
              {" "}
              para &quot;<span className="font-medium">{searchQuery}</span>&quot;
            </span>
          )}
        </p>

        {/* Filter toggle button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 border-zinc-300 bg-white shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          aria-label={filtersOpen ? "Ocultar filtros" : "Mostrar filtros"}
        >
          {filtersOpen ? (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span className="hidden sm:inline">Ocultar Filtros</span>
              <span className="sm:hidden">Ocultar</span>
            </>
          ) : (
            <>
              <PanelLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Mostrar Filtros</span>
              <span className="sm:hidden">Filtros</span>
            </>
          )}
        </Button>
      </div>

      {/* Main content area */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters */}
        <aside
          className={`shrink-0 transition-all duration-300 ease-in-out ${
            filtersOpen ? "w-full lg:w-72 lg:opacity-100" : "hidden lg:hidden"
          }`}
        >
          <ProductFilters categories={categories} />
        </aside>

        {/* Product Grid */}
        <main className="flex-1 transition-all duration-300">
          <ProductGrid products={products} />
        </main>
      </div>
    </div>
  );
}