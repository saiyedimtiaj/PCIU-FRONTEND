import { serverFetch } from "@/lib/server-fetch";

export interface ApiEnvelope<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

type Method = "get" | "post" | "patch" | "put" | "delete";

export async function request<T>(
  method: Method,
  path: string,
  body?: unknown,
  init?: RequestInit,
): Promise<T> {
  const options: RequestInit = { cache: "no-store", ...init };

  if (body !== undefined) {
    options.body =
      body instanceof FormData ? body : JSON.stringify(body);
  }

  let res: Response;
  try {
    res = await serverFetch[method](path, options);
  } catch (error) {
    throw new ApiError(
      error instanceof Error ? error.message : "Network request failed",
      0,
    );
  }

  const raw = await res.text();
  if (!raw) {
    if (!res.ok) throw new ApiError(res.statusText || "Request failed", res.status);
    return null as T;
  }

  let parsed: ApiEnvelope<T> | undefined;
  try {
    parsed = JSON.parse(raw) as ApiEnvelope<T>;
  } catch {
    throw new ApiError("Server returned a malformed response", res.status, raw);
  }

  if (!res.ok || parsed?.success === false) {
    throw new ApiError(
      parsed?.message || res.statusText || "Request failed",
      res.status,
      parsed,
    );
  }

  return (parsed?.data ?? (parsed as unknown)) as T;
}

export const api = {
  get: <T>(path: string, init?: RequestInit) =>
    request<T>("get", path, undefined, init),
  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>("post", path, body, init),
  patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>("patch", path, body, init),
  put: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>("put", path, body, init),
  delete: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>("delete", path, body, init),
};
