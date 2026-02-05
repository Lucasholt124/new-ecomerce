# 🛒 Enterprise E-commerce Solution - Next.js & Sanity

Este é um projeto de E-commerce de alto nível, desenvolvido para oferecer uma experiência de compra rápida, segura e totalmente gerenciável. A aplicação utiliza o que há de mais moderno no ecossistema Web para garantir performance e escalabilidade.

## 🌐 Demonstração Online
Acesse o projeto: [novo-ecomerce-gules.vercel.app](https://novo-ecomerce-gules.vercel.app)

## 🛠️ Stack Tecnológica

- **Framework:** [Next.js](https://nextjs.org/) (App Router & Server Components)
- **Linguagem:** [TypeScript](https://www.typescript.org/) (Tipagem estrita e escalável)
- **CMS Headless:** [Sanity.io](https://www.sanity.io/) (Gestão completa de catálogo e inventário)
- **Database Logic:** Integração com esquemas complexos e tratamento de dados sensíveis (CPF/Checkout).
- **Estilização:** Tailwind CSS (Mobile-First)
- **Gerenciador de Pacotes:** PNPM (Monorepo/Workspace ready)

## 💎 Diferenciais do Projeto

- **Tratamento de Dados Reais:** Implementação de lógica para coleta e validação de documentos (CPF) e opções de co-opção no checkout.
- **Data Migration:** Uso de arquivos `.ndjson` para importação e estruturação de grandes volumes de dados de produtos.
- **Proxy & Security:** Camada de `proxy.ts` para proteção de rotas e integridade das chamadas de API.
- **Type Safety:** Uso de `sanity-typegen` para garantir que os dados vindos do CMS estejam 100% tipados no código.
- **Performance:** Otimização via Server-Side Rendering (SSR) para garantir indexação imediata por motores de busca (SEO).

## 📁 Organização do Repositório

- `/aplicativo`: Páginas, rotas e lógica de servidor.
- `/componentes`: Interface modularizada (Shadcn/UI & Radix).
- `/ganchos`: Hooks personalizados para gerenciamento de estado e chamadas de API.
- `/sanidade`: Configuração de esquemas, tipos e gerenciamento de tokens.
- `/biblioteca`: Lógica de utilitários e validações de negócio.

## 🚀 Como Rodar Localmente

1. Clone o repositório:
   ```bash
   git clone [https://github.com/Lucasholt124/novo-e-comércio.git](https://github.com/Lucasholt124/novo-e-comércio.git)

   Desenvolvido por Lucas Aragão | Especialista em Soluções Full Stack
