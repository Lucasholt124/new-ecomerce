"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Package, ShoppingCart, TrendingUp, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  StatCard,
  LowStockAlert,
  RecentOrders,
  AIInsightsCard,
} from "@/components/admin";

// REMOVI OS IMPORTS DO @sanity/sdk-react QUE CAUSAVAM O ERRO

export default function AdminDashboard() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCreateProduct = () => {
    // Simplesmente redireciona para sua página de criação manual
    // Se você quiser criar o documento via API, precisa ser via Server Action
    startTransition(() => {
        router.push("/admin/inventory/new");
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            Painel de Controle
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:text-base">
            Visão geral da sua loja
          </p>
        </div>
        <Button
          onClick={handleCreateProduct}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Novo Produto
        </Button>
      </div>

      {/* AI Insights */}
      <AIInsightsCard />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total de Produtos"
          icon={Package}
          documentType="product"
          href="/admin/inventory"
        />
        <StatCard
          title="Total de Pedidos"
          icon={ShoppingCart}
          documentType="order"
          href="/admin/orders"
        />
        <StatCard
          title="Estoque Baixo"
          icon={TrendingUp}
          documentType="product"
          filter="stock <= 5"
          href="/admin/inventory"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <LowStockAlert />
        <RecentOrders />
      </div>
    </div>
  );
}