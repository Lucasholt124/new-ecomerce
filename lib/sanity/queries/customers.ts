import { defineQuery } from "next-sanity";

export const CUSTOMER_BY_EMAIL_QUERY = defineQuery(`*[
  _type == "customer"
  && email == $email
][0]{
  _id,
  email,
  name,
  clerkUserId,
  asaasCustomerId, // Atualizado de stripeCustomerId
  createdAt
}`);

// Renomeado de CUSTOMER_BY_STRIPE_ID_QUERY para CUSTOMER_BY_ASAAS_ID_QUERY
export const CUSTOMER_BY_ASAAS_ID_QUERY = defineQuery(`*[
  _type == "customer"
  && asaasCustomerId == $asaasCustomerId
][0]{
  _id,
  email,
  name,
  clerkUserId,
  asaasCustomerId, // Atualizado de stripeCustomerId
  createdAt
}`);