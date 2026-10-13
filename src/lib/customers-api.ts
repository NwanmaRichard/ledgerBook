import type { SupabaseClient } from "@supabase/supabase-js";

import { normalizeCustomerName } from "@/lib/customer";
import type { Customer } from "@/types/customer";

type CustomerRow = {
  id: string;
  name: string;
  phone: string | null;
  created_at: string;
};

const CONNECTION_MESSAGE = "Check your connection and try again. Nothing was saved.";

export function customerSaveMessage(error: { message?: string; code?: string } | null) {
  const message = error?.message ?? "";
  if (/network|fetch|failed to fetch|offline|internet/i.test(message)) {
    return CONNECTION_MESSAGE;
  }

  if (/jwt|unauthorized|permission|row-level|policy/i.test(message)) {
    return "Your sign-in was not accepted by the ledger. Nothing was saved.";
  }

  return "We could not save this customer. Nothing was saved.";
}

function toCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    createdAt: row.created_at,
  };
}

export async function listCustomers(client: SupabaseClient) {
  const { data, error } = await client
    .from("customers")
    .select("id, name, phone, created_at")
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => toCustomer(row as CustomerRow));
}

export async function createCustomer(
  client: SupabaseClient,
  input: { id: string; name: string; phone: string },
) {
  const phone = input.phone.trim();
  const { data, error } = await client
    .from("customers")
    .insert({
      id: input.id,
      name: normalizeCustomerName(input.name),
      phone: phone ? phone : null,
    })
    .select("id, name, phone, created_at")
    .single();

  if (error) {
    throw error;
  }

  return toCustomer(data as CustomerRow);
}
