import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client for inserts / admin reads.
 * Uses ONLY:
 *   - process.env.NEXT_PUBLIC_SUPABASE_URL
 *   - process.env.SUPABASE_SERVICE_ROLE_KEY
 * Never reads NEXT_PUBLIC_SUPABASE_ANON_KEY. Do not import in client components.
 */
function peekJwtRole(
  key: string,
): "service_role" | "anon" | "authenticated" | "not_jwt" | "unknown" {
  if (!key.startsWith("eyJ")) return "not_jwt";
  try {
    const parts = key.split(".");
    if (parts.length < 2) return "unknown";
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const json = Buffer.from(padded, "base64").toString("utf8");
    const payload = JSON.parse(json) as { role?: string };
    if (payload.role === "service_role") return "service_role";
    if (payload.role === "anon") return "anon";
    if (payload.role === "authenticated") return "authenticated";
    return "unknown";
  } catch {
    return "unknown";
  }
}

/** Safe diagnostics for /api/play (no secrets). */
export function getApiPlaySupabaseDebug(client: SupabaseClient | null) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  return {
    hasSupabaseUrl: Boolean(url),
    hasServiceRoleKey: Boolean(key),
    usingServiceRoleClient: client !== null,
    serviceKeyLooksLikeJwt: Boolean(key?.startsWith("eyJ")),
    /** If this is `anon` or `authenticated`, you pasted the wrong key in Vercel. */
    serviceKeyJwtRole: key ? peekJwtRole(key) : ("not_jwt" as const),
    createClientUsesAnonKeyEnvVar: false as const,
  };
}

/** Next.js caches fetch() in RSC by default; Supabase REST uses fetch — always bypass cache. */
function serverFetch(input: RequestInfo | URL, init?: RequestInit) {
  return fetch(input, {
    ...init,
    cache: "no-store",
  });
}

export function createServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: serverFetch },
  });
}
