"use client";

import { useEffect, useState } from "react";
import { useCurrentUser, useAuthState } from "@sanity/sdk-react";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";
import { projectId } from "@/sanity/env";


interface AuthHandlerProps {
  children: React.ReactNode;
}

export function AuthHandler({ children }: AuthHandlerProps) {
  const currentUser = useCurrentUser();
  const authState = useAuthState();
  const [isClient, setIsClient] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Aguarda estar no cliente
  if (!isClient) {
    return <LoadingSpinner text="Inicializando..." isFullScreen size="lg" />;
  }

  // Carregando estado do usuário
  if (currentUser === undefined) {
    return <LoadingSpinner text="Verificando autenticação..." isFullScreen size="lg" />;
  }

  // Não autenticado - mostra tela de login
  if (currentUser === null) {
    const handleLogin = async () => {
      setIsLoggingIn(true);

      // URL fixa de redirecionamento
      const redirectUrl = "https://new-ecomerce-gules.vercel.app/admin";

      // URL de login do Sanity
      window.location.href = `https://api.sanity.io/v1/auth/login?projectId=${projectId}&redirectUrl=${encodeURIComponent(redirectUrl)}`;
    };

    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-900">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 dark:bg-zinc-100">
              <span className="text-2xl font-bold text-white dark:text-zinc-900">A</span>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Painel Administrativo
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Faça login com sua conta Sanity para acessar o painel
            </p>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isLoggingIn ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Redirecionando...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                Entrar com Sanity
              </>
            )}
          </button>

          <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
            Você precisa ter uma conta Sanity com acesso a este projeto
          </p>
        </div>
      </div>
    );
  }

  // Autenticado - renderiza o conteúdo
  return <>{children}</>;
}