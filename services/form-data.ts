
type Dict = Record<string, unknown>;

function appendValue(fd: FormData, key: string, value: unknown) {
  if (value === undefined || value === null) return;

  if (value instanceof File) {
    if (value.size > 0) fd.append(key, value);
    return;
  }

  if (typeof value === "boolean") {
    fd.append(key, value ? "true" : "false");
    return;
  }

  if (Array.isArray(value)) {
    if (value.some((item) => item instanceof File)) {
      for (const item of value) {
        if (item instanceof File && item.size > 0) fd.append(key, item);
      }
      return;
    }
    fd.append(key, JSON.stringify(value));
    return;
  }

  if (typeof value === "object") {
    fd.append(key, JSON.stringify(value));
    return;
  }

  fd.append(key, String(value));
}

export function buildFormData(values: Dict): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(values)) {
    appendValue(fd, key, value);
  }
  return fd;
}

export function buildJsonBody(values: Dict): Dict {
  const out: Dict = {};
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) continue;
    if (value === "") continue;
    if (value instanceof File) continue; // no file transport in JSON mode
    out[key] = value;
  }
  return out;
}
