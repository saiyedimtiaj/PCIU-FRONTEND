/**
 * Per-entity write-key fixes, taken from the OpenAPI request bodies.
 *
 * `encode()` posts the whole form object, so a key the API doesn't recognise
 * is silently dropped by the server — the form still shows a success toast
 * while the value is lost. Both maps below close that gap:
 *
 *  - WRITE_ALIASES renames a form field to the key the API actually accepts,
 *    for cases that aren't worth renaming in the schema itself (a relation
 *    pointing at a differently-named FK, or a plural/singular mismatch).
 *    Genuine typos in a schema (`degination`, `abount`, `vission`, a stray
 *    `pages` where the API says `page`) are fixed at the source instead —
 *    aliasing only the *write* direction left the *read* direction broken:
 *    `fromApi()` can only map an API key back to a field the form declares
 *    under that exact (converted) name, so an edit page for one of those
 *    typo'd fields loaded with the value silently missing.
 *  - WRITE_DROPS removes keys the API's POST/PATCH body does not accept.
 */
export const WRITE_ALIASES: Record<string, Record<string, string>> = {
  pages: { ogImageUrl: "ogImage" },
  teacher: { imageUrl: "image" },
  gallery: { imageUrl: "imageUrl" },
  "pcj-volumes": { coverImage: "coverImage" },

  faculty: { teacherId: "deanId" },
  management: { types: "type" },
  user: { fullName: "name" },
};

/** Keys the API ignores — dropped so they can't overwrite or bloat a payload. */
export const WRITE_DROPS: Record<string, string[]> = {
  department: ["facultyId", "chairmanId"],
  teacher: ["facultyId", "leavePeriod"],
  pages: ["publishedAt"],
  contact: ["displayOrder", "status"],
  notices: ["icon"],
  iqac: ["description"],
  management: ["iqacOrder"],
  "admission-advertisements": ["isActive"],
  "admission-test-results": ["isActive"],
  "admission-schedules": ["isActive"],
};

/** Applies an entity's renames and drops to an already-camelCased payload. */
export function applyWriteAliases(
  slug: string,
  payload: Record<string, unknown>,
): Record<string, unknown> {
  const aliases = WRITE_ALIASES[slug];
  const drops = WRITE_DROPS[slug];
  if (!aliases && !drops) return payload;

  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (drops?.includes(key)) continue;
    out[aliases?.[key] ?? key] = value;
  }
  return out;
}

/**
 * Some GET responses only carry a value nested inside a joined relation —
 * not as a flat key at all — so `fromApi()` has nothing to map, and the
 * edit form loads with that field silently empty. Verified live against
 * `GET /teachers/admin/{id}`: there is no top-level `email` (it's
 * `user.email`) and no top-level `facultyId` (it's `department.facultyId`;
 * the teacher itself only stores `departmentId`).
 *
 * Keyed by the *form* field name (schema's snake_case), value is a
 * dotted path into the raw API record.
 */
export const READ_NESTED: Record<string, Record<string, string>> = {
  teacher: {
    email: "user.email",
    faculty_id: "department.facultyId",
  },
};

function getPath(record: Record<string, unknown>, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (value, key) =>
        value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined,
      record,
    );
}

/**
 * Backfills fields the flat API record has no key for at all, from a
 * nested relation on the same raw record. Only fills in a field that's
 * still missing after the ordinary key mapping — never overwrites a real
 * top-level value.
 */
export function applyReadNested(
  slug: string,
  mapped: Record<string, unknown>,
  raw: Record<string, unknown>,
): Record<string, unknown> {
  const nested = READ_NESTED[slug];
  if (!nested) return mapped;

  const out = { ...mapped };
  for (const [formField, path] of Object.entries(nested)) {
    if (out[formField] === undefined || out[formField] === null || out[formField] === "") {
      const value = getPath(raw, path);
      if (value !== undefined) out[formField] = value;
    }
  }
  return out;
}
