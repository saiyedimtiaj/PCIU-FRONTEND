import envConfig from "@/config/env.config";
import { getCookies } from "./cookie";

const api_endpoint = envConfig.backend_base_url;

const serverFetchHelper = async (
  endpoint: string,
  options: RequestInit,
): Promise<Response> => {
  const { headers, ...rest } = options;
  const finalHeaders = new Headers(headers);
  const method = rest.method?.toUpperCase();

  const { betterAuthToken, betterAuthCookieName } = await getCookies();

  // Only send a Cookie header when there is an actual session. Building the
  // string unconditionally would always be truthy and ship a malformed
  // empty-valued cookie ("better-auth.session_token=") on every anonymous
  // request, including the login POST itself. The name is whatever the
  // backend used when it issued the cookie (it may carry a `__Secure-`
  // prefix), since that is the name it looks for on the way back.
  if (betterAuthToken) {
    finalHeaders.set("Cookie", `${betterAuthCookieName}=${betterAuthToken}`);
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

const publicFetchHelper = async (
  endpoint: string,
  options: RequestInit,
): Promise<Response> => {
  const { headers, ...rest } = options;
  const finalHeaders = new Headers(headers);
  const method = rest.method?.toUpperCase();

  if (
    method &&
    ["POST", "PUT", "PATCH", "DELETE"].includes(method) &&
    !finalHeaders.has("Content-Type")
  ) {
    finalHeaders.set("Content-Type", "application/json");
  }

  return await fetch(api_endpoint + endpoint, {
    headers: {
      ...Object.fromEntries(finalHeaders.entries()),
    },
    ...rest,
  });
};

export const publicFetch = {
  get: async (endpoint: string, options?: RequestInit): Promise<Response> =>
    await publicFetchHelper(endpoint, {
      ...options,
      method: "GET",
    }),
  post: async (endpoint: string, options?: RequestInit): Promise<Response> =>
    await publicFetchHelper(endpoint, {
      ...options,
      method: "POST",
    }),
  patch: async (endpoint: string, options?: RequestInit): Promise<Response> =>
    await publicFetchHelper(endpoint, {
      ...options,
      method: "PATCH",
    }),
  put: async (endpoint: string, options?: RequestInit): Promise<Response> =>
    await publicFetchHelper(endpoint, {
      ...options,
      method: "PUT",
    }),
  delete: async (endpoint: string, options?: RequestInit): Promise<Response> =>
    await publicFetchHelper(endpoint, {
      ...options,
      method: "DELETE",
    }),
};
