export const entityKeys = {
  all: ["entity"] as const,
  resource: (slug: string) => [...entityKeys.all, slug] as const,
  list: (slug: string, params?: Record<string, unknown>) =>
    [...entityKeys.resource(slug), "list", params ?? {}] as const,
  detail: (slug: string, id: string) =>
    [...entityKeys.resource(slug), "detail", id] as const,
};
