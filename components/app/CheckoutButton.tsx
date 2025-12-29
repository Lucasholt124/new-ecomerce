// components/app/CheckoutButton.tsx
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
}

// Etapas do processo de checkout
const CHECKOUT_STEPS = [
  { label: "Verificando carrinho", duration: 400 },
  { label: "Conectando ao pagamento", duration: 600 },
  { label: "Preparando checkout seguro", duration: 500 },
];

export function CheckoutButton({
  disabled,
  variant = "default",
  showTrustBadges = true,
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
    setError(null);
    setCurrentStep(0);

    startTransition(async () => {
      // Simula etapas do processo para feedback visual
      for (let i = 0; i < CHECKOUT_STEPS.length; i++) {
        setCurrentStep(i);
        await new Promise((resolve) =>
          setTimeout(resolve, CHECKOUT_STEPS[i].duration)
        );
      }

      // Chama a Server Action
      const result = await createCheckoutSession(items);

      if (result.success && result.url) {
        setIsSuccess(true);
        toast.success("Redirecionando para pagamento seguro", {
          description: "Você será redirecionado em instantes...",
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        });

        // Pequeno delay para mostrar sucesso
        await new Promise((resolve) => setTimeout(resolve, 500));
        router.push(result.url);
      } else {
        setError(result.error ?? "Falha ao iniciar pagamento");
        toast.error("Erro no Pagamento", {
          description: result.error ?? "Tente novamente em alguns instantes",
          icon: <AlertCircle className="h-4 w-4" />,
        });
      }
    });
  };

  // ============================================
  // VARIANT: COMPACT
  // ============================================
  if (variant === "compact") {
    return (
      <Button
        onClick={handleCheckout}
        disabled={isDisabled}
        className={cn(
          "w-full gap-2",
          "bg-zinc-900 hover:bg-zinc-800",
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

  // ============================================
  // VARIANT: PROMINENT & DEFAULT
  // ============================================
  return (
    <div className="space-y-4">
      {/* Main Button */}
      <div className="relative">
        {/* Glow Effect */}
        {!isDisabled && variant === "prominent" && (
          <div
            className={cn(
              "absolute -inset-1 rounded-2xl opacity-0",
              "bg-gradient-to-r from-green-500 via-emerald-500 to-green-500",
              "blur-xl transition-opacity duration-500",
              "group-hover:opacity-30"
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

            // Sizing
            variant === "prominent" ? "h-16 text-lg" : "h-14 text-base",

            // Colors - Success State
            isSuccess && [
              "bg-green-500 hover:bg-green-600",
              "dark:bg-green-500 dark:hover:bg-green-600",
            ],

            // Colors - Normal State
            !isSuccess && [
              "bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900",
              "hover:from-zinc-800 hover:via-zinc-700 hover:to-zinc-800",
              "dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-100",
              "dark:hover:from-white dark:hover:via-zinc-100 dark:hover:to-white",
              "dark:text-zinc-900",
            ],

            // Shadow
            "shadow-xl shadow-zinc-900/20 dark:shadow-zinc-100/10",
            "hover:shadow-2xl hover:shadow-zinc-900/30",
            !isDisabled && "hover:-translate-y-0.5",

            // Disabled
            "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0",

            // Border radius
            variant === "prominent" ? "rounded-2xl" : "rounded-xl"
          )}
        >
          {/* Shimmer Effect */}
          <div
            className={cn(
              "absolute inset-0",
              "bg-gradient-to-r from-transparent via-white/10 to-transparent",
              "-translate-x-full group-hover:translate-x-full",
              "transition-transform duration-1000 ease-out"
            )}
            aria-hidden="true"
          />

          {/* Button Content */}
          <span className="relative flex items-center justify-center gap-3">
            {isPending ? (
              <>
                {/* Loading State */}
                <div className="relative">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <div className="absolute inset-0 animate-ping">
                    <Loader2 className="h-5 w-5 opacity-30" />
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold">
                    {CHECKOUT_STEPS[currentStep]?.label || "Processando..."}
                  </span>
                  {variant === "prominent" && (
                    <span className="text-xs opacity-70">
                      Etapa {currentStep + 1} de {CHECKOUT_STEPS.length}
                    </span>
                  )}
                </div>
              </>
            ) : isSuccess ? (
              <>
                {/* Success State */}
                <CheckCircle2 className="h-5 w-5 animate-in zoom-in duration-200" />
                <span className="font-semibold">Redirecionando...</span>
              </>
            ) : (
              <>
                {/* Normal State */}
                <Lock className="h-5 w-5" />
                <span className="font-semibold">
                  Finalizar Compra
                  {variant === "prominent" && (
                    <span className="ml-2 opacity-80">
                      • {formatPrice(totalPrice)}
                    </span>
                  )}
                </span>
                <ArrowRight
                  className={cn(
                    "h-5 w-5",
                    "transition-transform duration-300",
                    "group-hover:translate-x-1"
                  )}
                />
              </>
            )}
          </span>
        </Button>

        {/* Progress Bar (during loading) */}
        {isPending && (
          <div className="absolute -bottom-1 left-4 right-4">
            <div className="h-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className={cn(
                  "h-full rounded-full",
                  "bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500",
                  "transition-all duration-500 ease-out"
                )}
                style={{
                  width: `${((currentStep + 1) / CHECKOUT_STEPS.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div
          className={cn(
            "flex items-center gap-2",
            "px-4 py-3",
            "bg-red-50 dark:bg-red-950/30",
            "border border-red-200 dark:border-red-900",
            "rounded-xl",
            "animate-in fade-in slide-in-from-top-2 duration-300"
          )}
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              {error}
            </p>
            <button
              onClick={handleCheckout}
              className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 underline underline-offset-2"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {/* Trust Badges */}
      {showTrustBadges && !error && (
        <div className="space-y-3">
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span>Pagamento 100% seguro via Asaas</span>
          </div>

          {/* Payment Methods */}
          {variant === "prominent" && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                Formas de pagamento aceitas
              </span>
              <div className="flex items-center justify-center gap-2">
                {[
                  { name: "Pix", highlight: true },
                  { name: "Crédito", highlight: false },
                  { name: "Boleto", highlight: false },
                ].map((method) => (
                  <span
                    key={method.name}
                    className={cn(
                      "px-2.5 py-1",
                      "text-[10px] font-medium",
                      "rounded-md",
                      method.highlight
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    )}
                  >
                    {method.highlight && "⚡ "}
                    {method.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* PIX Discount Highlight */}
          {variant === "prominent" && (
            <div
              className={cn(
                "flex items-center justify-center gap-2",
                "px-4 py-2",
                "bg-gradient-to-r from-green-50 to-emerald-50",
                "dark:from-green-950/20 dark:to-emerald-950/20",
                "border border-green-200 dark:border-green-900",
                "rounded-lg"
              )}
            >
              <Sparkles className="h-4 w-4 text-green-500" />
              <span className="text-xs font-medium text-green-700 dark:text-green-400">
                Pague com PIX e ganhe 5% de desconto
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}