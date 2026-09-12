import { api } from "./http";
import { toApi, fromApi } from "./case";
import { buildFormData, buildJsonBody } from "./form-data";
import {
  collectionPath,
  deletePath,
  getEndpoint,
  itemPath,
} from "./endpoints";
import { applyWriteAliases, applyReadNested } from "./field-aliases";

type Dict = Record<string, unknown>;

export type EntityRecord = Dict & { id?: number | string; __id: string };

/**
 * The teacher form models study leave as two `date` inputs, but the API
 * stores `leavePeriod` as a single string. These join/split it on the way
 * out/in. The separator is an en dash with spaces ("2026-01-01 – 2026-06-30")
 * — matching the placeholder the field used to carry when it was free text,
 * so values written by the old text input still round-trip.
 *
 * Either end may be blank: an open-ended leave saves as "2026-01-01 –".
 */
const LEAVE_PERIOD_SEPARATOR = " – ";

function joinLeavePeriod(payload: Dict): void {
  const start = payload.leavePeriodStart;
  const end = payload.leavePeriodEnd;

  // Only act when the form actually supplied the pair, so an unrelated
  // caller can't have `leavePeriod` clobbered with an empty string.
  if (start === undefined && end === undefined) return;

  delete payload.leavePeriodStart;
  delete payload.leavePeriodEnd;

  const from = typeof start === "string" ? start.trim() : "";
  const to = typeof end === "string" ? end.trim() : "";

  payload.leavePeriod =
    from || to ? `${from}${LEAVE_PERIOD_SEPARATOR}${to}`.trim() : "";
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Keeps only a value a native `<input type="date">` can actually show. */
function asInputDate(value: string): string {
  const trimmed = value.trim();
  if (ISO_DATE.test(trimmed)) return trimmed;
  // Tolerate a full ISO datetime by keeping just the date half.
  const datePart = trimmed.split("T")[0];
  return ISO_DATE.test(datePart) ? datePart : "";
}

function splitLeavePeriod(mapped: Dict): void {
  const raw = mapped.leave_period ?? mapped.leavePeriod;
  if (typeof raw !== "string") return;

  // Accept an en dash, em dash or hyphen between the two dates. A lone
  // hyphen can't be the separator though — it also occurs inside every
  // ISO date — so require surrounding whitespace for that case.
  const [from = "", to = ""] = raw.split(/\s*[–—]\s*|\s+-\s+/, 2);

  // The two inputs are `type="date"`, which renders blank on anything that
  // isn't YYYY-MM-DD. Older rows hold free text ("Jan 2026 – Dec 2026")
  // from when this was a single text field, so anything unparseable is
  // dropped rather than handed to the input as a value it will silently
  // discard — leaving the field genuinely empty and re-settable.
  mapped.leave_period_start = asInputDate(from);
  mapped.leave_period_end = asInputDate(to);
}

function encode(slug: string, values: Dict, omit: string[] = []): FormData | Dict {
  const cfg = getEndpoint(slug);
  const source = omit.length
    ? Object.fromEntries(Object.entries(values).filter(([k]) => !omit.includes(k)))
    : values;
  const payload = applyWriteAliases(slug, toApi<Dict>(source));

  // teachingAreas is a json-list in the form but the API stores it as a
  // comma-separated string; JSON.stringify would send `["a","b"]` verbatim.
  if (Array.isArray(payload.teachingAreas)) {
    payload.teachingAreas = payload.teachingAreas.filter(Boolean).join(", ");
  }

  joinLeavePeriod(payload);

  return cfg?.multipart ? buildFormData(payload) : buildJsonBody(payload);
}

function normalizeListValue(value: unknown): unknown {
  // A `json-list` field is always an array in the form (useFieldArray),
  // but the API may send `null` or omit it — coerce those to `[]` so the
  // field renders empty instead of throwing on a non-iterable default.
  if (value === null || value === undefined) return [];
  if (!Array.isArray(value)) return value;

  return value.map((item) => {
    if (item === null || typeof item !== "object") return item;
    const obj = item as Dict;
    const preferred = obj.title ?? obj.label ?? obj.name ?? obj.url ?? obj.value;
    return typeof preferred === "string" ? preferred : JSON.stringify(item);
  });
}

/**
 * The API stores a `time` field as a full ISO datetime anchored to the
 * epoch date ("1970-01-01T09:00:00.000Z"). A native `<input type="time">`
 * requires plain "HH:MM" and silently shows blank on anything else, so the
 * value is trimmed to that here — pure string slicing, no `new Date()`.
 */
function toInputTime(value: unknown): unknown {
  if (typeof value !== "string" || !value.includes("T")) return value;
  const timePart = value.split("T")[1];
  const match = timePart?.match(/^(\d{2}:\d{2})/);
  return match ? match[1] : value;
}

function decode(
  slug: string,
  record: Dict,
  fieldNames: string[],
  listFields: string[] = [],
  relationFields: string[] = [],
  timeFields: string[] = [],
): EntityRecord {
  let mapped = fromApi(record, fieldNames);
  mapped = applyReadNested(slug, mapped, record);

  for (const name of listFields) {
    if (name in mapped) mapped[name] = normalizeListValue(mapped[name]);
  }

  // Relation ids come back as numbers; the combobox matches a selection
  // against option.value (always a string), so a numeric id would compare
  // unequal to every option and show the raw id instead of resolving.
  for (const name of relationFields) {
    const value = mapped[name];
    if (typeof value === "number") mapped[name] = String(value);
  }

  for (const name of timeFields) {
    if (name in mapped) mapped[name] = toInputTime(mapped[name]);
  }

  if (slug === "teacher") splitLeavePeriod(mapped);

  return {
    ...mapped,
    __id: String(mapped.id ?? mapped.__id ?? ""),
  } as EntityRecord;
}

export async function listEntities(
  slug: string,
  fieldNames: string[],
  params?: Record<string, string | number | undefined>,
  listFields: string[] = [],
  relationFields: string[] = [],
  timeFields: string[] = [],
): Promise<EntityRecord[]> {
  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(params ?? {})) {
    if (v !== undefined && v !== "") query.set(k, String(v));
  }
  const qs = query.toString();
  const path = `${collectionPath(slug)}${qs ? `?${qs}` : ""}`;

  const data = await api.get<unknown>(path);
  const cfg = getEndpoint(slug);

  let rows: unknown;
  if (Array.isArray(data)) {
    rows = data;
  } else if (data && typeof data === "object") {
    if (cfg?.grouped) {
      rows = Object.entries(data as Record<string, unknown>).flatMap(
        ([group, items]) =>
          (Array.isArray(items) ? items : []).map((item) => ({
            ...(item as Dict),
            programLevel: (item as Dict).programLevel ?? group,
          })),
      );
    } else {
      const obj = data as Dict;
      // The API is inconsistent about the list wrapper key: some admin
      // endpoints nest the array under `data.articles` / `data.teachers` /
      // `data.departments`, others use `data` or `items`, and the public
      // `home/*` routes return a bare array. Try the known keys first,
      // then fall back to the object's sole array-valued property, and
      // only treat the object itself as a single row if nothing matches.
      const known = obj.data ?? obj.items;
      if (Array.isArray(known)) {
        rows = known;
      } else {
        const arrayValues = Object.values(obj).filter(Array.isArray);
        rows = arrayValues.length === 1 ? arrayValues[0] : [data];
      }
    }
  } else {
    rows = [];
  }

  return (Array.isArray(rows) ? rows : [rows])
    .filter((r): r is Dict => !!r && typeof r === "object")
    .map((r) => decode(slug, r, fieldNames, listFields, relationFields, timeFields));
}

