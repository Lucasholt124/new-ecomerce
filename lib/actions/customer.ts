"use server";

import { client, writeClient } from "@/sanity/lib/client";
import { CUSTOMER_BY_EMAIL_QUERY } from "@/lib/sanity/queries/customers";

/**
 * Gets or creates an Asaas customer by email
 * Also syncs the customer to Sanity database
 */
export async function getOrCreateAsaasCustomer(
  email: string,
  name: string,
  clerkUserId: string,
  cpfCnpj?: string
): Promise<{ asaasCustomerId: string; sanityCustomerId: string }> {
  // 1. Configuração movida para dentro da função (Evita erro de Module Evaluation)
  const apiKey = process.env.ASAAS_API_KEY;
  const apiUrl = process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3";

  if (!apiKey) {
    throw new Error("ASAAS_API_KEY não está definida no arquivo .env.local");
  }

  // 2. Check if customer already exists in Sanity
  const existingCustomer = await client.fetch(CUSTOMER_BY_EMAIL_QUERY, {
    email,
  });

  if (existingCustomer?.asaasCustomerId) {
    return {
      asaasCustomerId: existingCustomer.asaasCustomerId,
      sanityCustomerId: existingCustomer._id,
    };
  }

  // 3. Check if customer exists in Asaas by email
  let asaasCustomerId: string | null = null;

  try {
    const searchResponse = await fetch(`${apiUrl}/customers?email=${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        access_token: apiKey,
      },
    });

    const searchData = await searchResponse.json();

    if (searchData.data && searchData.data.length > 0) {
      asaasCustomerId = searchData.data[0].id;
    } else {
      // 4. Create new Asaas customer
      const newCustomerPayload = {
        name,
        email,
        cpfCnpj: cpfCnpj || undefined,
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
        console.error("Erro ao criar cliente no Asaas:", createdData);
        throw new Error(
          createdData.errors?.[0]?.description || "Falha ao criar cliente no Asaas"
        );
      }

      asaasCustomerId = createdData.id;
    }
  } catch (error) {
    console.error("Asaas Customer Error:", error);
    throw error;
  }

  if (!asaasCustomerId) {
    throw new Error("Falha ao obter ID do cliente Asaas");
  }

  // 5. Create or update customer in Sanity
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