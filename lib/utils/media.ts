export function getMediaUrl(path?: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  const base = process.env.NEXT_PUBLIC_BACKEND_BASE_ASSET_URL;
  if (!base) return null;

  // Trim slashes on both sides so "host/" + "/uploads/x" or "host" +
  // "uploads/x" both resolve to exactly one separator.
  const origin = base.replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "");
  return `${origin}/${path.replace(/^\/+/, "")}`;
}