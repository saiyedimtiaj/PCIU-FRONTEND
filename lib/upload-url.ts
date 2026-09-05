import envConfig from "@/config/env.config";

/**
 * The API returns uploaded file paths as server-relative strings
 * ("/uploads/departments/foo.webp"), not full URLs — `next.config.ts`'s
 * remotePatterns comment says as much. Rendered bare, a relative path
 * resolves against *this* app's own origin (localhost:3000 in dev) instead
 * of the API host, so the image 404s. This resolves it against the API's
 * origin (its base URL minus any "/api/v1"-style path segment) so both
 * `next/image` and a plain `<img>` can actually load it.
 */
export function resolveUploadUrl(value: string | undefined | null): string {
  if (!value) return "";
  // Already absolute (http/https) or a data/blob URL — nothing to resolve.
  if (/^(https?:)?\/\//.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }

  const base = envConfig.backend_base_url;
  if (!base) return value;

  try {
    return new URL(value, new URL(base).origin).toString();
  } catch {
    return value;
  }
}
