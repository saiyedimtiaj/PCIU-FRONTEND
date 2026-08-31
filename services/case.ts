/**
 * Field-name bridge between the admin entity schemas and the API.
 *
 * The 49 schemas in `lib/admin/entities/` are mostly snake_case
 * (`short_name`, `faculty_id`) while the API is camelCase (`shortName`,
 * `facultyId`) — but not uniformly: a handful of schema fields are already
 * exact camelCase (`admissionFeeBDT`, `creditsRequired`). Conversion is
 * therefore only applied to names that actually contain an underscore;
 * anything else is passed through untouched, which keeps acronym-bearing
 * keys like `perCreditFeeBDT` intact (a naive round-trip would mangle
 * those into `per_credit_fee_b_d_t`).
 */

export function toCamel(key: string): string {
  if (!key.includes("_")) return key;
  return key.replace(/_([a-z0-9])/gi, (_, c: string) => c.toUpperCase());
}

export function toSnake(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

type Dict = Record<string, unknown>;

const isPlainObject = (v: unknown): v is Dict =>
  typeof v === "object" &&
  v !== null &&
  !Array.isArray(v) &&
  !(v instanceof File) &&
  !(v instanceof Date);

export function toApi<T = Dict>(input: Dict): T {
  const out: Dict = {};
  for (const [key, value] of Object.entries(input)) {
    out[toCamel(key)] = isPlainObject(value)
      ? toApi(value)
      : Array.isArray(value)
        ? value.map((v) => (isPlainObject(v) ? toApi(v) : v))
        : value;
  }
  return out as T;
}

export function fromApi(record: Dict, fieldNames: string[]): Dict {
  const wanted = new Map<string, string>();
  for (const name of fieldNames) {
    wanted.set(toCamel(name), name);
  }

  const out: Dict = {};
  for (const [key, value] of Object.entries(record)) {
    out[wanted.get(key) ?? key] = value;
  }
  return out;
}
