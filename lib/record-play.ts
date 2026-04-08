/**
 * Fire-and-forget: logs one play for analytics (Supabase via /api/play).
 * No-ops when env is not configured or fetch fails.
 */
export function recordPlay(trackId: string): void {
  if (typeof window === "undefined") return;
  const url = `${window.location.origin}/api/play`;
  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trackId }),
    credentials: "same-origin",
  }).catch(() => {
    /* ignore */
  });
}
