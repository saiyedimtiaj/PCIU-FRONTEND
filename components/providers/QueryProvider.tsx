"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Mounted by the admin and faculty-portal layouts only — the public site
 * is static and must stay that way, so the query client never reaches
 * those routes.
 */
export default function QueryProvider({ children }: { children: ReactNode }) {
  // useState keeps one client per browser session; creating it at module
  // scope would share cache across requests during SSR.
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            // The dashboard is a CMS: refetching on every window focus
            // fights with half-filled forms more than it helps.
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
