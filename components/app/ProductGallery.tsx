// components/app/ProductGallery.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
  Package,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Tipos
interface ProductImage {
  _key?: string;
  asset?: {
    url: string | null;
  } | null;
  hotspot?: unknown;
}

interface ProductGalleryProps {
  images: ProductImage[] | null;
  productName: string | null;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isLoading, setIsLoading] = useState(true);

  const mainImageRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Filtra imagens válidas
  const validImages = images?.filter((img) => img.asset?.url) ?? [];
  const hasImages = validImages.length > 0;
  const hasMultipleImages = validImages.length > 1;
  const currentImage = validImages[selectedIndex]?.asset?.url;

  // Navegação
  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === 0 ? validImages.length - 1 : prev - 1
    );
    setIsLoading(true);
  }, [validImages.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === validImages.length - 1 ? 0 : prev + 1
    );
    setIsLoading(true);
  }, [validImages.length]);

  // Zoom handler
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isZoomed || !mainImageRef.current) return;

      const rect = mainImageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setZoomPosition({ x, y });
    },
    [isZoomed]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") {
        setIsFullscreen(false);
        setIsZoomed(false);
      }
    },
    [goToPrevious, goToNext]
  );

  // Scroll thumbnail into view
  const scrollThumbnailIntoView = useCallback((index: number) => {
    const container = thumbnailsRef.current;
    if (!container) return;

    const thumbnail = container.children[index] as HTMLElement;
    if (thumbnail) {
      thumbnail.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, []);

  const selectImage = (index: number) => {
    setSelectedIndex(index);
    setIsLoading(true);
    scrollThumbnailIntoView(index);
  };

  // Placeholder quando não há imagens
  if (!hasImages) {
    return (
      <div
        className={cn(
          "aspect-square w-full overflow-hidden",
          "rounded-2xl",
          "bg-gradient-to-br from-zinc-100 to-zinc-200",
          "dark:from-zinc-800 dark:to-zinc-900",
          "border border-zinc-200 dark:border-zinc-700"
        )}
      >
        <div className="flex h-full flex-col items-center justify-center gap-3 text-zinc-400">
          <Package className="h-16 w-16 opacity-50" />
          <span className="text-sm font-medium">Sem imagem disponível</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="flex flex-col gap-4"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Galeria de imagens do produto"
      >
        {/* ============================================ */}
        {/* MAIN IMAGE */}
        {/* ============================================ */}
        <div className="relative">
          <div
            ref={mainImageRef}
            className={cn(
              "relative aspect-square w-full overflow-hidden",
              "rounded-2xl",
              "bg-gradient-to-br from-zinc-50 to-zinc-100",
              "dark:from-zinc-900 dark:to-zinc-800",
              "border border-zinc-200 dark:border-zinc-700",
              "group",
              isZoomed && "cursor-zoom-out",
              !isZoomed && "cursor-zoom-in"
            )}
            onClick={() => setIsZoomed(!isZoomed)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isZoomed && setIsZoomed(false)}
          >
            {/* Image */}
            {currentImage && (
              <div
                className={cn(
                  "relative h-full w-full",
                  "transition-transform duration-500 ease-out"
                )}
                style={
                  isZoomed
                    ? {
                        transform: "scale(2)",
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }
                    : undefined
                }
              >
                <Image
                  src={currentImage}
                  alt={`${productName} - Imagem ${selectedIndex + 1}`}
                  fill
                  className={cn(
                    "object-contain p-4",
                    "transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100"
                  )}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onLoad={() => setIsLoading(false)}
                />

                {/* Loading Skeleton */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-amber-500" />
                  </div>
                )}
              </div>
            )}

            {/* Zoom Indicator */}
            <div
              className={cn(
                "absolute bottom-4 right-4",
                "flex items-center gap-1.5",
                "px-3 py-1.5",
                "bg-black/70 backdrop-blur-sm",
                "rounded-full",
                "text-white text-xs font-medium",
                "opacity-0 group-hover:opacity-100",
                "transition-opacity duration-200"
              )}
            >
              {isZoomed ? (
                <>
                  <ZoomOut className="h-3.5 w-3.5" />
                  <span>Clique para diminuir</span>
                </>
              ) : (
                <>
                  <ZoomIn className="h-3.5 w-3.5" />
                  <span>Clique para ampliar</span>
                </>
              )}
            </div>

            {/* Image Counter */}
            {hasMultipleImages && (
              <div
                className={cn(
                  "absolute bottom-4 left-4",
                  "flex items-center gap-1",
                  "px-3 py-1.5",
                  "bg-black/70 backdrop-blur-sm",
                  "rounded-full",
                  "text-white text-xs font-medium"
                )}
              >
                <span>{selectedIndex + 1}</span>
                <span className="opacity-60">/</span>
                <span className="opacity-60">{validImages.length}</span>
              </div>
            )}

            {/* Fullscreen Button */}
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                "absolute top-4 right-4",
                "h-10 w-10 rounded-full",
                "bg-white/90 dark:bg-zinc-800/90",
                "backdrop-blur-sm shadow-lg",
                "opacity-0 group-hover:opacity-100",
                "transition-all duration-200",
                "hover:scale-110"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(true);
              }}
            >
              <Expand className="h-4 w-4" />
            </Button>

            {/* Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2",
                    "h-12 w-12 rounded-full",
                    "bg-white/90 dark:bg-zinc-800/90",
                    "backdrop-blur-sm shadow-lg",
                    "opacity-0 group-hover:opacity-100",
                    "transition-all duration-200",
                    "hover:scale-110"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  className={cn(
                    "absolute right-4 top-1/2 -translate-y-1/2",
                    "h-12 w-12 rounded-full",
                    "bg-white/90 dark:bg-zinc-800/90",
                    "backdrop-blur-sm shadow-lg",
                    "opacity-0 group-hover:opacity-100",
                    "transition-all duration-200",
                    "hover:scale-110"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>

          {/* Progress Dots - Mobile */}
          {hasMultipleImages && (
            <div className="mt-3 flex justify-center gap-1.5 md:hidden">
              {validImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => selectImage(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-200",
                    selectedIndex === index
                      ? "w-6 bg-zinc-900 dark:bg-zinc-100"
                      : "w-2 bg-zinc-300 dark:bg-zinc-600"
                  )}
                  aria-label={`Ver imagem ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* THUMBNAILS */}
        {/* ============================================ */}
        {hasMultipleImages && (
          <div className="relative hidden md:block">
            {/* Scroll Buttons */}
            {validImages.length > 5 && (
              <>
                <button
                  onClick={() => {
                    const container = thumbnailsRef.current;
                    if (container) {
                      container.scrollBy({ left: -200, behavior: "smooth" });
                    }
                  }}
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 z-10",
                    "flex h-8 w-8 items-center justify-center",
                    "rounded-full",
                    "bg-white dark:bg-zinc-800",
                    "border border-zinc-200 dark:border-zinc-700",
                    "shadow-md",
                    "hover:bg-zinc-50 dark:hover:bg-zinc-700",
                    "transition-all duration-200"
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  onClick={() => {
                    const container = thumbnailsRef.current;
                    if (container) {
                      container.scrollBy({ left: 200, behavior: "smooth" });
                    }
                  }}
                  className={cn(
                    "absolute right-0 top-1/2 -translate-y-1/2 z-10",
                    "flex h-8 w-8 items-center justify-center",
                    "rounded-full",
                    "bg-white dark:bg-zinc-800",
                    "border border-zinc-200 dark:border-zinc-700",
                    "shadow-md",
                    "hover:bg-zinc-50 dark:hover:bg-zinc-700",
                    "transition-all duration-200"
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}

            {/* Thumbnails Container */}
            <div
              ref={thumbnailsRef}
              className={cn(
                "flex gap-3 overflow-x-auto",
                "scrollbar-hide",
                "px-1 py-1",
                "-mx-1"
              )}
            >
              {validImages.map((image, index) => {
                const url = image.asset?.url;
                if (!url) return null;

                return (
                  <button
                    key={image._key || index}
                    onClick={() => selectImage(index)}
                    className={cn(
                      "relative flex-shrink-0",
                      "h-20 w-20",
                      "overflow-hidden rounded-xl",
                      "bg-white dark:bg-zinc-900",
                      "border-2",
                      "transition-all duration-200",
                      "hover:scale-105",
                      "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
                      selectedIndex === index
                        ? [
                            "border-zinc-900 dark:border-zinc-100",
                            "ring-2 ring-zinc-900 dark:ring-zinc-100",
                            "ring-offset-2 dark:ring-offset-zinc-900",
                            "scale-105",
                          ]
                        : [
                            "border-zinc-200 dark:border-zinc-700",
                            "opacity-70 hover:opacity-100",
                          ]
                    )}
                    aria-label={`Ver imagem ${index + 1}`}
                    aria-current={selectedIndex === index}
                  >
                    <Image
                      src={url}
                      alt={`${productName} - Miniatura ${index + 1}`}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />

                    {/* Selected Indicator */}
                    {selectedIndex === index && (
                      <div
                        className={cn(
                          "absolute inset-0",
                          "bg-zinc-900/5 dark:bg-zinc-100/5"
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* FULLSCREEN MODAL */}
      {/* ============================================ */}
      {isFullscreen && currentImage && (
        <div
          className={cn(
            "fixed inset-0 z-[100]",
            "flex items-center justify-center",
            "bg-black/95 backdrop-blur-md",
            "animate-in fade-in duration-200"
          )}
          onClick={() => setIsFullscreen(false)}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-4 right-4 z-10",
              "h-12 w-12 rounded-full",
              "bg-white/10 hover:bg-white/20",
              "text-white"
            )}
            onClick={() => setIsFullscreen(false)}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Image Counter */}
          <div
            className={cn(
              "absolute top-4 left-4",
              "px-4 py-2",
              "bg-white/10 backdrop-blur-sm",
              "rounded-full",
              "text-white text-sm font-medium"
            )}
          >
            {selectedIndex + 1} / {validImages.length}
          </div>

          {/* Main Image */}
          <div
            className="relative h-[80vh] w-[90vw] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage}
              alt={`${productName} - Imagem ${selectedIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2",
                  "h-14 w-14 rounded-full",
                  "bg-white/10 hover:bg-white/20",
                  "text-white"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute right-4 top-1/2 -translate-y-1/2",
                  "h-14 w-14 rounded-full",
                  "bg-white/10 hover:bg-white/20",
                  "text-white"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Thumbnails Strip */}
          {hasMultipleImages && (
            <div
              className={cn(
                "absolute bottom-6 left-1/2 -translate-x-1/2",
                "flex gap-2",
                "p-2",
                "bg-white/10 backdrop-blur-md",
                "rounded-xl"
              )}
            >
              {validImages.map((image, index) => {
                const url = image.asset?.url;
                if (!url) return null;

                return (
                  <button
                    key={image._key || index}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectImage(index);
                    }}
                    className={cn(
                      "relative h-14 w-14",
                      "overflow-hidden rounded-lg",
                      "border-2",
                      "transition-all duration-200",
                      selectedIndex === index
                        ? "border-white scale-110"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={url}
                      alt={`Miniatura ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}