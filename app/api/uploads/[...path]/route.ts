import envConfig from "@/config/env.config";

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const base = envConfig.backend_base_url;

  if (!base) {
    return new Response("Not configured", { status: 500 });
  }

  const origin = new URL(base).origin;
  const target = `${origin}/uploads/${path.map(encodeURIComponent).join("/")}`;

  let upstream: Response;
  try {
    upstream = await fetch(target, { cache: "no-store" });
  } catch {
    return new Response("Upstream unreachable", { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response("Not found", { status: upstream.status || 404 });
  }

  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);
  headers.set("Cache-Control", "public, max-age=3600");

  return new Response(upstream.body, { status: 200, headers });
}
