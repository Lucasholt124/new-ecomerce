// components/app/ProductFilters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import {
  X,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Palette,
  Tag,
  DollarSign,
  Package,
  SlidersHorizontal,
  Sparkles,
  Check,
  RotateCcw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { COLORS, MATERIALS, SORT_OPTIONS } from "@/lib/constants/filters";
import { cn, formatPrice } from "@/lib/utils";

// Tipos
interface Category {
  _id: string;
  title: string | null;
  slug: string | null;
}

interface ProductFiltersProps {
  categories: Category[];
}

// Componente de Seção Colapsável
function FilterSection({
  title,
  icon: Icon,
  isActive,
  children,
  defaultOpen = true,
  onClear,
}: {
  title: string;
  icon: React.ElementType;
  isActive: boolean;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onClear?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-200",
        isActive
          ? "border-amber-300 bg-amber-50/50 dark:border-amber-700 dark:bg-amber-950/30"
          : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      )}
    >
      {/* Section Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between",
          "px-4 py-3",
          "text-left",
          "transition-colors duration-200",
          "hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
          "rounded-t-xl",
          !isOpen && "rounded-b-xl"
        )}
      >
        <div className="flex items-center gap-2">
          <Icon
            className={cn(
              "h-4 w-4",
              isActive
                ? "text-amber-600 dark:text-amber-400"
                : "text-zinc-500 dark:text-zinc-400"
            )}
          />
          <span
            className={cn(
              "text-sm font-medium",
              isActive
                ? "text-amber-900 dark:text-amber-100"
                : "text-zinc-700 dark:text-zinc-300"
            )}
          >
            {title}
          </span>
          {isActive && (
            <Badge
              className={cn(
                "h-5 px-1.5",
                "bg-amber-500 text-white",
                "text-[10px] font-medium"
              )}
            >
              Ativo
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isActive && onClear && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className={cn(
                "flex h-6 w-6 items-center justify-center",
                "rounded-full",
                "text-amber-600 hover:bg-amber-200",
                "dark:text-amber-400 dark:hover:bg-amber-900/50",
                "transition-colors duration-200"
              )}
              aria-label={`Limpar ${title}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-zinc-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-zinc-400" />
          )}
        </div>
      </button>

      {/* Section Content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}

// Componente de Chip de Cor
function ColorChip({
  color,
  isSelected,
  onClick,
}: {
  color: { value: string; label: string; hex?: string };
  isSelected: boolean;
  onClick: () => void;
}) {
  const colorHexMap: Record<string, string> = {
    branco: "#ffffff",
    preto: "#000000",
    cinza: "#6b7280",
    marrom: "#78350f",
    bege: "#d4c4a8",
    azul: "#3b82f6",
    verde: "#22c55e",
    vermelho: "#ef4444",
    amarelo: "#eab308",
    rosa: "#ec4899",
  };

  const hex = color.hex || colorHexMap[color.value] || "#9ca3af";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center gap-1.5",
        "p-2 rounded-lg",
        "transition-all duration-200",
        isSelected
          ? "bg-amber-100 dark:bg-amber-900/30"
          : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
      )}
    >
      <div
        className={cn(
          "relative h-8 w-8 rounded-full",
          "ring-2 ring-offset-2",
          "transition-all duration-200",
          isSelected
            ? "ring-amber-500 scale-110"
            : "ring-transparent group-hover:ring-zinc-300 dark:group-hover:ring-zinc-600"
        )}
        style={{ backgroundColor: hex }}
      >
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Check
              className={cn(
                "h-4 w-4",
                hex === "#ffffff" || hex === "#d4c4a8"
                  ? "text-zinc-800"
                  : "text-white"
              )}
            />
          </div>
        )}
      </div>
      <span
        className={cn(
          "text-[10px] font-medium",
          isSelected
            ? "text-amber-700 dark:text-amber-400"
            : "text-zinc-600 dark:text-zinc-400"
        )}
      >
        {color.label}
      </span>
    </button>
  );
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Valores atuais dos filtros
  const currentSearch = searchParams.get("q") ?? "";
  const currentCategory = searchParams.get("category") ?? "";
  const currentColor = searchParams.get("color") ?? "";
  const currentMaterial = searchParams.get("material") ?? "";
  const currentSort = searchParams.get("sort") ?? "name";
  const urlMinPrice = Number(searchParams.get("minPrice")) || 0;
  const urlMaxPrice = Number(searchParams.get("maxPrice")) || 5000;
  const currentInStock = searchParams.get("inStock") === "true";

  // Estado local para o slider de preço
  const [priceRange, setPriceRange] = useState<[number, number]>([
    urlMinPrice,
    urlMaxPrice,
  ]);
  const [searchInput, setSearchInput] = useState(currentSearch);

  // Sincroniza estado local com URL
  useEffect(() => {
    setPriceRange([urlMinPrice, urlMaxPrice]);
  }, [urlMinPrice, urlMaxPrice]);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Verificações de filtros ativos
  const isSearchActive = !!currentSearch;
  const isCategoryActive = !!currentCategory;
  const isColorActive = !!currentColor;
  const isMaterialActive = !!currentMaterial;
  const isPriceActive = urlMinPrice > 0 || urlMaxPrice < 5000;
  const isInStockActive = currentInStock;

  const hasActiveFilters =
    isSearchActive ||
    isCategoryActive ||
    isColorActive ||
    isMaterialActive ||
    isPriceActive ||
    isInStockActive;

  const activeFilterCount = [
    isSearchActive,
    isCategoryActive,
    isColorActive,
    isMaterialActive,
    isPriceActive,
    isInStockActive,
  ].filter(Boolean).length;

  // Atualiza parâmetros da URL
  const updateParams = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === 0) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateParams({ q: searchInput || null });
  };

  const handleClearFilters = () => {
    router.push("/", { scroll: false });
  };

  const clearSingleFilter = (key: string) => {
    if (key === "price") {
      updateParams({ minPrice: null, maxPrice: null });
    } else {
      updateParams({ [key]: null });
    }
  };

  return (
    <div className="space-y-4">
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <div
        className={cn(
          "flex items-center justify-between",
          "rounded-xl",
          "bg-white dark:bg-zinc-900",
          "border border-zinc-200 dark:border-zinc-800",
          "px-4 py-3"
        )}
      >
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-zinc-500" />
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            Filtros
          </span>
          {hasActiveFilters && (
            <Badge
              className={cn(
                "h-5 min-w-5 px-1.5",
                "bg-amber-500 text-white",
                "text-xs font-bold"
              )}
            >
              {activeFilterCount}
            </Badge>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-8 gap-1.5 text-xs text-zinc-500 hover:text-red-500"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Limpar
          </Button>
        )}
      </div>

      {/* ============================================ */}
      {/* ACTIVE FILTERS SUMMARY */}
      {/* ============================================ */}
      {hasActiveFilters && (
        <div
          className={cn(
            "rounded-xl",
            "bg-gradient-to-r from-amber-50 to-orange-50",
            "dark:from-amber-950/30 dark:to-orange-950/30",
            "border border-amber-200 dark:border-amber-800",
            "p-3"
          )}
        >
          <div className="flex flex-wrap gap-2">
            {isSearchActive && (
              <Badge
                variant="secondary"
                className={cn(
                  "gap-1 pr-1",
                  "bg-white dark:bg-zinc-800",
                  "text-zinc-700 dark:text-zinc-300"
                )}
              >
                <Search className="h-3 w-3" />
                "{currentSearch}"
                <button
                  onClick={() => clearSingleFilter("q")}
                  className="ml-1 rounded-full p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {isCategoryActive && (
              <Badge
                variant="secondary"
                className={cn(
                  "gap-1 pr-1",
                  "bg-white dark:bg-zinc-800",
                  "text-zinc-700 dark:text-zinc-300"
                )}
              >
                <Tag className="h-3 w-3" />
                {categories.find((c) => c.slug === currentCategory)?.title}
                <button
                  onClick={() => clearSingleFilter("category")}
                  className="ml-1 rounded-full p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {isColorActive && (
              <Badge
                variant="secondary"
                className={cn(
                  "gap-1 pr-1",
                  "bg-white dark:bg-zinc-800",
                  "text-zinc-700 dark:text-zinc-300"
                )}
              >
                <Palette className="h-3 w-3" />
                {COLORS.find((c) => c.value === currentColor)?.label}
                <button
                  onClick={() => clearSingleFilter("color")}
                  className="ml-1 rounded-full p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {isMaterialActive && (
              <Badge
                variant="secondary"
                className={cn(
                  "gap-1 pr-1",
                  "bg-white dark:bg-zinc-800",
                  "text-zinc-700 dark:text-zinc-300"
                )}
              >
                <Package className="h-3 w-3" />
                {MATERIALS.find((m) => m.value === currentMaterial)?.label}
                <button
                  onClick={() => clearSingleFilter("material")}
                  className="ml-1 rounded-full p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {isPriceActive && (
              <Badge
                variant="secondary"
                className={cn(
                  "gap-1 pr-1",
                  "bg-white dark:bg-zinc-800",
                  "text-zinc-700 dark:text-zinc-300"
                )}
              >
                <DollarSign className="h-3 w-3" />
                {formatPrice(urlMinPrice)} - {formatPrice(urlMaxPrice)}
                <button
                  onClick={() => clearSingleFilter("price")}
                  className="ml-1 rounded-full p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {isInStockActive && (
              <Badge
                variant="secondary"
                className={cn(
                  "gap-1 pr-1",
                  "bg-green-100 dark:bg-green-900/30",
                  "text-green-700 dark:text-green-400"
                )}
              >
                <Check className="h-3 w-3" />
                Em estoque
                <button
                  onClick={() => clearSingleFilter("inStock")}
                  className="ml-1 rounded-full p-0.5 hover:bg-green-200 dark:hover:bg-green-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* SEARCH */}
      {/* ============================================ */}
      <FilterSection
        title="Buscar"
        icon={Search}
        isActive={isSearchActive}
        onClear={() => clearSingleFilter("q")}
      >
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Nome do produto..."
              className={cn(
                "pl-9",
                isSearchActive &&
                  "border-amber-500 ring-1 ring-amber-500 dark:border-amber-400"
              )}
            />
          </div>
          <Button type="submit" size="sm" className="px-4">
            Buscar
          </Button>
        </form>
      </FilterSection>

      {/* ============================================ */}
      {/* CATEGORY */}
      {/* ============================================ */}
      <FilterSection
        title="Categoria"
        icon={Tag}
        isActive={isCategoryActive}
        onClear={() => clearSingleFilter("category")}
      >
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => updateParams({ category: null })}
            className={cn(
              "flex items-center justify-center gap-1.5",
              "px-3 py-2",
              "text-sm font-medium",
              "rounded-lg border",
              "transition-all duration-200",
              !currentCategory
                ? "border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-400 dark:bg-amber-950/50 dark:text-amber-400"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              type="button"
              onClick={() => updateParams({ category: category.slug })}
              className={cn(
                "px-3 py-2",
                "text-sm font-medium",
                "rounded-lg border",
                "transition-all duration-200",
                "truncate",
                currentCategory === category.slug
                  ? "border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-400 dark:bg-amber-950/50 dark:text-amber-400"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
              )}
            >
              {category.title}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* ============================================ */}
      {/* COLOR */}
      {/* ============================================ */}
      <FilterSection
        title="Cor"
        icon={Palette}
        isActive={isColorActive}
        onClear={() => clearSingleFilter("color")}
        defaultOpen={false}
      >
        <div className="grid grid-cols-4 gap-1">
          {COLORS.map((color) => (
            <ColorChip
              key={color.value}
              color={color}
              isSelected={currentColor === color.value}
              onClick={() =>
                updateParams({
                  color: currentColor === color.value ? null : color.value,
                })
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* ============================================ */}
      {/* MATERIAL */}
      {/* ============================================ */}
      <FilterSection
        title="Material"
        icon={Package}
        isActive={isMaterialActive}
        onClear={() => clearSingleFilter("material")}
        defaultOpen={false}
      >
        <Select
          value={currentMaterial || "all"}
          onValueChange={(value) =>
            updateParams({ material: value === "all" ? null : value })
          }
        >
          <SelectTrigger
            className={cn(
              isMaterialActive &&
                "border-amber-500 ring-1 ring-amber-500 dark:border-amber-400"
            )}
          >
            <SelectValue placeholder="Selecione o material" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Materiais</SelectItem>
            {MATERIALS.map((material) => (
              <SelectItem key={material.value} value={material.value}>
                {material.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      {/* ============================================ */}
      {/* PRICE RANGE */}
      {/* ============================================ */}
      <FilterSection
        title="Faixa de Preço"
        icon={DollarSign}
        isActive={isPriceActive}
        onClear={() => clearSingleFilter("price")}
      >
        <div className="space-y-4">
          {/* Price Display */}
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "px-3 py-1.5",
                "text-sm font-medium",
                "bg-zinc-100 dark:bg-zinc-800",
                "rounded-lg"
              )}
            >
              {formatPrice(priceRange[0])}
            </div>
            <div className="h-px flex-1 mx-3 bg-zinc-200 dark:bg-zinc-700" />
            <div
              className={cn(
                "px-3 py-1.5",
                "text-sm font-medium",
                "bg-zinc-100 dark:bg-zinc-800",
                "rounded-lg"
              )}
            >
              {formatPrice(priceRange[1])}
            </div>
          </div>

          {/* Slider */}
          <Slider
            min={0}
            max={5000}
            step={100}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            onValueCommit={([min, max]) =>
              updateParams({
                minPrice: min > 0 ? min : null,
                maxPrice: max < 5000 ? max : null,
              })
            }
            className={cn(
              isPriceActive &&
                "[&_[role=slider]]:border-amber-500 [&_[role=slider]]:ring-amber-500"
            )}
          />

          {/* Quick Price Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Até R$ 500", min: 0, max: 500 },
              { label: "R$ 500 - R$ 1.500", min: 500, max: 1500 },
              { label: "R$ 1.500 - R$ 3.000", min: 1500, max: 3000 },
              { label: "Acima de R$ 3.000", min: 3000, max: 5000 },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setPriceRange([preset.min, preset.max]);
                  updateParams({
                    minPrice: preset.min > 0 ? preset.min : null,
                    maxPrice: preset.max < 5000 ? preset.max : null,
                  });
                }}
                className={cn(
                  "px-2.5 py-1",
                  "text-xs font-medium",
                  "rounded-full",
                  "border",
                  "transition-all duration-200",
                  priceRange[0] === preset.min && priceRange[1] === preset.max
                    ? "border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-400 dark:bg-amber-950/50 dark:text-amber-400"
                    : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* ============================================ */}
      {/* IN STOCK */}
      {/* ============================================ */}
      <div
        className={cn(
          "rounded-xl border p-4",
          "transition-all duration-200",
          isInStockActive
            ? "border-green-300 bg-green-50/50 dark:border-green-700 dark:bg-green-950/30"
            : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
        )}
      >
        <label className="flex cursor-pointer items-center gap-3">
          <div className="relative">
            <input
              type="checkbox"
              checked={currentInStock}
              onChange={(e) =>
                updateParams({ inStock: e.target.checked ? "true" : null })
              }
              className="peer sr-only"
            />
            <div
              className={cn(
                "h-6 w-11 rounded-full",
                "bg-zinc-200 dark:bg-zinc-700",
                "peer-checked:bg-green-500",
                "transition-colors duration-200"
              )}
            />
            <div
              className={cn(
                "absolute left-0.5 top-0.5",
                "h-5 w-5 rounded-full",
                "bg-white shadow-sm",
                "transition-transform duration-200",
                "peer-checked:translate-x-5"
              )}
            />
          </div>
          <div className="flex items-center gap-2">
            <Package
              className={cn(
                "h-4 w-4",
                isInStockActive
                  ? "text-green-600 dark:text-green-400"
                  : "text-zinc-500"
              )}
            />
            <span
              className={cn(
                "text-sm font-medium",
                isInStockActive
                  ? "text-green-700 dark:text-green-400"
                  : "text-zinc-700 dark:text-zinc-300"
              )}
            >
              Apenas produtos em estoque
            </span>
          </div>
        </label>
      </div>

      {/* ============================================ */}
      {/* SORT */}
      {/* ============================================ */}
      <div
        className={cn(
          "rounded-xl border p-4",
          "border-zinc-200 bg-white",
          "dark:border-zinc-800 dark:bg-zinc-900"
        )}
      >
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Ordenar por
          </span>
        </div>
        <Select
          value={currentSort}
          onValueChange={(value) => updateParams({ sort: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}