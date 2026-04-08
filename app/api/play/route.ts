import { NextResponse } from "next/server";
import { TRACK_IDS } from "@/lib/tracks";
import { createServiceSupabase } from "@/lib/supabase/service";

export async function POST(req: Request) {
  const admin = createServiceSupabase();
  if (!admin) {
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });
  }

  let body: { trackId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const trackId = body.trackId;
  if (!trackId || typeof trackId !== "string" || !TRACK_IDS.has(trackId)) {
    return NextResponse.json({ error: "Unknown track" }, { status: 400 });
  }

  const { error } = await admin.from("track_plays").insert({ track_id: trackId });
  if (error) {
    console.error("[api/play]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
