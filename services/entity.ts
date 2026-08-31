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

  return cfg?.multipart ? buildFormData(payload) : buildJsonBody(payload);
}

function normalizeListValue(value: unknown): unknown {
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
      rows = (data as Dict).data ?? (data as Dict).items ?? [data];
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
