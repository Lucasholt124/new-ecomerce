"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  useDocuments,
  useApplyDocumentActions,
  createDocumentHandle,
  createDocument,
} from "@sanity/sdk-react";
import { Plus, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody } from "@/components/ui/table";
import {
  ProductRow,
  ProductRowSkeleton,
  AdminSearch,
  useProductSearchFilter,
  ProductTableHeader,
} from "@/components/admin";

interface ProductListContentProps {
  filter?: string;
  onCreateProduct: () => void;
  isCreating: boolean;
}

function ProductListContent({
  filter,
  onCreateProduct,
  isCreating,
}: ProductListContentProps) {
  const {
    data: products,
    hasMore,
    loadMore,
    isPending,
  } = useDocuments({
    documentType: "product",
    filter,
    orderings: [
      { field: "stock", direction: "asc" },
      { field: "name", direction: "asc" },
    ],
    batchSize: 20,
  });

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title={filter ? "Nenhum produto encontrado" : "Nenhum produto ainda"}
        description={
          filter
            ? "Tente ajustar seus termos de busca."
            : "Comece adicionando seu primeiro produto."
        }
        action={
          !filter
            ? {
                label: "Adicionar Produto",
                onClick: onCreateProduct,
                disabled: isCreating,
                icon: isCreating ? Loader2 : Plus,
              }
            : undefined
        }
      />
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <Table>
          <ProductTableHeader />
          <TableBody>
            {products.map((handle) => (
              <ProductRow key={handle.documentId} {...handle} />
            ))}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            onClick={() => loadMore()}
            disabled={isPending}
          >
            {isPending ? "Carregando..." : "Carregar Mais"}
          </Button>
        </div>
      )}
    </>
  );
}

function ProductListSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <Table>
        <ProductTableHeader />
        <TableBody>
          {[1, 2, 3, 4, 5].map((i) => (
            <ProductRowSkeleton key={i} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function InventoryContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const { filter, isSearching } = useProductSearchFilter(searchQuery);

  // Tenta usar o hook, mas se falhar (fora do contexto), temos fallback
  const apply = useApplyDocumentActions();

  const handleCreateProduct = () => {
    startTransition(async () => {
      try {
        const newId = crypto.randomUUID();
        const newDocHandle = createDocumentHandle({
          documentId: newId,
          documentType: "product",
        });
        await apply(createDocument(newDocHandle));
        router.push(`/admin/inventory/${newId}`);
      } catch (error) {
        console.error("Erro ao criar via SDK, redirecionando...", error);
        // Fallback para criação manual
        router.push("/admin/inventory/new");
      }
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            Estoque
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:text-base">
            Gerencie o estoque e preços dos seus produtos
          </p>
        </div>
        <Button
          onClick={handleCreateProduct}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Novo Produto
        </Button>
      </div>

      {/* Search */}
      <AdminSearch
        placeholder="Buscar produtos..."
        value={searchQuery}
        onChange={setSearchQuery}
        className="w-full sm:max-w-sm"
      />

      {/* Product List */}
      {isSearching ? (
        <ProductListSkeleton />
      ) : (
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductListContent
            filter={filter}
            onCreateProduct={handleCreateProduct}
            isCreating={isPending}
          />
        </Suspense>
      )}
    </div>
  );
}

export default function InventoryPage() {
  return <InventoryContent />;
}