"use client";

import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";

const SanityAppProvider = dynamic(
  () => import("@/components/providers/SanityAppProvider"),
  {
    ssr: false,
    loading: () => (
      <LoadingSpinner text="Carregando o SDK do aplicativo Sanity..." isFullScreen size="lg" />
    ),
  },
);

export function Providers({ children }: { children: React.ReactNode }) {
  return <SanityAppProvider>{children}</SanityAppProvider>;
}