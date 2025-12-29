// components/app/AppShell.tsx
"use client";

import { useEffect, useState } from "react";
import { useIsChatOpen } from "@/lib/store/chat-store-provider";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const isChatOpen = useIsChatOpen();
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Evita hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Controla o estado de animação para transições suaves
  useEffect(() => {
    if (isMounted) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isChatOpen, isMounted]);

  // Bloqueia scroll do body em mobile quando chat está aberto
  useEffect(() => {
    if (!isMounted) return;

    const handleResize = () => {
      const isXL = window.innerWidth >= 1280;

      if (isChatOpen && !isXL) {
        // Mobile/Tablet: bloqueia scroll
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        document.body.style.top = `-${window.scrollY}px`;
      } else {
        // Desktop ou chat fechado: restaura scroll
        const scrollY = document.body.style.top;
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.top = "";

        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      // Cleanup ao desmontar
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [isChatOpen, isMounted]);

  // SSR: renderiza sem classes de animação
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
        {children}
      </div>
    );
  }

  return (
    <>
      {/* Main Content Container */}
      <div
        className={cn(
          // Base styles
          "relative min-h-screen",
          "bg-zinc-50 dark:bg-zinc-900",

          // Smooth transitions
          "transition-all duration-300 ease-out",

          // Chat open state - Desktop (XL+)
          isChatOpen && [
            // Margem para o chat sidebar
            "xl:mr-[400px] 2xl:mr-[448px]",
          ],

          // Chat open state - Mobile/Tablet
          isChatOpen && [
            "max-xl:overflow-hidden",
            "max-xl:h-screen",
            "max-xl:pointer-events-none",
          ],

          // Animating state
          isAnimating && "will-change-[margin]"
        )}
      >
        {/* Content Wrapper com fade sutil em mobile quando chat abre */}
        <div
          className={cn(
            "relative z-0",
            "transition-opacity duration-300 ease-out",
            isChatOpen && "max-xl:opacity-50"
          )}
        >
          {children}
        </div>

        {/* Overlay escuro em mobile quando chat está aberto */}
        <div
          className={cn(
            "fixed inset-0 z-40",
            "bg-black/60 backdrop-blur-sm",
            "transition-all duration-300 ease-out",
            "xl:hidden", // Só aparece em mobile/tablet
            isChatOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
          aria-hidden="true"
        />
      </div>

      {/* Indicador visual de chat ativo - Desktop */}
      <div
        className={cn(
          "fixed right-0 top-0 bottom-0 z-30",
          "hidden xl:block",
          "w-1 bg-gradient-to-b from-amber-400 via-amber-500 to-orange-500",
          "shadow-lg shadow-amber-500/20",
          "transition-all duration-300 ease-out",
          isChatOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-2"
        )}
        style={{
          right: isChatOpen ? "400px" : "0",
        }}
        aria-hidden="true"
      />
    </>
  );
}