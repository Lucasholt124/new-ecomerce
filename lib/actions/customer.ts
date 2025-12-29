"use server";

import { client, writeClient } from "@/sanity/lib/client";
import { CUSTOMER_BY_EMAIL_QUERY } from "@/lib/sanity/queries/customers";

/**
 * Busca ou cria um cliente no Asaas e sincroniza com o Sanity
 */
export async function getOrCreateAsaasCustomer(
  email: string,
  name: string,
  clerkUserId: string,
  cpfCnpj?: string
): Promise<{ asaasCustomerId: string; sanityCustomerId: string }> {
  // 1. Configuração (Dentro da função para não quebrar build)
  const apiKey = process.env.ASAAS_API_KEY;
  const apiUrl = process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3";

  if (!apiKey) {
    throw new Error("ASAAS_API_KEY não está definida no arquivo .env.local");
  }

  // Limpa o CPF para enviar apenas números (boa prática)
  const cleanCpf = cpfCnpj ? cpfCnpj.replace(/\D/g, "") : undefined;

  // 2. Verificar se já existe no Sanity (Cache local)
  const existingCustomer = await client.fetch(CUSTOMER_BY_EMAIL_QUERY, {
    email,
  });

  if (existingCustomer?.asaasCustomerId) {
    return {
      asaasCustomerId: existingCustomer.asaasCustomerId,
      sanityCustomerId: existingCustomer._id,
    };
  }

  // 3. Buscar no Asaas (Estratégia: CPF primeiro, depois Email)
  let asaasCustomerId: string | null = null;

  try {
    // A) Tenta buscar pelo CPF se disponível (É o identificador mais forte)
    if (cleanCpf) {
      const searchCpfResponse = await fetch(`${apiUrl}/customers?cpfCnpj=${cleanCpf}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          access_token: apiKey,
        },
      });
      const searchCpfData = await searchCpfResponse.json();
      if (searchCpfData.data && searchCpfData.data.length > 0) {
        asaasCustomerId = searchCpfData.data[0].id;
      }
    }

    // B) Se não achou por CPF, tenta buscar por Email
    if (!asaasCustomerId) {
      const searchEmailResponse = await fetch(`${apiUrl}/customers?email=${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          access_token: apiKey,
        },
      });
      const searchEmailData = await searchEmailResponse.json();
      if (searchEmailData.data && searchEmailData.data.length > 0) {
        asaasCustomerId = searchEmailData.data[0].id;
      }
    }

    // 4. Se não existe, CRIAR novo cliente no Asaas
    if (!asaasCustomerId) {
      const newCustomerPayload = {
        name,
        email,
        cpfCnpj: cleanCpf, // Envia o CPF limpo
        externalReference: clerkUserId,
        notificationDisabled: false,
      };

      const createResponse = await fetch(`${apiUrl}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: apiKey,
        },
        body: JSON.stringify(newCustomerPayload),
      });

      const createdData = await createResponse.json();

      if (!createResponse.ok) {
        // Log detalhado para debug
        console.error("Payload enviado:", newCustomerPayload);
        console.error("Erro Asaas:", createdData);

        throw new Error(
          createdData.errors?.[0]?.description || "Falha ao criar cliente no Asaas"
        );
      }

      asaasCustomerId = createdData.id;
    }
  } catch (error) {
    console.error("Erro na integração de Cliente Asaas:", error);
    throw error;
  }

  if (!asaasCustomerId) {
    throw new Error("Falha crítica: ID do cliente Asaas não foi gerado.");
  }

  // 5. Criar ou Atualizar no Sanity
  // Isso garante que da próxima vez não precisaremos ir no Asaas buscar
  if (existingCustomer) {
    await writeClient
      .patch(existingCustomer._id)
      .set({ asaasCustomerId, clerkUserId, name })
      .commit();

    return {
      asaasCustomerId,
      sanityCustomerId: existingCustomer._id,
    };
  }

  const newSanityCustomer = await writeClient.create({
    _type: "customer",
    email,
    name,
    clerkUserId,
    asaasCustomerId,
    createdAt: new Date().toISOString(),
  });

  return {
    asaasCustomerId,
    sanityCustomerId: newSanityCustomer._id,
  };
}