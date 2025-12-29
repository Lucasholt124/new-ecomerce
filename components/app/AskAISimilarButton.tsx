// components/app/AskAISimilarButton.tsx
"use client";

import { useState } from "react";
import { Sparkles, Wand2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChatActions } from "@/lib/store/chat-store-provider";

interface AskAISimilarButtonProps {
  productName: string;
  variant?: "default" | "compact" | "prominent";
  className?: string;
}

export function AskAISimilarButton({
  productName,
  variant = "default",
  className,
}: AskAISimilarButtonProps) {
  const { openChatWithMessage } = useChatActions();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = async () => {
    setIsClicked(true);

    // Pequeno delay para feedback visual
    await new Promise((resolve) => setTimeout(resolve, 200));

    openChatWithMessage(`Mostre-me produtos similares a "${productName}"`);

    // Reset após um tempo
    setTimeout(() => setIsClicked(false), 1000);
  };

  // ============================================
  // VARIANT: COMPACT (para cards de produto)
  // ============================================
  if (variant === "compact") {
    return (
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "group flex items-center justify-center gap-1.5",
          "w-full py-2.5 px-3",
          "text-xs font-medium",
          "text-amber-600 dark:text-amber-400",
          "bg-amber-50 dark:bg-amber-950/30",
          "hover:bg-amber-100 dark:hover:bg-amber-950/50",
          "border border-amber-200 dark:border-amber-800",
          "rounded-lg",
          "transition-all duration-200",
          "hover:shadow-md hover:shadow-amber-500/10",
          className
        )}
      >
        <Sparkles
          className={cn(
            "h-3.5 w-3.5",
            "transition-transform duration-300",
            isHovered && "rotate-12 scale-110"
          )}
        />
        <span>Encontrar similares com IA</span>
      </button>
    );
  }

  // ============================================
  // VARIANT: PROMINENT (destaque máximo)
  // ============================================
  if (variant === "prominent") {
    return (
      <div className={cn("relative", className)}>
        {/* Glow Effect Background */}
        <div
          className={cn(
            "absolute -inset-1 rounded-2xl opacity-0",
            "bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500",
            "blur-xl transition-opacity duration-500",
            isHovered && "opacity-30"
          )}
          aria-hidden="true"
        />

        <button
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          disabled={isClicked}
          className={cn(
            "group relative w-full",
            "flex items-center justify-center gap-3",
            "px-6 py-4",
            "text-base font-semibold text-white",
            "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500",
            "bg-[length:200%_100%] bg-left",
            "hover:bg-right",
            "rounded-xl",
            "shadow-lg shadow-amber-500/25",
            "hover:shadow-xl hover:shadow-amber-500/30",
            "transition-all duration-500 ease-out",
            "hover:-translate-y-0.5",
            "disabled:opacity-80 disabled:cursor-wait",
            "overflow-hidden"
          )}
        >
          {/* Animated Background Shimmer */}
          <div
            className={cn(
              "absolute inset-0",
              "bg-gradient-to-r from-transparent via-white/20 to-transparent",
              "-translate-x-full",
              "group-hover:translate-x-full",
              "transition-transform duration-1000 ease-out"
            )}
            aria-hidden="true"
          />

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden rounded-xl" aria-hidden="true">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className={cn(
                  "absolute h-1 w-1 rounded-full bg-white/40",
                  "animate-pulse",
                  i % 2 === 0 ? "animate-bounce" : ""
                )}
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${2 + i * 0.3}s`,
                }}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="relative">
            {isClicked ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Wand2
                className={cn(
                  "h-5 w-5",
                  "transition-all duration-300",
                  isHovered && "rotate-12 scale-110"
                )}
              />
            )}
          </div>

          {/* Text */}
          <span className="relative">
            {isClicked ? "Buscando produtos..." : "Descobrir similares com IA"}
          </span>

          {/* Arrow */}
          <ArrowRight
            className={cn(
              "relative h-4 w-4",
              "transition-all duration-300",
              "opacity-0 -translate-x-2",
              isHovered && "opacity-100 translate-x-0"
            )}
          />
        </button>

        {/* Helper Text */}
        <p className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
          <Sparkles className="mr-1 inline h-3 w-3 text-amber-500" />
          Nossa IA encontra produtos perfeitos para você
        </p>
      </div>
    );
  }

  // ============================================
  // VARIANT: DEFAULT
  // ============================================
  return (
    <Button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isClicked}
      className={cn(
        "group relative w-full",
        "h-12",
        "gap-2",
        "overflow-hidden",
        "bg-gradient-to-r from-amber-500 to-orange-500",
        "hover:from-amber-600 hover:to-orange-600",
        "text-white font-medium",
        "shadow-lg shadow-amber-500/20",
        "hover:shadow-xl hover:shadow-amber-500/30",
        "transition-all duration-300",
        "hover:-translate-y-0.5",
        "disabled:opacity-80 disabled:cursor-wait",
        className
      )}
    >
      {/* Shimmer Effect */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-r from-transparent via-white/25 to-transparent",
          "-translate-x-full",
          "group-hover:translate-x-full",
          "transition-transform duration-700 ease-out"
        )}
        aria-hidden="true"
      />

      {/* Content */}
      <span className="relative flex items-center gap-2">
        {isClicked ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Abrindo assistente...</span>
          </>
        ) : (
          <>
            <Sparkles
              className={cn(
                "h-4 w-4",
                "transition-transform duration-300",
                isHovered && "rotate-12 scale-110"
              )}
            />
            <span>Pedir à IA produtos similares</span>
            <ArrowRight
              className={cn(
                "h-4 w-4",
                "transition-all duration-300",
                "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
              )}
            />
          </>
        )}
      </span>
    </Button>
  );
}