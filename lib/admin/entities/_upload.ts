import { z } from "zod";

/**
 * Validator for `image` / `file` fields.
 *
 * These render as a real file picker (see `FormField.tsx`), so a value is
 * one of three things:
 *   - a `File`, when the user picked a new upload;
 *   - a string, when editing a record whose stored value came back from the
 *     API as a server path like `/uploads/departments/….webp`;
 *   - empty, when nothing is set.
 *
 * A plain `z.url()` rejects both a File and a server-relative path, which
 * would make every upload-bearing form unsubmittable.
 */
const isFile = (value: unknown): value is File =>
  typeof File !== "undefined" && value instanceof File;

export const optionalUpload = z
  .custom<File | string>(
    (value) =>
      value === undefined ||
      value === null ||
      value === "" ||
      typeof value === "string" ||
      isFile(value),
    { message: "Upload a file or leave this unchanged" },
  )
  .optional();

export const requiredUpload = z.custom<File | string>(
  (value) => isFile(value) || (typeof value === "string" && value.length > 0),
  { message: "A file is required" },
);

/**
 * Validator for an `image-list` field — several images picked one at a
 * time (see `MultiImageUploadField` in `FormField.tsx`), stored as a mix
 * of new `File`s and existing server paths from a previous save.
 */
export const optionalUploadList = z
  .array(
    z.custom<File | string>(
      (value) => isFile(value) || typeof value === "string",
      { message: "Each item must be a file or an existing image path" },
    ),
  )
  .default([]);
