export function resolveUploadUrl(value: string | undefined | null): string {
  if (!value) return "";
  // Already absolute (http/https) or a data/blob URL — nothing to resolve.
  if (/^(https?:)?\/\//.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }

  const match = value.match(/^\/uploads\/(.+)$/);
  if (!match) return value;

  return `/api/uploads/${match[1]}`;
}
