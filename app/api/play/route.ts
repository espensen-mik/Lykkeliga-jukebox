import { NextResponse } from "next/server";
import { TRACK_IDS } from "@/lib/tracks";
import {
  createServiceSupabase,
  getApiPlaySupabaseDebug,
} from "@/lib/supabase/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function withDebug<T extends Record<string, unknown>>(
  admin: ReturnType<typeof createServiceSupabase>,
  body: T,
): T & ReturnType<typeof getApiPlaySupabaseDebug> {
  const debug = getApiPlaySupabaseDebug(admin);
  console.log("[api/play] debug", debug);
  return { ...body, ...debug };
}

/**
 * GET = diagnostik (ingen hemmeligheder). Åbn i browser:
 * https://dit-domæne.dk/api/play
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const hasUrl = Boolean(url);
  const hasKey = Boolean(key);

  const admin = createServiceSupabase();

  if (!hasUrl || !hasKey) {
    return NextResponse.json(
      withDebug(admin, {
        ok: false,
        step: "env",
        hasUrl,
        hasKey,
        hint: "Sæt NEXT_PUBLIC_SUPABASE_URL og SUPABASE_SERVICE_ROLE_KEY i Vercel → Environment Variables og redeploy.",
      }),
      { status: 200 },
    );
  }

  if (!admin) {
    return NextResponse.json(
      withDebug(null, {
        ok: false,
        step: "client",
        hint: "createServiceSupabase returnerede null",
      }),
      { status: 200 },
    );
  }

  const rolePeek = getApiPlaySupabaseDebug(admin).serviceKeyJwtRole;
  if (rolePeek === "anon" || rolePeek === "authenticated") {
    return NextResponse.json(
      withDebug(admin, {
        ok: false,
        step: "wrong_key_in_service_role_env",
        hint:
          rolePeek === "anon"
            ? "Vercel variablen SUPABASE_SERVICE_ROLE_KEY indeholder anon (public) nøglen — ikke service_role. Supabase Dashboard → Project Settings → Data API → kopier 'service_role' secret (JWT der starter med eyJ…), erstat værdien i Vercel, og redeploy. Anon-nøglen må kun ligge i NEXT_PUBLIC_SUPABASE_ANON_KEY hvis du bruger den i browser."
            : "SUPABASE_SERVICE_ROLE_KEY ser ud til at være en authenticated-bruger JWT, ikke service_role. Brug service_role secret fra Supabase API-indstillinger.",
      }),
      { status: 200 },
    );
  }

  if (rolePeek === "not_jwt") {
    return NextResponse.json(
      withDebug(admin, {
        ok: false,
        step: "service_key_not_legacy_jwt",
        hint:
          "Nøglen i SUPABASE_SERVICE_ROLE_KEY er ikke et klassisk JWT (eyJ…). supabase-js forventer stadig service_role JWT fra Dashboard → Data API / API (Legacy). Kopier den lange eyJ… service_role værdi til Vercel, eller opgrader klient/konfiguration til nye API-nøgler når det understøttes.",
      }),
      { status: 200 },
    );
  }

  const { error: readError, count } = await admin
    .from("track_plays")
    .select("*", { count: "exact", head: true });

  if (readError) {
    return NextResponse.json(
      withDebug(admin, {
        ok: false,
        step: "read_track_plays",
        supabaseError: readError.message,
        code: readError.code,
        hint:
          "Tjek at tabellen hedder track_plays i schema public, og at service_role har adgang. Kør evt. supabase/migrations/002_track_plays_grants.sql i SQL Editor.",
      }),
      { status: 200 },
    );
  }

  let cleanupId: string | undefined;
  try {
    const inserted = await admin
      .from("track_plays")
      .insert({ track_id: "hop-hop-hop" })
      .select("id")
      .single();

    if (inserted.error) {
      return NextResponse.json(
        withDebug(admin, {
          ok: false,
          step: "insert_test",
          supabaseError: inserted.error.message,
          code: inserted.error.code,
          details: inserted.error.details,
          rowCount: count ?? 0,
          hint:
            "Hvis serviceKeyJwtRole ikke er service_role, sæt den rigtige service_role JWT i Vercel (eyJ…). Ellers kør supabase/migrations/002_track_plays_grants.sql.",
        }),
        { status: 200 },
      );
    }

    cleanupId = inserted.data?.id;

    return NextResponse.json(
      withDebug(admin, {
        ok: true,
        step: "full",
        rowCount: count ?? 0,
        insertDeleteTest: "passed",
        message:
          "Supabase er OK fra Vercel. Spil musik og tjek Network → POST /api/play (status 200).",
      }),
    );
  } finally {
    if (cleanupId) {
      await admin.from("track_plays").delete().eq("id", cleanupId);
    }
  }
}

export async function POST(req: Request) {
  const admin = createServiceSupabase();
  const debug = getApiPlaySupabaseDebug(admin);
  console.log("[api/play] POST debug", debug);

  if (!admin) {
    return NextResponse.json(
      { ok: false, reason: "not_configured", ...debug },
      { status: 503 },
    );
  }

  let body: { track_id?: string; trackId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON", ...debug },
      { status: 400 },
    );
  }

  const trackId =
    typeof body.track_id === "string" ? body.track_id : body.trackId;
  if (!trackId || typeof trackId !== "string" || !TRACK_IDS.has(trackId)) {
    return NextResponse.json({ error: "Unknown track", ...debug }, { status: 400 });
  }

  const { error } = await admin.from("track_plays").insert({ track_id: trackId });
  if (error) {
    console.error("[api/play]", error);
    return NextResponse.json(
      { error: error.message, ...debug },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, ...debug });
}
