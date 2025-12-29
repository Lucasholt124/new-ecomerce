// app/page.tsx
import { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import {
  FEATURED_PRODUCTS_QUERY,
  FILTER_PRODUCTS_BY_NAME_QUERY,
  FILTER_PRODUCTS_BY_PRICE_ASC_QUERY,
  FILTER_PRODUCTS_BY_PRICE_DESC_QUERY,
  FILTER_PRODUCTS_BY_RELEVANCE_QUERY,
} from "@/lib/sanity/queries/products";
import { ALL_CATEGORIES_QUERY } from "@/lib/sanity/queries/categories";
import { FeaturedCarousel } from "@/components/app/FeaturedCarousel";
import { FeaturedCarouselSkeleton } from "@/components/app/FeaturedCarouselSkeleton";
import { CategoryTiles } from "@/components/app/CategoryTiles";
import { ProductSection } from "@/components/app/ProductSection";

// Ícones inline para não depender de biblioteca externa
const TruckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
);

const CreditCardIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
  </svg>
);

const ArrowPathIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const HeadphonesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
  </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
  </svg>
);

const StarIcon = ({ className, filled }: { className?: string; filled?: boolean }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={filled ? 0 : 1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>
);

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    color?: string;
    material?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    inStock?: string;
  }>;
}

// Componente de Trust Badges - Gatilhos de Confiança
function TrustBadges() {
  const badges = [
    {
      icon: TruckIcon,
      title: "Frete Grátis",
      description: "Em compras acima de R$ 299",
      highlight: true,
    },
    {
      icon: ShieldCheckIcon,
      title: "Compra Segura",
      description: "Seus dados protegidos",
      highlight: false,
    },
    {
      icon: CreditCardIcon,
      title: "Parcele em até 12x",
      description: "Sem juros no cartão",
      highlight: false,
    },
    {
      icon: ArrowPathIcon,
      title: "Troca Garantida",
      description: "30 dias para trocar",
      highlight: false,
    },
    {
      icon: HeadphonesIcon,
      title: "Suporte Premium",
      description: "Atendimento especializado",
      highlight: false,
    },
  ];

  return (
    <div className="border-y border-zinc-200 bg-gradient-to-r from-zinc-50 via-white to-zinc-50 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className={`group flex flex-col items-center gap-2 rounded-xl p-3 text-center transition-all duration-300 hover:bg-white hover:shadow-md dark:hover:bg-zinc-800 sm:flex-row sm:text-left ${
                badge.highlight
                  ? "bg-amber-50/50 dark:bg-amber-950/20"
                  : ""
              }`}
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${
                  badge.highlight
                    ? "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                <badge.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p
                  className={`text-xs font-semibold sm:text-sm ${
                    badge.highlight
                      ? "text-amber-700 dark:text-amber-400"
                      : "text-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  {badge.title}
                </p>
                <p className="hidden text-xs text-zinc-500 dark:text-zinc-400 sm:block">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente de Promo Banner - Urgência Sutil
function PromoBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2.5 text-center sm:gap-4 sm:py-3">
        <SparklesIcon className="hidden h-4 w-4 text-amber-400 sm:block" />
        <p className="text-xs font-medium text-white sm:text-sm">
          <span className="font-bold text-amber-400">NOVIDADE:</span>
          <span className="mx-2">Coleção Primavera 2025 já disponível</span>
          <span className="hidden sm:inline">•</span>
          <span className="ml-2 hidden rounded-full bg-white/10 px-2 py-0.5 text-xs backdrop-blur-sm sm:inline">
            Até 40% OFF em peças selecionadas
          </span>
        </p>
        <SparklesIcon className="hidden h-4 w-4 text-amber-400 sm:block" />
      </div>
    </div>
  );
}

