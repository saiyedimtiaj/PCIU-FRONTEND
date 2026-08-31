import envConfig from "@/config/env.config";
import { AUTH_COOKIE_NAME, getCookies } from "./cookie";

const api_endpoint = envConfig.backend_base_url;

const serverFetchHelper = async (
  endpoint: string,
  options: RequestInit,
): Promise<Response> => {
  const { headers, ...rest } = options;
  const finalHeaders = new Headers(headers);
  const method = rest.method?.toUpperCase();

  const { betterAuthToken } = await getCookies();

  // Only send a Cookie header when there is an actual session. Building the
  // string unconditionally would always be truthy and ship a malformed
  // empty-valued cookie ("better-auth.session_token=") on every anonymous
  // request, including the login POST itself.
  if (betterAuthToken) {
    finalHeaders.set("Cookie", `${AUTH_COOKIE_NAME}=${betterAuthToken}`);
  }

  // FormData must set its own multipart boundary — forcing a Content-Type
  // here would corrupt the body for file uploads.
  const isFormData = rest.body instanceof FormData;

  if (
    method &&
    ["POST", "PUT", "PATCH", "DELETE"].includes(method) &&
    !isFormData &&
    !finalHeaders.has("Content-Type")
  ) {
    finalHeaders.set("Content-Type", "application/json");
  }

  return await fetch(api_endpoint + endpoint, {
    // `rest` first so the auth headers and credentials below can't be
    // clobbered by a caller-supplied RequestInit.
    ...rest,
    headers: finalHeaders,
    credentials: "include",
  });
};

export const serverFetch = {
  get: async (endpoint: string, options?: RequestInit): Promise<Response> =>
    await serverFetchHelper(endpoint, {
      ...options,
      method: "GET",
    }),
  post: async (endpoint: string, options?: RequestInit): Promise<Response> =>
    await serverFetchHelper(endpoint, {
      ...options,
      method: "POST",
    }),
  patch: async (endpoint: string, options?: RequestInit): Promise<Response> =>
    await serverFetchHelper(endpoint, {
      ...options,
      method: "PATCH",
    }),
  put: async (endpoint: string, options?: RequestInit): Promise<Response> =>
    await serverFetchHelper(endpoint, {
      ...options,
      method: "PUT",
    }),
  delete: async (endpoint: string, options?: RequestInit): Promise<Response> =>
    await serverFetchHelper(endpoint, {
      ...options,
      method: "DELETE",
    }),
};
