export function getMediaUrl(path?: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  const base = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  if (!base) return null;

  const origin = base.replace(/\/api\/v1\/?$/, "");
  return `${origin}${path}`;
}