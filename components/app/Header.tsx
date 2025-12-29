// components/app/Header.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Sparkles,
  User,
  Search,
  Menu,
  X,
  Heart,
  ChevronDown,
  Truck,
  Phone,
  ArrowRight,
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useCartActions, useTotalItems } from "@/lib/store/cart-store-provider";
import { useChatActions, useIsChatOpen } from "@/lib/store/chat-store-provider";
import { cn } from "@/lib/utils";

export function Header() {
  const { openCart } = useCartActions();
  const { openChat } = useChatActions();
  const isChatOpen = useIsChatOpen();
  const totalItems = useTotalItems();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detecta scroll para mudar estilo do header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fecha menu mobile ao redimensionar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMoreDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fecha dropdown ao pressionar Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMoreDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      {/* ============================================ */}
      {/* TOP BAR - Promos/Info */}
      {/* ============================================ */}
      <div
        className={cn(
          "relative z-50",
          "bg-zinc-900 dark:bg-zinc-950",
          "text-white",
          "transition-all duration-300",
          isScrolled ? "h-0 overflow-hidden opacity-0" : "h-auto opacity-100"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-9 items-center justify-between text-xs sm:text-sm">
            {/* Left - Shipping Info */}
            <div className="hidden items-center gap-1.5 sm:flex">
              <Truck className="h-3.5 w-3.5 text-green-400" />
              <span>
                <span className="font-medium text-green-400">Frete Grátis</span>
                {" "}acima de R$ 299
              </span>
            </div>

            {/* Center - Promo */}
            <div className="flex flex-1 items-center justify-center gap-2 sm:flex-initial">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-medium">
                Até <span className="text-amber-400">40% OFF</span> na coleção nova
              </span>
            </div>

            {/* Right - Contact */}
            <div className="hidden items-center gap-4 sm:flex">
              <a
                href="tel:+5511999999999"
                className="flex items-center gap-1 transition-colors hover:text-amber-400"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>(11) 99999-9999</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* MAIN HEADER */}
      {/* ============================================ */}
      <header
        className={cn(
          "sticky top-0 z-50",
          "border-b",
          "transition-all duration-300",
          isScrolled
            ? [
                "border-zinc-200 dark:border-zinc-800",
                "bg-white/95 dark:bg-zinc-950/95",
                "backdrop-blur-lg",
                "shadow-sm",
              ]
            : [
                "border-zinc-100 dark:border-zinc-800",
                "bg-white dark:bg-zinc-950",
              ]
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
            {/* ============================================ */}
            {/* LEFT SECTION - Logo + Nav */}
            {/* ============================================ */}
            <div className="flex items-center gap-8">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center",
                  "rounded-lg",
                  "text-zinc-600 dark:text-zinc-400",
                  "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  "transition-colors duration-200",
                  "md:hidden"
                )}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>

              {/* Logo */}
              <Link
                href="/"
                className="group flex items-center gap-2"
              >
                {/* Logo Icon */}
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center",
                    "rounded-xl",
                    "bg-gradient-to-br from-amber-400 to-orange-500",
                    "shadow-lg shadow-amber-500/20",
                    "transition-transform duration-300",
                    "group-hover:scale-105"
                  )}
                >
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>

                {/* Logo Text */}
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-xl font-bold tracking-tight",
                      "text-zinc-900 dark:text-zinc-100"
                    )}
                  >
                    Móveis
                    <span className="text-amber-500">Store</span>
                  </span>
                  <span className="hidden text-[10px] text-zinc-500 dark:text-zinc-400 lg:block">
                    Móveis com Design
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden items-center gap-1 md:flex">
                {[
                  { label: "Todos", href: "/" },
                  { label: "Sofás", href: "/?category=sofas" },
                  { label: "Cadeiras", href: "/?category=chairs" },
                  { label: "Mesas", href: "/?category=tables" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-2",
                      "text-sm font-medium",
                      "text-zinc-600 dark:text-zinc-400",
                      "hover:text-zinc-900 dark:hover:text-zinc-100",
                      "rounded-lg",
                      "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                      "transition-colors duration-200"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Dropdown para mais - CORRIGIDO */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                    onMouseEnter={() => setIsMoreDropdownOpen(true)}
                    className={cn(
                      "flex items-center gap-1",
                      "px-3 py-2",
                      "text-sm font-medium",
                      "text-zinc-600 dark:text-zinc-400",
                      "hover:text-zinc-900 dark:hover:text-zinc-100",
                      "rounded-lg",
                      "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                      "transition-colors duration-200"
                    )}
                    aria-expanded={isMoreDropdownOpen}
                    aria-haspopup="true"
                  >
                    Mais
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isMoreDropdownOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Dropdown Menu - CORRIGIDO */}
                  <div
                    className={cn(
                      "absolute top-full left-0 mt-1",
                      "w-48",
                      "py-2",
                      "bg-white dark:bg-zinc-900",
                      "border border-zinc-200 dark:border-zinc-700",
                      "rounded-xl",
                      "shadow-xl shadow-black/5",
                      "transition-all duration-200",
                      isMoreDropdownOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible translate-y-2 pointer-events-none"
                    )}
                    onMouseLeave={() => setIsMoreDropdownOpen(false)}
                  >
                    {[
                      { label: "Camas", href: "/?category=camas" },
                      { label: "Armários", href: "/?category=armarios" },
                      { label: "Estantes", href: "/?category=estantes" },
                      { label: "Decoração", href: "/?category=decoracao" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMoreDropdownOpen(false)}
                        className={cn(
                          "block px-4 py-2.5",
                          "text-sm",
                          "text-zinc-600 dark:text-zinc-400",
                          "hover:text-zinc-900 dark:hover:text-zinc-100",
                          "hover:bg-zinc-50 dark:hover:bg-zinc-800",
                          "transition-colors duration-150"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>
            </div>

            {/* ============================================ */}
            {/* RIGHT SECTION - Actions */}
            {/* ============================================ */}
            <div className="flex items-center gap-2">
              {/* Search Button - Desktop */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden h-10 w-10 rounded-lg text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 sm:flex"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Buscar</span>
              </Button>

              {/* Wishlist - Desktop */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden h-10 w-10 rounded-lg text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 lg:flex"
              >
                <Heart className="h-5 w-5" />
                <span className="sr-only">Lista de desejos</span>
              </Button>

              {/* My Orders - Signed In */}
              <SignedIn>
                <Button
                  asChild
                  variant="ghost"
                  className="hidden h-10 gap-2 rounded-lg px-3 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 lg:flex"
                >
                  <Link href="/orders">
                    <Package className="h-5 w-5" />
                    <span className="text-sm font-medium">Pedidos</span>
                  </Link>
                </Button>
              </SignedIn>

              {/* AI Shopping Assistant */}
              {!isChatOpen && (
                <Button
                  onClick={openChat}
                  className={cn(
                    "group relative gap-2 overflow-hidden",
                    "bg-gradient-to-r from-amber-500 to-orange-500",
                    "hover:from-amber-600 hover:to-orange-600",
                    "text-white",
                    "shadow-lg shadow-amber-500/25",
                    "hover:shadow-xl hover:shadow-amber-500/30",
                    "transition-all duration-300",
                    "h-10 px-4",
                    "rounded-xl"
                  )}
                >
                  {/* Shimmer Effect */}
                  <span
                    className={cn(
                      "absolute inset-0",
                      "bg-gradient-to-r from-transparent via-white/20 to-transparent",
                      "-translate-x-full group-hover:translate-x-full",
                      "transition-transform duration-700"
                    )}
                  />

                  <Sparkles className="h-4 w-4" />
                  <span className="relative hidden text-sm font-medium sm:inline">
                    Perguntar à IA
                  </span>
                </Button>
              )}

              {/* Cart Button */}
              <Button
                variant="ghost"
                onClick={openCart}
                className={cn(
                  "relative",
                  "h-10 gap-2 px-3",
                  "rounded-xl",
                  "text-zinc-600 hover:text-zinc-900",
                  "dark:text-zinc-400 dark:hover:text-zinc-100",
                  "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                )}
              >
                <div className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span
                      className={cn(
                        "absolute -right-2 -top-2",
                        "flex h-5 w-5 items-center justify-center",
                        "rounded-full",
                        "bg-amber-500 text-white",
                        "text-[10px] font-bold",
                        "ring-2 ring-white dark:ring-zinc-950",
                        "animate-in zoom-in duration-200"
                      )}
                    >
                      {totalItems > 99 ? "99" : totalItems}
                    </span>
                  )}
                </div>
                <span className="hidden text-sm font-medium sm:inline">
                  Carrinho
                </span>
              </Button>

              {/* User Section */}
              <SignedIn>
                <div className="hidden sm:block">
                  <UserButton
                    afterSwitchSessionUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: cn(
                          "h-10 w-10",
                          "rounded-xl",
                          "ring-2 ring-zinc-200 dark:ring-zinc-700"
                        ),
                      },
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label="Meus Pedidos"
                        labelIcon={<Package className="h-4 w-4" />}
                        href="/orders"
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                </div>
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    className={cn(
                      "h-10 gap-2 px-3",
                      "rounded-xl",
                      "text-zinc-600 hover:text-zinc-900",
                      "dark:text-zinc-400 dark:hover:text-zinc-100"
                    )}
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden text-sm font-medium sm:inline">
                      Entrar
                    </span>
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================ */}
      {/* MOBILE MENU */}
      {/* ============================================ */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden",
          "transition-all duration-300",
          isMobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={cn(
            "absolute top-0 left-0 bottom-0",
            "w-[280px]",
            "bg-white dark:bg-zinc-950",
            "shadow-2xl",
            "transition-transform duration-300 ease-out",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 py-4">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Móveis<span className="text-amber-500">Store</span>
              </span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Menu Links */}
          <nav className="p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 140px)" }}>
            <div className="space-y-1">
              {[
                { label: "Todos os Produtos", href: "/" },
                { label: "Sofás", href: "/?category=sofas" },
                { label: "Cadeiras", href: "/?category=cadeiras" },
                { label: "Mesas", href: "/?category=mesas" },
                { label: "Camas", href: "/?category=camas" },
                { label: "Armários", href: "/?category=armarios" },
                { label: "Estantes", href: "/?category=estantes" },
                { label: "Decoração", href: "/?category=decoracao" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between",
                    "px-3 py-3",
                    "text-sm font-medium",
                    "text-zinc-700 dark:text-zinc-300",
                    "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                    "active:bg-zinc-200 dark:active:bg-zinc-700",
                    "rounded-lg",
                    "transition-colors duration-200"
                  )}
                >
                  {item.label}
                  <ArrowRight className="h-4 w-4 text-zinc-400" />
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-zinc-200 dark:border-zinc-800" />

            {/* AI Button - Mobile */}
            <button
              onClick={() => {
                openChat();
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-3",
                "px-3 py-3",
                "bg-gradient-to-r from-amber-500 to-orange-500",
                "text-white",
                "rounded-xl",
                "font-medium",
                "active:opacity-90"
              )}
            >
              <Sparkles className="h-5 w-5" />
              Perguntar à IA
            </button>

            {/* Orders Link - Mobile */}
            <SignedIn>
              <Link
                href="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 mt-2",
                  "px-3 py-3",
                  "text-sm font-medium",
                  "text-zinc-700 dark:text-zinc-300",
                  "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  "active:bg-zinc-200 dark:active:bg-zinc-700",
                  "rounded-lg"
                )}
              >
                <Package className="h-5 w-5" />
                Meus Pedidos
              </Link>
            </SignedIn>
          </nav>

          {/* Menu Footer */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950">
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <Truck className="h-4 w-4 text-green-500" />
              Frete grátis acima de R$ 299
            </div>
          </div>
        </div>
      </div>
    </>
  );
}