export async function getEntity(
  slug: string,
  id: string | number,
  fieldNames: string[],
  listFields: string[] = [],
  relationFields: string[] = [],
  timeFields: string[] = [],
): Promise<EntityRecord | null> {
  const cfg = getEndpoint(slug);
  const path = cfg?.singleton ? collectionPath(slug) : itemPath(slug, id);

  const data = await api.get<Dict | Dict[] | null>(path);
  if (!data) return null;

  const record = Array.isArray(data)
    ? data.find((r) => String((r as Dict).id) === String(id))
    : data;

  return record
    ? decode(slug, record as Dict, fieldNames, listFields, relationFields, timeFields)
    : null;
}

export async function createEntity(
  slug: string,
  values: Dict,
  fieldNames: string[],
): Promise<EntityRecord> {
  const body = encode(slug, values);
  const created = await api.post<Dict>(collectionPath(slug), body);
  return decode(slug, created ?? {}, fieldNames);
}

export async function updateEntity(
  slug: string,
  id: string | number,
  values: Dict,
  fieldNames: string[],
  immutableFields: string[] = [],
): Promise<EntityRecord> {
  const cfg = getEndpoint(slug);
  const body = encode(slug, values, immutableFields);
  const path = cfg?.singleton ? collectionPath(slug) : itemPath(slug, id);
  const method = cfg?.updateMethod === "put" ? api.put : api.patch;

  const updated = await method<Dict>(path, body);
  return decode(slug, updated ?? {}, fieldNames);
}

export async function deleteEntity(
  slug: string,
  id: string | number,
): Promise<void> {
  await api.delete<null>(deletePath(slug, id));
}
