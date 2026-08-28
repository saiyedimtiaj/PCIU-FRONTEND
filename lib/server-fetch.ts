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

  const { betterAuthToken } = await getCookies();

  const token = `better-auth.session_token=${betterAuthToken || ""}`;

  if (
    method &&
    ["POST", "PUT", "PATCH", "DELETE"].includes(method) &&
    !finalHeaders.has("Content-Type")
  ) {
    finalHeaders.set("Content-Type", "application/json");
  }

  return await fetch(api_endpoint + endpoint, {
    headers: {
      Cookie: token ? token : "",
      ...Object.fromEntries(finalHeaders.entries()),
    },
    credentials: "include",
    ...rest,
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
