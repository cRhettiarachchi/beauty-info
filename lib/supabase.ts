import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Creates a server-side Supabase admin client using the secret key.
 *
 * Uses the new-style secret key (sb_secret_...) which replaces the legacy
 * service_role JWT. Safe for API routes and Trigger.dev jobs — never expose
 * in the browser.
 *
 * @see https://supabase.com/docs/guides/api/api-keys
 */
export function createSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY must be set");
  }

  return createClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
