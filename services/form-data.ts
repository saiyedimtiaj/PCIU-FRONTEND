
type Dict = Record<string, unknown>;

function appendValue(fd: FormData, key: string, value: unknown) {
  if (value === undefined || value === null) return;

  if (value instanceof File) {
    if (value.size > 0) fd.append(key, value);
    return;
  }

  if (typeof value === "boolean") {
    // Confirmed against the live API: multipart booleans must be the
    // literal strings "true"/"false" — "1"/"0" is silently coerced to
    // false regardless of the value sent, which was quietly flipping
    // every multipart entity's boolean fields (status, isActive, ...) to
    // inactive on create/update.
    fd.append(key, value ? "true" : "false");
    return;
  }

  if (Array.isArray(value) || typeof value === "object") {
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
