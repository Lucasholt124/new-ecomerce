"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  CreditCard,
  Lock,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartItems, useTotalPrice } from "@/lib/store/cart-store-provider";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { cn, formatPrice } from "@/lib/utils";

interface CheckoutButtonProps {
  disabled?: boolean;
  variant?: "default" | "compact" | "prominent";
  showTrustBadges?: boolean;
  cpf?: string;
}

// Etapas visuais para dar feedback ao usuário
const CHECKOUT_STEPS = [
  { label: "Validando estoque...", duration: 800 },
  { label: "Gerando cobrança segura...", duration: 1500 }, // Tempo para o Asaas responder
  { label: "Redirecionando...", duration: 500 },
];

export function CheckoutButton({
  disabled,
  variant = "default",
  showTrustBadges = true,
  cpf,
}: CheckoutButtonProps) {
  const router = useRouter();
  const items = useCartItems();
  const totalPrice = useTotalPrice();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const isDisabled = disabled || isPending || items.length === 0;

  const handleCheckout = () => {
    // 1. Validação de Segurança do CPF no Frontend
    if (!cpf || cpf.replace(/\D/g, "").length < 11) {
      toast.error("CPF Necessário", {
        description: "Por favor, preencha um CPF válido para emitir a nota fiscal.",
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      });
      return;
    }

    setError(null);
    setCurrentStep(0);

    startTransition(async () => {
      try {
        // Passo 1: Feedback visual
        setCurrentStep(0);
        await new Promise((resolve) => setTimeout(resolve, CHECKOUT_STEPS[0].duration));

        // Passo 2: Chamada Real ao Backend (Server Action)
        setCurrentStep(1);

        // Remove pontuação do CPF antes de enviar
        const cleanCpf = cpf.replace(/\D/g, "");
        const result = await createCheckoutSession(items, cleanCpf);

        if (result.success && result.url) {
          // Sucesso!
          setCurrentStep(2);
          setIsSuccess(true);

          toast.success("Pedido Criado!", {
            description: "Abrindo o pagamento seguro do Asaas...",
            icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
          });

          // Pequeno delay para o usuário ver o check de sucesso
          await new Promise((resolve) => setTimeout(resolve, 800));

          // Redirecionamento real
          window.location.href = result.url;
        } else {
          // Erro retornado pelo backend (ex: estoque acabou durante o clique)
          throw new Error(result.error || "Não foi possível criar o pedido.");
        }
      } catch (err: any) {
        console.error("Erro no checkout:", err);
        setError(err.message ?? "Falha na conexão.");
        setIsSuccess(false);
        setCurrentStep(0);

        toast.error("Erro ao processar", {
          description: err.message,
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        });
      }
    });
  };

  // ============================================
  // RENDERIZAÇÃO (Mantive seu design excelente)
  // ============================================

  if (variant === "compact") {
    return (
      <Button
        onClick={handleCheckout}
        disabled={isDisabled}
        className={cn(
          "w-full gap-2 transition-all",
          isSuccess ? "bg-emerald-600 hover:bg-emerald-700" : "bg-zinc-900 hover:bg-zinc-800",
          "dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900"
        )}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processando...</span>
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            <span>Pagar {formatPrice(totalPrice)}</span>
          </>
        )}
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Efeito Glow para variante prominent */}
        {!isDisabled && variant === "prominent" && !isSuccess && (
          <div
            className={cn(
              "absolute -inset-1 rounded-2xl opacity-0",
              "bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500",
              "blur-xl transition-opacity duration-500",
              "group-hover:opacity-20 animate-pulse"
            )}
            aria-hidden="true"
          />
        )}

        <Button
          onClick={handleCheckout}
          disabled={isDisabled}
          className={cn(
            "group relative w-full overflow-hidden",
            "transition-all duration-300",
            variant === "prominent" ? "h-16 text-lg rounded-2xl" : "h-14 text-base rounded-xl",

            // Cores baseadas no estado
            isSuccess
              ? "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 text-white"
              : "bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950",

            // Sombra
            "shadow-xl shadow-zinc-900/10 dark:shadow-none",
            !isDisabled && "hover:-translate-y-0.5 active:translate-y-0",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {/* Barra de Progresso Interna */}
          {isPending && (
            <div className="absolute bottom-0 left-0 h-1 bg-black/10 dark:bg-white/20 w-full">
               <div
                 className="h-full bg-emerald-400 transition-all duration-500 ease-out"
                 style={{ width: `${((currentStep + 1) / CHECKOUT_STEPS.length) * 100}%` }}
               />
            </div>
          )}

          <span className="relative flex items-center justify-center gap-3">
            {isPending ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="font-semibold">{CHECKOUT_STEPS[currentStep]?.label}</span>
                </div>
              </div>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="h-6 w-6 animate-bounce" />
                <span className="font-bold">Redirecionando...</span>
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                <span className="font-bold">
                  Pagar {formatPrice(totalPrice)}
                </span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </span>
        </Button>
      </div>

      {/* Mensagem de Erro Inline */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-lg animate-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
          <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Selos de Confiança */}
      {showTrustBadges && !error && !isSuccess && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 opacity-80">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Checkout criptografado via Asaas</span>
          </div>

          {variant === "prominent" && (
            <div className="flex items-center justify-center gap-3">
               <div className="flex gap-1.5 opacity-60 grayscale transition-all hover:grayscale-0 hover:opacity-100">
                  <CreditCard className="h-6 w-6" /> {/* Representando Cartão */}
               </div>
               <span className="text-[10px] text-zinc-300">|</span>
               <div className="flex gap-1 items-center bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                  <Sparkles className="h-3 w-3" />
                  PIX (Aprovação imediata)
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}