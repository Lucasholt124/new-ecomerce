// components/app/ProductCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Eye,
  ShoppingBag,
  Star,
  Truck,
  Sparkles,
  TrendingUp,
  Clock,
  Package,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { StockBadge } from "./StockBadge";
import { AddToCartButton } from "./AddToCartButton";
import { AskAISimilarButton } from "./AskAISimilarButton";

// Tipos
interface Product {
  _id: string;
  name: string | null;
  slug: string | null;
  price: number | null;
  originalPrice?: number | null;
  stock: number | null;
  rating?: number | null;
  reviewCount?: number | null;
  isBestSeller?: boolean;
  isNew?: boolean;
  images?: Array<{
    _key?: string;
    asset?: {
      url: string | null;
    } | null;
    hotspot?: unknown;
  }> | null;
  category?: {
    title: string | null;
  } | null;
}

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Dados do produto
  const images = product.images ?? [];
  const mainImageUrl = images[0]?.asset?.url;
  const secondaryImageUrl = images[1]?.asset?.url;
  const displayedImageUrl =
    hoveredImageIndex !== null
      ? images[hoveredImageIndex]?.asset?.url
      : mainImageUrl;

  const stock = product.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 3;
  const hasMultipleImages = images.length > 1;

  // Cálculos de desconto
  const hasDiscount =
    product.originalPrice && product.originalPrice > (product.price || 0);
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice! - (product.price || 0)) / product.originalPrice!) * 100
      )
    : 0;

  // Parcelamento
  const installmentValue = (product.price || 0) / 12;

  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col overflow-hidden",
        "rounded-2xl border-0 bg-white p-0",
        "shadow-sm ring-1 ring-zinc-950/5",
        "transition-all duration-500 ease-out",
        "hover:-translate-y-2 hover:shadow-2xl hover:shadow-zinc-950/10",
        "dark:bg-zinc-900 dark:ring-white/10",
        "dark:hover:shadow-zinc-950/50"
      )}
    >
      {/* ============================================ */}
      {/* IMAGE SECTION */}
      {/* ============================================ */}
      <div className="relative">
        <Link
          href={`/products/${product.slug}`}
          className="block"
        >
          <div
            className={cn(
              "relative overflow-hidden",
              "bg-gradient-to-br from-zinc-100 to-zinc-50",
              "dark:from-zinc-800 dark:to-zinc-900",
              "aspect-[4/5]"
            )}
          >
            {/* Main Image */}
            {displayedImageUrl && !imageError ? (
              <>
                <Image
                  src={displayedImageUrl}
                  alt={product.name ?? "Produto"}
                  fill
                  className={cn(
                    "object-cover",
                    "transition-all duration-700 ease-out",
                    "group-hover:scale-110"
                  )}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={priority}
                  onError={() => setImageError(true)}
                />

                {/* Secondary Image on Hover */}
                {secondaryImageUrl && (
                  <Image
                    src={secondaryImageUrl}
                    alt={`${product.name} - vista alternativa`}
                    fill
                    className={cn(
                      "object-cover",
                      "absolute inset-0",
                      "opacity-0 transition-opacity duration-500",
                      "group-hover:opacity-100"
                    )}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-zinc-400">
                <Package className="h-12 w-12 opacity-30" />
                <span className="text-xs">Sem imagem</span>
              </div>
            )}

            {/* Gradient Overlay */}
            <div
              className={cn(
                "absolute inset-0",
                "bg-gradient-to-t from-black/40 via-transparent to-transparent",
                "opacity-0 transition-opacity duration-300",
                "group-hover:opacity-100"
              )}
            />

            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-900">
                  Esgotado
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* ============================================ */}
        {/* BADGES - Top Left */}
        {/* ============================================ */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {/* Category */}
          {product.category && (
            <span
              className={cn(
                "rounded-lg px-2.5 py-1",
                "text-[10px] font-semibold uppercase tracking-wider",
                "bg-white/95 text-zinc-700",
                "dark:bg-zinc-900/95 dark:text-zinc-300",
                "backdrop-blur-sm shadow-sm"
              )}
            >
              {product.category.title}
            </span>
          )}

          {/* New Badge */}
          {product.isNew && (
            <Badge
              className={cn(
                "gap-1 rounded-lg px-2.5 py-1",
                "bg-blue-500 text-white",
                "shadow-lg shadow-blue-500/30"
              )}
            >
              <Sparkles className="h-3 w-3" />
              Novo
            </Badge>
          )}

          {/* Bestseller Badge */}
          {product.isBestSeller && (
            <Badge
              className={cn(
                "gap-1 rounded-lg px-2.5 py-1",
                "bg-amber-500 text-white",
                "shadow-lg shadow-amber-500/30"
              )}
            >
              <TrendingUp className="h-3 w-3" />
              Mais Vendido
            </Badge>
          )}
        </div>

        {/* ============================================ */}
        {/* BADGES - Top Right */}
        {/* ============================================ */}
        <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
          {/* Discount Badge */}
          {hasDiscount && (
            <Badge
              className={cn(
                "rounded-lg px-2.5 py-1",
                "bg-red-500 text-white",
                "text-xs font-bold",
                "shadow-lg shadow-red-500/30",
                "animate-in slide-in-from-right duration-300"
              )}
            >
              -{discountPercent}%
            </Badge>
          )}

          {/* Low Stock Warning */}
          {isLowStock && !isOutOfStock && (
            <Badge
              variant="outline"
              className={cn(
                "gap-1 rounded-lg px-2.5 py-1",
                "border-amber-400/50 bg-amber-50/95",
                "text-amber-700",
                "dark:border-amber-500/50 dark:bg-amber-950/95 dark:text-amber-400",
                "backdrop-blur-sm"
              )}
            >
              <Clock className="h-3 w-3" />
              Últimas {stock}
            </Badge>
          )}
        </div>

        {/* ============================================ */}
        {/* ACTION BUTTONS - Right Side */}
        {/* ============================================ */}
        <div
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2",
            "flex flex-col gap-2",
            "opacity-0 translate-x-4",
            "transition-all duration-300",
            "group-hover:opacity-100 group-hover:translate-x-0"
          )}
        >
          {/* Wishlist */}
          <Button
            variant="secondary"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
            className={cn(
              "h-10 w-10",
              "rounded-full",
              "bg-white/95 dark:bg-zinc-800/95",
              "backdrop-blur-sm shadow-lg",
              "hover:scale-110",
              "transition-all duration-200",
              isWishlisted && "text-red-500"
            )}
          >
            <Heart
              className={cn("h-4 w-4", isWishlisted && "fill-current")}
            />
          </Button>

          {/* Quick View */}
          <Button
            variant="secondary"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              setShowQuickView(true);
            }}
            className={cn(
              "h-10 w-10",
              "rounded-full",
              "bg-white/95 dark:bg-zinc-800/95",
              "backdrop-blur-sm shadow-lg",
              "hover:scale-110",
              "transition-all duration-200"
            )}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* ============================================ */}
        {/* FREE SHIPPING BADGE - Bottom */}
        {/* ============================================ */}
        {(product.price || 0) >= 299 && (
          <div
            className={cn(
              "absolute bottom-3 left-3 right-3",
              "flex items-center justify-center gap-1.5",
              "py-1.5 px-3",
              "bg-green-500/95 text-white",
              "rounded-lg",
              "text-xs font-medium",
              "backdrop-blur-sm",
              "opacity-0 translate-y-2",
              "transition-all duration-300",
              "group-hover:opacity-100 group-hover:translate-y-0"
            )}
          >
            <Truck className="h-3.5 w-3.5" />
            Frete Grátis
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* THUMBNAIL STRIP */}
      {/* ============================================ */}
      {hasMultipleImages && (
        <div
          className={cn(
            "flex gap-1.5 p-2",
            "border-t border-zinc-100 dark:border-zinc-800",
            "bg-zinc-50/50 dark:bg-zinc-800/50"
          )}
        >
          {images.slice(0, 4).map((image, index) => (
            <button
              key={image._key ?? index}
              type="button"
              className={cn(
                "relative flex-1 overflow-hidden rounded-lg",
                "aspect-square",
                "transition-all duration-200",
                "ring-2 ring-offset-1",
                hoveredImageIndex === index
                  ? "ring-zinc-900 dark:ring-white"
                  : "ring-transparent opacity-60 hover:opacity-100"
              )}
              onMouseEnter={() => setHoveredImageIndex(index)}
              onMouseLeave={() => setHoveredImageIndex(null)}
            >
              {image.asset?.url && (
                <Image
                  src={image.asset.url}
                  alt={`${product.name} - ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="60px"
                />
              )}
            </button>
          ))}
          {images.length > 4 && (
            <div
              className={cn(
                "flex flex-1 items-center justify-center",
                "rounded-lg",
                "bg-zinc-200 dark:bg-zinc-700",
                "text-xs font-medium text-zinc-600 dark:text-zinc-300"
              )}
            >
              +{images.length - 4}
            </div>
          )}
        </div>
      )}

      {/* ============================================ */}
      {/* CONTENT */}
      {/* ============================================ */}
      <CardContent className="flex grow flex-col gap-3 p-4">
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < Math.floor(product.rating!)
                      ? "fill-amber-400 text-amber-400"
                      : "text-zinc-300 dark:text-zinc-600"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              ({product.reviewCount || 0})
            </span>
          </div>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.slug}`} className="block">
          <h3
            className={cn(
              "line-clamp-2 text-sm font-semibold leading-tight",
              "text-zinc-900 dark:text-zinc-100",
              "transition-colors duration-200",
              "group-hover:text-amber-600 dark:group-hover:text-amber-400"
            )}
          >
            {product.name}
          </h3>
        </Link>

        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-zinc-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-zinc-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Installments */}
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            ou 12x de{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {formatPrice(installmentValue)}
            </span>
          </p>
        </div>

        {/* Stock Badge */}
        <StockBadge productId={product._id} stock={stock} />
      </CardContent>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <CardFooter className="flex flex-col gap-2 p-4 pt-0">
        <AddToCartButton
          productId={product._id}
          name={product.name ?? "Produto"}
          price={product.price ?? 0}
          image={mainImageUrl ?? undefined}
          stock={stock}
          variant="compact"
        />

        {/* AI Similar Products */}
        <AskAISimilarButton
          productName={product.name ?? ""}
          variant="compact"
        />
      </CardFooter>
    </Card>
  );
}