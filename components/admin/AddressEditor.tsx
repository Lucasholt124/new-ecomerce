"use client";

import { Suspense } from "react";
import {
  useDocument,
  useEditDocument,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface AddressEditorProps extends DocumentHandle {}

function AddressField({
  handle,
  field,
  label,
  placeholder,
}: {
  handle: DocumentHandle;
  field: string;
  label: string;
  placeholder?: string;
}) {
  const path = `address.${field}`;
  // Busca o valor atual do campo no documento
  const { data: value } = useDocument({ ...handle, path });
  // Hook para editar o campo
  const editField = useEditDocument({ ...handle, path });

  return (
    <div className="space-y-1.5">
      <Label htmlFor={field} className="text-xs text-zinc-500 dark:text-zinc-400">
        {label}
      </Label>
      <Input
        id={field}
        value={(value as string) ?? ""}
        onChange={(e) => editField(e.target.value)}
        placeholder={placeholder}
        className="h-9"
      />
    </div>
  );
}

function AddressEditorContent(handle: AddressEditorProps) {
  return (
    <div className="space-y-3">
      <Suspense fallback={<Skeleton className="h-16" />}>
        <AddressField
          handle={handle}
          field="name"
          label="Nome Completo"
          placeholder="Ex: João da Silva"
        />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-16" />}>
        <AddressField
          handle={handle}
          field="line1"
          label="Endereço (Rua e Número)"
          placeholder="Av. Paulista, 1000"
        />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-16" />}>
        <AddressField
          handle={handle}
          field="line2"
          label="Complemento"
          placeholder="Apto 4B, Bloco C (opcional)"
        />
      </Suspense>

      <div className="grid grid-cols-2 gap-3">
        <Suspense fallback={<Skeleton className="h-16" />}>
          <AddressField
            handle={handle}
            field="city"
            label="Cidade"
            placeholder="São Paulo"
          />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-16" />}>
          <AddressField
            handle={handle}
            field="postcode"
            label="CEP"
            placeholder="00000-000"
          />
        </Suspense>
      </div>

      <Suspense fallback={<Skeleton className="h-16" />}>
        <AddressField
          handle={handle}
          field="country"
          label="País"
          placeholder="Brasil"
        />
      </Suspense>
    </div>
  );
}

function AddressEditorSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-16" />
      <Skeleton className="h-16" />
      <Skeleton className="h-16" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
      <Skeleton className="h-16" />
    </div>
  );
}

export function AddressEditor(props: AddressEditorProps) {
  return (
    <Suspense fallback={<AddressEditorSkeleton />}>
      <AddressEditorContent {...props} />
    </Suspense>
  );
}