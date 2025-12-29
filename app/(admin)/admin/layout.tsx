"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { Providers } from "@/components/providers/Providers";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    label: "Painel",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Estoque",
    href: "/admin/inventory",
    icon: Package,
  },
  {
    label: "Pedidos",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
];

function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fecha sidebar ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Previne scroll do body quando sidebar está aberta no mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  // Fecha sidebar ao navegar (mobile)
  const handleNavClick = () => {
    setSidebarOpen(false);
  };

  return (
    <Providers>
      <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
        {/* Mobile Header */}
        <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900 lg:hidden">
          <Link
            href="/admin"
            className="flex items-center gap-2"
            onClick={handleNavClick}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100">
              <span className="text-sm font-bold text-white dark:text-zinc-900">
                A
              </span>
            </div>
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Admin
            </span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </header>

        {/* Mobile Overlay */}
        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden",
            sidebarOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-0 z-50 h-screen w-64 border-r border-zinc-200 bg-white transition-transform duration-300 ease-out dark:border-zinc-800 dark:bg-zinc-900",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "lg:translate-x-0"
          )}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-6 dark:border-zinc-800">
              <Link
                href="/admin"
                className="flex items-center gap-2"
                onClick={handleNavClick}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 shadow-sm dark:bg-zinc-100">
                  <span className="text-sm font-bold text-white dark:text-zinc-900">
                    A
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    Admin
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Painel de Controle
                  </span>
                </div>
              </Link>

              {/* Botão fechar - apenas mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="h-8 w-8 lg:hidden"
                aria-label="Fechar menu"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavClick}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                          isActive
                            ? "bg-white/20 dark:bg-zinc-900/20"
                            : "bg-zinc-100 dark:bg-zinc-800"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                      </div>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
              <Link
                href="/studio"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleNavClick}
                className="flex items-center justify-between gap-2 rounded-xl bg-zinc-100 px-4 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              >
                <span>Abrir Studio</span>
                <ExternalLink className="h-4 w-4" />
              </Link>

              <Link
                href="/"
                onClick={handleNavClick}
                className="mt-3 flex items-center gap-2 px-2 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                <span>←</span>
                <span>Voltar para a Loja</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 pt-14 lg:ml-64 lg:pt-0">
          <div className="min-h-screen p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </Providers>
  );
}

export default AdminLayout;