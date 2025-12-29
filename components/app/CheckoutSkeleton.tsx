// components/app/CheckoutSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-4 w-12" />
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <Skeleton className="h-4 w-20" />
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Title & Subtitle */}
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48 sm:h-10 sm:w-64" />
              <Skeleton className="mt-2 h-4 w-32" />
            </div>
            {/* Security Badge */}
            <div className="hidden sm:flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* ============================================ */}
          {/* LEFT COLUMN - Cart Items */}
          {/* ============================================ */}
          <div className="lg:col-span-3 space-y-6">
            {/* Cart Items Card */}
            <div
              className={cn(
                "overflow-hidden rounded-2xl",
                "border border-zinc-200 dark:border-zinc-800",
                "bg-white dark:bg-zinc-950"
              )}
            >
              {/* Card Header */}
              <div
                className={cn(
                  "flex items-center justify-between",
                  "border-b border-zinc-200 dark:border-zinc-800",
                  "px-6 py-4"
                )}
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-5 w-36" />
                </div>
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>

              {/* Items List */}
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 sm:p-6"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {/* Product Image */}
                    <Skeleton
                      className={cn(
                        "h-20 w-20 sm:h-24 sm:w-24",
                        "shrink-0 rounded-xl"
                      )}
                    />

                    {/* Product Details */}
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-40 sm:w-56" />
                        <Skeleton className="h-4 w-24" />
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-6 w-6 rounded-md" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <Skeleton className="h-10 w-28 rounded-lg" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Footer - Continue Shopping */}
              <div
                className={cn(
                  "flex items-center justify-center gap-2",
                  "border-t border-zinc-100 dark:border-zinc-800",
                  "px-6 py-4",
                  "bg-zinc-50 dark:bg-zinc-900/50"
                )}
              >
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            {/* Coupon Section */}
            <div
              className={cn(
                "rounded-2xl",
                "border border-zinc-200 dark:border-zinc-800",
                "bg-white dark:bg-zinc-950",
                "p-6"
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 w-40" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-12 flex-1 rounded-xl" />
                <Skeleton className="h-12 w-24 rounded-xl" />
              </div>
            </div>

            {/* Shipping Info */}
            <div
              className={cn(
                "rounded-2xl",
                "border border-zinc-200 dark:border-zinc-800",
                "bg-white dark:bg-zinc-950",
                "p-6"
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* RIGHT COLUMN - Order Summary */}
          {/* ============================================ */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              {/* Order Summary Card */}
              <div
                className={cn(
                  "rounded-2xl",
                  "border border-zinc-200 dark:border-zinc-800",
                  "bg-white dark:bg-zinc-950",
                  "overflow-hidden"
                )}
              >
                {/* Card Header */}
                <div
                  className={cn(
                    "px-6 py-4",
                    "border-b border-zinc-200 dark:border-zinc-800",
                    "bg-zinc-50 dark:bg-zinc-900"
                  )}
                >
                  <Skeleton className="h-5 w-36" />
                </div>

                {/* Summary Content */}
                <div className="p-6 space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>

                  {/* Discount */}
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>

                  {/* Divider */}
                  <div className="border-t border-dashed border-zinc-200 dark:border-zinc-700 my-2" />

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-8 w-28" />
                  </div>

                  {/* Installments */}
                  <div className="text-right">
                    <Skeleton className="h-3 w-36 ml-auto" />
                  </div>

                  {/* PIX Discount */}
                  <div
                    className={cn(
                      "flex items-center justify-between",
                      "px-3 py-2",
                      "bg-green-50 dark:bg-green-950/30",
                      "rounded-lg"
                    )}
                  >
                    <Skeleton className="h-4 w-24 bg-green-200 dark:bg-green-900" />
                    <Skeleton className="h-4 w-20 bg-green-200 dark:bg-green-900" />
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="px-6 pb-6">
                  <Skeleton className="h-14 w-full rounded-xl" />
                </div>

                {/* Trust Badges */}
                <div
                  className={cn(
                    "px-6 py-4",
                    "border-t border-zinc-100 dark:border-zinc-800",
                    "bg-zinc-50 dark:bg-zinc-900/50"
                  )}
                >
                  <div className="flex items-center justify-center gap-4">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-6 w-12 rounded" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Help Card */}
              <div
                className={cn(
                  "rounded-2xl",
                  "border border-zinc-200 dark:border-zinc-800",
                  "bg-white dark:bg-zinc-950",
                  "p-6"
                )}
              >
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* MOBILE STICKY FOOTER */}
        {/* ============================================ */}
        <div
          className={cn(
            "fixed bottom-0 left-0 right-0 z-40",
            "lg:hidden",
            "border-t border-zinc-200 dark:border-zinc-800",
            "bg-white dark:bg-zinc-950",
            "px-4 py-4",
            "shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)]"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>

      {/* Spacer for mobile sticky footer */}
      <div className="h-32 lg:hidden" />
    </div>
  );
}