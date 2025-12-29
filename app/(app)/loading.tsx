// app/loading.tsx
import { CategoryTilesSkeleton } from "@/components/app/CategoryTilesSkeleton";
import { ProductFiltersSkeleton } from "@/components/app/ProductFiltersSkeleton";
import { ProductGridSkeleton } from "@/components/app/ProductGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Promo Banner Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 py-2.5 sm:py-3">
          <Skeleton className="h-4 w-64 bg-zinc-700 sm:w-96" />
        </div>
      </div>

      {/* Featured Carousel Skeleton */}
      <div className="relative h-[280px] overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 sm:h-[400px] lg:h-[500px]">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Animated Loading Indicator */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 animate-ping rounded-full bg-amber-400/20" />
              <div className="absolute inset-2 animate-pulse rounded-full bg-amber-400/40" />
              <div className="absolute inset-4 rounded-full bg-amber-400/60" />
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Carousel Navigation Dots Skeleton */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              className={`h-2 rounded-full ${i === 0 ? "w-8 bg-amber-400/50" : "w-2 bg-zinc-400/30"}`}
            />
          ))}
        </div>
      </div>

      {/* Trust Badges Skeleton */}
      <div className="border-y border-zinc-200 bg-gradient-to-r from-zinc-50 via-white to-zinc-50 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:gap-8">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 rounded-xl p-3 sm:flex-row"
              >
                <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full" />
                <div className="flex flex-col items-center gap-1.5 sm:items-start">
                  <Skeleton className="h-3 w-16 sm:h-4 sm:w-20" />
                  <Skeleton className="hidden h-3 w-24 sm:block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Page Header Skeleton */}
      <div className="relative overflow-hidden border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        {/* Decorative Background */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-amber-50/30 to-transparent dark:from-amber-950/5 dark:to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 sm:pb-8 sm:pt-10 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              {/* Breadcrumb Skeleton */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-12" />
                <span className="text-zinc-300 dark:text-zinc-700">/</span>
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Title Skeleton */}
              <Skeleton className="h-8 w-48 sm:h-10 sm:w-64" />

              {/* Description Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full max-w-md" />
                <Skeleton className="h-4 w-3/4 max-w-sm" />
              </div>
            </div>

            {/* Product Count Badge Skeleton */}
            <Skeleton className="h-10 w-40 rounded-full" />
          </div>
        </div>
      </div>

      {/* Category Tiles Skeleton */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <CategoryTilesSkeleton />
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters Skeleton */}
          <aside className="w-full shrink-0 lg:w-72">
            <div className="sticky top-24">
              {/* Mobile Filter Toggle Skeleton */}
              <div className="mb-4 lg:hidden">
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>

              {/* Desktop Filters Skeleton */}
              <div className="hidden lg:block">
                <ProductFiltersSkeleton />
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="flex-1">
            {/* Toolbar Skeleton */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Results Count */}
              <Skeleton className="h-5 w-36" />

              {/* Sort & View Options */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-32 rounded-lg" />
                <Skeleton className="hidden h-10 w-10 rounded-lg sm:block" />
                <Skeleton className="hidden h-10 w-10 rounded-lg sm:block" />
              </div>
            </div>

            {/* Active Filters Skeleton */}
            <div className="mb-6 flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>

            {/* Product Grid Skeleton */}
            <ProductGridSkeleton />

            {/* Pagination Skeleton */}
            <div className="mt-10 flex items-center justify-center gap-2">
              <Skeleton className="h-10 w-10 rounded-lg" />
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-10 rounded-lg" />
              ))}
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </main>
        </div>
      </div>

      {/* Social Proof Skeleton */}
      <div className="bg-white py-8 dark:bg-zinc-950 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Skeleton className="mx-auto h-4 w-32" />
            <Skeleton className="mx-auto mt-3 h-8 w-80" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-10 sm:gap-6 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-6 text-center dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950"
              >
                <Skeleton className="mx-auto h-10 w-20" />
                <Skeleton className="mx-auto mt-3 h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Skeleton */}
      <div className="border-t border-zinc-200 bg-gradient-to-br from-zinc-900 to-zinc-950 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/80 to-orange-500/80 px-6 py-10 sm:px-12 sm:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <Skeleton className="mx-auto h-8 w-64 bg-white/20" />
              <Skeleton className="mx-auto mt-4 h-4 w-80 bg-white/20" />

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Skeleton className="h-14 flex-1 rounded-xl bg-white/20" />
                <Skeleton className="h-14 w-full rounded-xl bg-white/30 sm:w-48" />
              </div>

              <Skeleton className="mx-auto mt-4 h-3 w-48 bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}