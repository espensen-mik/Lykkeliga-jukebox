/**
 * Fire-and-forget: logs one play for analytics (Supabase via /api/play).
 * No-ops when env is not configured or fetch fails.
 */
export function recordPlay(trackId: string): void {
  if (typeof window === "undefined") return;
  void fetch("/api/play", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trackId }),
    keepalive: true,
  }).catch(() => {
    /* ignore */
  });
}
