import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function ledgerConfigError() {
  if (!url) {
    return "Add the Supabase project URL before customers can be saved.";
  }

  if (!publishableKey) {
    return "Add the Supabase publishable key before customers can be saved. Copy it from the project's Connect dialog. It used to be called the anon key.";
  }

  return "";
}

/**
 * Data API client. The publishable key only identifies the app.
 * Clerk's session token identifies the trader, and row level security uses that token.
 */
export function createLedgerClient(getToken: () => Promise<string | null>): SupabaseClient {
  if (!url || !publishableKey) {
    throw new Error(ledgerConfigError());
  }

  return createClient(url, publishableKey, {
    accessToken: async () => (await getToken()) ?? null,
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
