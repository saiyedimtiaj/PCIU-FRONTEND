
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


export const READ_NESTED: Record<string, Record<string, string>> = {
  teacher: {
    email: "user.email",
    faculty_id: "department.facultyId",
  },
  user: {
    full_name: "name",
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
