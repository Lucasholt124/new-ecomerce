"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useApplyDocumentActions,
  useDocument,
  useQuery,
  deleteDocument,
  discardDocument,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DeleteButtonProps {
  handle: DocumentHandle;
  redirectTo?: string;
}

function DeleteButtonContent({
  handle,
  redirectTo = "/admin/inventory",
}: DeleteButtonProps) {
  const router = useRouter();
  const apply = useApplyDocumentActions();

  const baseId = handle.documentId.replace("drafts.", "");

  // Estado do documento em tempo real
  const { data: doc } = useDocument(handle);

  // Verifica se existe versão publicada
  const { data: publishedDoc } = useQuery<{ _id: string } | null>({
    query: `*[_id == $id][0]{ _id }`,
    params: { id: baseId },
    perspective: "published",
  });

  // Verifica se algum pedido referencia este produto (Segurança crítica)
  const { data: referencingOrders } = useQuery<{ _id: string }[]>({
    query: `*[_type == "order" && references($id)]{ _id }`,
    params: { id: baseId },
  });

  const isDraft = doc?._id?.startsWith("drafts.");
  const hasPublishedVersion = !!publishedDoc;
  const hasReferences = referencingOrders && referencingOrders.length > 0;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este produto permanentemente? Esta ação não pode ser desfeita."
    );
    if (!confirmed) return;

    try {
      if (hasPublishedVersion) {
        const result = await apply(
          deleteDocument({
            documentId: baseId,
            documentType: handle.documentType,
          })
        );
        await result.submitted();
      } else if (isDraft) {
        const result = await apply(
          discardDocument({
            documentId: baseId,
            documentType: handle.documentType,
          })
        );
        await result.submitted();
      }
      router.push(redirectTo);
    } catch (error) {
      console.error("Falha ao excluir:", error);
      alert("Erro ao excluir o documento. Verifique o console.");
    }
  };

  // Se houver pedidos usando este produto, força a exclusão via Studio para segurança
  if (hasReferences) {
    const orderCount = referencingOrders?.length ?? 0;
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="destructive" size="sm" className="gap-1.5" asChild>
              <Link
                href={`/studio/structure/${handle.documentType};${baseId}`}
                target="_blank"
              >
                <Trash2 className="h-4 w-4" />
                Excluir no Studio
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Este produto está vinculado a {orderCount} pedido
              {orderCount !== 1 ? "s" : ""}.
              <br />
              Exclua-o pelo Studio para gerenciar as referências.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Sem referências - pode excluir diretamente
  return (
    <Button
      variant="destructive"
      size="sm"
      className="gap-1.5"
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
      Excluir
    </Button>
  );
}

function DeleteButtonFallback() {
  return <Skeleton className="h-9 w-20" />;
}

export function DeleteButton(props: DeleteButtonProps) {
  return (
    <Suspense fallback={<DeleteButtonFallback />}>
      <DeleteButtonContent {...props} />
    </Suspense>
  );
}