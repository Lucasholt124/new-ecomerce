// components/app/CategoryTilesSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CategoryTilesSkeleton() {
  // Dados mockados para variedade visual
  const mockCategories = [
    { width: "w-14" },
    { width: "w-20" },
    { width: "w-16" },
    { width: "w-24" },
    { width: "w-18" },
    { width: "w-20" },
    { width: "w-14" },
    { width: "w-16" },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Container Principal */}
      <div
        className={cn(
          "relative",
          "bg-white dark:bg-zinc-950",
          "py-4 sm:py-6"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
              <div className="h-3 w-20 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
            </div>

            {/* Scroll Controls - Desktop */}
            <div className="hidden items-center gap-1 sm:flex">
              <div className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
              <div className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            </div>
          </div>

          {/* Categories Container */}
          <div className="relative">
            {/* Scrollable Categories */}
            <div className="flex gap-2 sm:gap-3 overflow-hidden">
              {/* "Todos" Button Skeleton - Special */}
              <div
                className={cn(
                  "flex-shrink-0",
                  "flex items-center gap-2",
                  "px-4 py-2.5 sm:px-5 sm:py-3",
                  "rounded-xl sm:rounded-2xl",
                  "border-2 border-zinc-300 dark:border-zinc-600",
                  "bg-zinc-100 dark:bg-zinc-800"
                )}
              >
                <div className="h-8 w-8 rounded-lg bg-zinc-300 dark:bg-zinc-600 animate-pulse" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-4 w-12 rounded bg-zinc-300 dark:bg-zinc-600 animate-pulse" />
                  <div className="h-2 w-14 rounded bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                </div>
              </div>

              {/* Category Skeletons */}
              {mockCategories.map((cat, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-shrink-0",
                    "flex items-center gap-2",
                    "px-3 py-2.5 sm:px-4 sm:py-3",
                    "rounded-xl sm:rounded-2xl",
                    "border-2 border-zinc-200 dark:border-zinc-700",
                    "bg-white dark:bg-zinc-800",
                    // Stagger animation
                    "animate-pulse"
                  )}
                  style={{
                    animationDelay: `${i * 75}ms`,
                    animationDuration: "1.5s",
                  }}
                >
                  {/* Image Placeholder */}
                  <div
                    className={cn(
                      "h-9 w-9 sm:h-10 sm:w-10",
                      "rounded-lg",
                      "bg-gradient-to-br from-zinc-200 to-zinc-300",
                      "dark:from-zinc-700 dark:to-zinc-600"
                    )}
                  />

                  {/* Text Placeholder */}
                  <div className="flex flex-col gap-1.5">
                    <div
                      className={cn(
                        "h-4 rounded",
                        "bg-zinc-200 dark:bg-zinc-700",
                        cat.width
                      )}
                    />
                    <div className="h-2 w-16 rounded bg-zinc-100 dark:bg-zinc-800" />
                  </div>
                </div>
              ))}
            </div>

            {/* Right Fade Gradient */}
            <div
              className={cn(
                "pointer-events-none absolute right-0 top-0 bottom-0 z-10",
                "w-20 sm:w-32",
                "bg-gradient-to-l from-white via-white/90 to-transparent",
                "dark:from-zinc-950 dark:via-zinc-950/90 dark:to-transparent"
              )}
            />
          </div>
        </div>
      </div>

      {/* Mobile Hint Skeleton */}
      <div className="flex items-center justify-center gap-2 py-2 sm:hidden">
        <div className="h-2.5 w-28 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
      </div>

      {/* Animated Shimmer Overlay */}
      <div
        className={cn(
          "absolute inset-0 z-20 pointer-events-none",
          "bg-gradient-to-r from-transparent via-white/40 to-transparent",
          "dark:via-zinc-800/40",
          "-translate-x-full animate-[shimmer_2s_infinite]"
        )}
      />
    </div>
  );
}