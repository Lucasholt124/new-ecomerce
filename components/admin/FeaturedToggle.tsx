"use client";

import { Suspense } from "react";
import {
  useDocument,
  useEditDocument,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface FeaturedToggleProps extends DocumentHandle {}

function FeaturedToggleContent(handle: FeaturedToggleProps) {
  // Pega o valor atual do campo "featured"
  const { data: featured } = useDocument({ ...handle, path: "featured" });
  // Hook para atualizar o campo
  const editFeatured = useEditDocument({ ...handle, path: "featured" });

  const isFeatured = featured as boolean;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => editFeatured(!isFeatured)}
      title={isFeatured ? "Remover dos destaques" : "Adicionar aos destaques"}
    >
      <Star
        className={cn(
          "h-4 w-4 transition-colors",
          isFeatured
            ? "fill-amber-400 text-amber-400"
            : "text-zinc-300 dark:text-zinc-600",
        )}
      />
    </Button>
  );
}

function FeaturedToggleSkeleton() {
  return <Skeleton className="h-8 w-8" />;
}

export function FeaturedToggle(props: FeaturedToggleProps) {
  return (
    <Suspense fallback={<FeaturedToggleSkeleton />}>
      <FeaturedToggleContent {...props} />
    </Suspense>
  );
}