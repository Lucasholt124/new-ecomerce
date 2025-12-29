import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

// Cliente de LEITURA (Padrão)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

// Cliente de ESCRITA (Novo - Adicione isso)
// Necessário para salvar Clientes e Pedidos no Sanity
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Escrita nunca usa CDN
  token: process.env.SANITY_API_TOKEN, // Você precisa criar esse token no painel do Sanity
});