// Componente de Social Proof - Gatilho de Prova Social
function SocialProof() {
  const stats = [
    { value: "50K+", label: "Clientes satisfeitos" },
    { value: "4.9", label: "Avaliação média", isRating: true },
    { value: "15+", label: "Anos de experiência" },
    { value: "98%", label: "Recomendam" },
  ];

  return (
    <div className="bg-white py-8 dark:bg-zinc-950 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Por que nos escolher
          </h2>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            Confiança comprovada por milhares de clientes
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-10 sm:gap-6 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 transition-all duration-300 group-hover:from-amber-500/5 group-hover:to-orange-500/5" />
              <div className="relative">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                    {stat.value}
                  </span>
                  {stat.isRating && (
                    <StarIcon className="h-6 w-6 text-amber-400 sm:h-7 sm:w-7" filled />
                  )}
                </div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente de Page Header Aprimorado
function PageHeader({
  categorySlug,
  productCount,
}: {
  categorySlug: string;
  productCount: number;
}) {
  const getCategoryDisplayName = (slug: string) => {
    const names: Record<string, string> = {
      sofas: "Sofás",
      cadeiras: "Cadeiras",
      mesas: "Mesas",
      armarios: "Armários",
      camas: "Camas",
      estantes: "Estantes",
    };
    return names[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
  };

  return (
    <div className="relative overflow-hidden border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      {/* Decorative Background */}
      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-amber-50/50 to-transparent dark:from-amber-950/10 dark:to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 sm:pb-8 sm:pt-10 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {/* Breadcrumb sutil */}
            <nav className="mb-3 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <a href="/" className="transition-colors hover:text-amber-600 dark:hover:text-amber-400">
                Home
              </a>
              <span>/</span>
              <span className="text-zinc-900 dark:text-zinc-100">
                {categorySlug ? getCategoryDisplayName(categorySlug) : "Todos os Produtos"}
              </span>
            </nav>

            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl lg:text-4xl">
              {categorySlug ? getCategoryDisplayName(categorySlug) : "Nossa Coleção"}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
              Móveis de alta qualidade, design exclusivo e acabamento impecável
              para transformar sua casa em um lar aconchegante.
            </p>
          </div>

          {/* Product Count Badge */}
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-zinc-100 px-4 py-2 dark:bg-zinc-800">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {productCount}
                </span>{" "}
                {productCount === 1 ? "produto" : "produtos"} encontrados
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente Newsletter - Captura de Leads
function NewsletterSection() {
  return (
    <div className="border-t border-zinc-200 bg-gradient-to-br from-zinc-900 to-zinc-950 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-10 shadow-2xl sm:px-12 sm:py-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Receba ofertas exclusivas
            </h2>
            <p className="mt-3 text-amber-100">
              Cadastre-se e ganhe{" "}
              <span className="font-bold text-white">10% de desconto</span> na
              sua primeira compra, além de novidades em primeira mão.
            </p>

            <form className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 rounded-xl border-0 bg-white/20 px-5 py-3.5 text-white placeholder-amber-100 backdrop-blur-sm transition-all focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="group relative overflow-hidden rounded-xl bg-white px-8 py-3.5 font-semibold text-amber-600 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <span className="relative z-10">Quero meu desconto</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-amber-100 to-orange-100 transition-transform duration-300 group-hover:translate-x-0" />
              </button>
            </form>

            <p className="mt-4 text-xs text-amber-100/80">
              🔒 Seus dados estão seguros. Não enviamos spam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;

  const searchQuery = params.q ?? "";
  const categorySlug = params.category ?? "";
  const color = params.color ?? "";
  const material = params.material ?? "";
  const minPrice = Number(params.minPrice) || 0;
  const maxPrice = Number(params.maxPrice) || 0;
  const sort = params.sort ?? "name";
  const inStock = params.inStock === "true";

  // Select query based on sort parameter
  const getQuery = () => {
    if (searchQuery && sort === "relevância") {
      return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
    }

    switch (sort) {
      case "preço_asc":
        return FILTER_PRODUCTS_BY_PRICE_ASC_QUERY;
      case "preço_desc":
        return FILTER_PRODUCTS_BY_PRICE_DESC_QUERY;
      case "relevância":
        return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
      default:
        return FILTER_PRODUCTS_BY_NAME_QUERY;
    }
  };

  // Fetch products with filters (server-side via GROQ)
  const { data: products } = await sanityFetch({
    query: getQuery(),
    params: {
      searchQuery,
      categorySlug,
      color,
      material,
      minPrice,
      maxPrice,
      inStock,
    },
  });

  // Fetch categories for filter sidebar
  const { data: categories } = await sanityFetch({
    query: ALL_CATEGORIES_QUERY,
  });

  // Fetch featured products for carousel
  const { data: featuredProducts } = await sanityFetch({
    query: FEATURED_PRODUCTS_QUERY,
  });

  // Verificar se está na home (sem filtros aplicados)
  const isHomePage = !categorySlug && !searchQuery;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Promo Banner - Topo */}
      <PromoBanner />

      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && isHomePage && (
        <Suspense fallback={<FeaturedCarouselSkeleton />}>
          <FeaturedCarousel products={featuredProducts} />
        </Suspense>
      )}

      {/* Trust Badges - Gatilhos de Confiança */}
      <TrustBadges />

      {/* Page Header Aprimorado */}
      <PageHeader categorySlug={categorySlug} productCount={products.length} />

      {/* Category Tiles */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <CategoryTiles
          categories={categories}
          activeCategory={categorySlug || undefined}
        />
      </div>

      {/* Products Section */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <ProductSection
          categories={categories}
          products={products}
          searchQuery={searchQuery}
        />
      </div>

      {/* Social Proof - Apenas na Home */}
      {isHomePage && <SocialProof />}

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}