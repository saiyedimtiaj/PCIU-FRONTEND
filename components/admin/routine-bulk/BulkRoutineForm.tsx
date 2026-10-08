"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
  type Resolver,
  type UseFormSetValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToastManager } from "@/components/ui/toast";
import { useEntityList } from "@/features/entity";
import { entityKeys } from "@/features/entity/keys";
import type { EntityRecord } from "@/services/entity";
import {
  bulkCreateClassRoutinesAction,
  bulkCreateExamRoutinesAction,
} from "@/app/(admin)/routine-bulk-actions";
import {
  DAYS,
  SHIFTS,
  EMPTY_CLASS_ROW,
  EMPTY_EXAM_ROW,
  classBulkSchema,
  examBulkSchema,
  type BulkRowDraft,
  type RoutineKind,
} from "@/lib/admin/routine-bulk";

interface BulkFormValues {
  semester_id: string;
  exam_id: string;
  rows: BulkRowDraft[];
}

interface Option {
  label: string;
  value: string;
}

const KIND_CONFIG = {
  class: {
    slug: "class-routine",
    title: "Class Routine",
    listHref: "/admin/scheduling/class-routine",
    timeSlotType: "CLASS",
    emptyRow: EMPTY_CLASS_ROW,
    schema: classBulkSchema,
    action: bulkCreateClassRoutinesAction,
  },
  exam: {
    slug: "exam-routine",
    title: "Exam Routine",
    listHref: "/admin/scheduling/exam-routine",
    timeSlotType: "EXAM",
    emptyRow: EMPTY_EXAM_ROW,
    schema: examBulkSchema,
    action: bulkCreateExamRoutinesAction,
  },
} as const;

/** Changing a parent field clears the fields whose options depend on it. */
const DEPENDENTS: Record<string, string[]> = {
  department_id: ["course_id", "teacher_id", "batch_id", "section_id"],
  building_id: ["room_id"],
  batch_id: ["section_id"],
};

function str(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function isActive(row: EntityRecord): boolean {
  return row.status !== false;
}

function idOf(row: EntityRecord): string {
  return str(row.id ?? row.__id);
}

function titleCase(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

/** Active rows of one entity, optionally narrowed to a parent id, as select options. */
function useOptions(
  slug: string,
  label: (row: EntityRecord) => string,
  filter?: (row: EntityRecord) => boolean,
) {
  const { data, isLoading } = useEntityList(slug);
  const all = useMemo(() => (data ?? []).filter(isActive), [data]);
  const toOptions = (rows: EntityRecord[]): Option[] =>
    rows
      .filter((r) => !filter || filter(r))
      .map((r) => ({ label: label(r), value: idOf(r) }));
  return { all, isLoading, toOptions };
}

function useLookups(timeSlotType: string) {
  const name = (r: EntityRecord) => str(r.name) || `#${idOf(r)}`;
  const departments = useOptions("department", (r) => str(r.short_name) || name(r));
  const courses = useOptions("course", (r) => [str(r.code), str(r.name)].filter(Boolean).join(" – "));
  const teachers = useOptions("teacher", name);
  const buildings = useOptions("building", name);
  const rooms = useOptions("room", name);
  const batches = useOptions("batch", name);
  const sections = useOptions("section", name);
  const timeSlots = useOptions(
    "time-slot",
    (r) => `${str(r.start_time)} – ${str(r.end_time)}`,
    (r) => !r.type || str(r.type) === timeSlotType,
  );
  const semesters = useOptions("semester", (r) => str(r.title) || `#${idOf(r)}`);
  const exams = useOptions("exam", name);

  return { departments, courses, teachers, buildings, rooms, batches, sections, timeSlots, semesters, exams };
}

type Lookups = ReturnType<typeof useLookups>;

/** A row's parent id — the flat `department_id` column, else a nested `department: { id }`. */
function parentIdOf(row: EntityRecord, key: string): string {
  const flat = str(row[key]);
  if (flat) return flat;
  const nested = row[key.replace(/_id$/, "")];
  return nested && typeof nested === "object" ? str((nested as { id?: unknown }).id) : "";
}

function byParent(rows: EntityRecord[], key: string, parentId: string | undefined): EntityRecord[] {
  if (!parentId) return [];
  return rows.filter((r) => parentIdOf(r, key) === parentId);
}

function BulkSelect({
  control,
  name,
  label,
  options,
  placeholder,
  disabled,
  loading,
  error,
  onPicked,
}: {
  control: Control<BulkFormValues>;
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  onPicked?: (value: string) => void;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <Label className="text-xs font-medium text-foreground">{label}</Label>
      <Controller
        control={control}
        name={name as Path<BulkFormValues>}
        render={({ field }) => (
          <Select
            items={options}
            value={typeof field.value === "string" && field.value ? field.value : null}
            disabled={disabled}
            onValueChange={(value) => {
              field.onChange(value ?? "");
              onPicked?.(value ?? "");
            }}
          >
            <SelectTrigger className="h-9 w-full px-3" aria-invalid={!!error}>
              <SelectValue
                placeholder={loading ? "Loading…" : placeholder ?? `Select ${label.toLowerCase()}`}
                className="truncate"
              />
            </SelectTrigger>
            <SelectContent>
              {options.length === 0 ? (
                <SelectItem value="" disabled>
                  {disabled ? `Select ${placeholder ?? "parent"} first` : "No options available"}
                </SelectItem>
              ) : (
                options.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function RoutineRow({
  kind,
  index,
  control,
  setValue,
  errors,
  lookups,
  canRemove,
  onDuplicate,
  onRemove,
}: {
  kind: RoutineKind;
  index: number;
  control: Control<BulkFormValues>;
  setValue: UseFormSetValue<BulkFormValues>;
  errors?: Record<string, { message?: string } | undefined>;
  lookups: Lookups;
  canRemove: boolean;
  onDuplicate: () => void;
  onRemove: () => void;
}) {
  const row = useWatch({ control, name: `rows.${index}` }) ?? {};
  const prefix = `rows.${index}`;
  const err = (field: string) => errors?.[field]?.message;

  const clearDependents = (field: string) => {
    for (const dep of DEPENDENTS[field] ?? []) {
      if (dep in row) setValue(`rows.${index}.${dep}`, "", { shouldValidate: false });
    }
  };

  const { departments, courses, teachers, buildings, rooms, batches, sections, timeSlots } = lookups;
  const deptId = row.department_id;

  const select = (
    field: string,
    label: string,
    options: Option[],
    extra?: { disabled?: boolean; placeholder?: string; loading?: boolean },
  ) => (
    <BulkSelect
      control={control}
      name={`${prefix}.${field}`}
      label={label}
      options={options}
      error={err(field)}
      onPicked={() => clearDependents(field)}
      {...extra}
    />
  );

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">Row {index + 1}</span>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={onDuplicate} title="Duplicate row">
            <Copy className="size-3.5" />
            <span className="hidden sm:inline">Duplicate</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={onRemove}
            disabled={!canRemove}
            title="Delete row"
          >
            <Trash2 className="size-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {select("department_id", "Department", departments.toOptions(departments.all), {
          loading: departments.isLoading,
        })}
        {select(
          "course_id",
          "Course",
          courses.toOptions(byParent(courses.all, "department_id", deptId)),
          { disabled: !deptId, placeholder: "department", loading: courses.isLoading },
        )}
        {kind === "class" &&
          select(
            "teacher_id",
            "Teacher",
            teachers.toOptions(byParent(teachers.all, "department_id", deptId)),
            { disabled: !deptId, placeholder: "department", loading: teachers.isLoading },
          )}
        {select(
          "batch_id",
          "Batch",
          batches.toOptions(byParent(batches.all, "department_id", deptId)),
          { disabled: !deptId, placeholder: "department", loading: batches.isLoading },
        )}
        {select(
          "section_id",
          "Section",
          sections.toOptions(byParent(sections.all, "batch_id", row.batch_id)),
          { disabled: !row.batch_id, placeholder: "batch", loading: sections.isLoading },
        )}
        {select("building_id", "Building", buildings.toOptions(buildings.all), {
          loading: buildings.isLoading,
        })}
        {select(
          "room_id",
          "Room",
          rooms.toOptions(byParent(rooms.all, "building_id", row.building_id)),
          { disabled: !row.building_id, placeholder: "building", loading: rooms.isLoading },
        )}
        {select("time_slot_id", "Time Slot", timeSlots.toOptions(timeSlots.all), {
          loading: timeSlots.isLoading,
        })}
        {kind === "class" ? (
          select("day", "Day", DAYS.map((d) => ({ label: titleCase(d), value: d })))
        ) : (
          <div className="min-w-0 space-y-1.5">
            <Label htmlFor={`${prefix}.date`} className="text-xs font-medium text-foreground">
              Date
            </Label>
            <Controller
              control={control}
              name={`rows.${index}.date`}
              render={({ field }) => (
                <Input
                  id={`${prefix}.date`}
                  type="date"
                  className="h-9"
                  aria-invalid={!!err("date")}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
            {err("date") && <p className="text-xs text-destructive">{err("date")}</p>}
          </div>
        )}
        {select("shift", "Shift", SHIFTS.map((s) => ({ label: titleCase(s), value: s })))}
        <div className="min-w-0 space-y-1.5">
          <Label htmlFor={`${prefix}.student_range`} className="text-xs font-medium text-foreground">
            Student Range
          </Label>
          <Controller
            control={control}
            name={`rows.${index}.student_range`}
            render={({ field }) => (
              <Input
                id={`${prefix}.student_range`}
                className="h-9"
                placeholder={kind === "exam" ? "Roll 01 - 40" : "1-40"}
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default function BulkRoutineForm({ kind }: { kind: RoutineKind }) {
  const config = KIND_CONFIG[kind];
  const router = useRouter();
  const toast = useToastManager();
  const queryClient = useQueryClient();
  const lookups = useLookups(config.timeSlotType);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<BulkFormValues>({
    resolver: zodResolver(
      config.schema as unknown as z.ZodType<FieldValues, FieldValues>,
    ) as unknown as Resolver<BulkFormValues>,
    defaultValues: { semester_id: "", exam_id: "", rows: [{ ...config.emptyRow }] },
  });

  const { fields, append, insert, remove } = useFieldArray({ control, name: "rows" });
  const semesterId = useWatch({ control, name: "semester_id" });

  const examOptions = lookups.exams.toOptions(
    byParent(lookups.exams.all, "semester_id", semesterId),
  );

  const save = useMutation({
    mutationFn: async (values: BulkFormValues) => {
      const result = await config.action(values);
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: entityKeys.resource(config.slug) }),
  });

  const onSubmit = async (values: BulkFormValues) => {
    try {
      const { count } = await save.mutateAsync(values);
      toast.add({
        type: "success",
        title: `${config.title}s created`,
        description: `${count} routine ${count === 1 ? "row was" : "rows were"} saved.`,
      });
      router.push(config.listHref);
    } catch (error) {
      toast.add({
        type: "error",
        title: `Could not save the ${config.title.toLowerCase()}s`,
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  const rowErrors = errors.rows as
    | (FieldErrors<BulkRowDraft> | undefined)[]
    | { message?: string; root?: { message?: string } }
    | undefined;
  const rowsMessage =
    rowErrors && !Array.isArray(rowErrors) ? rowErrors.message ?? rowErrors.root?.message : undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Applies to every row</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <BulkSelect
            control={control}
            name="semester_id"
            label="Semester"
            options={lookups.semesters.toOptions(lookups.semesters.all)}
            loading={lookups.semesters.isLoading}
            error={errors.semester_id?.message}
            onPicked={() => kind === "exam" && setValue("exam_id", "")}
          />
          {kind === "exam" && (
            <BulkSelect
              control={control}
              name="exam_id"
              label="Exam"
              options={examOptions}
              disabled={!semesterId}
              placeholder="semester"
              loading={lookups.exams.isLoading}
              error={errors.exam_id?.message}
            />
          )}
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <RoutineRow
            key={field.id}
            kind={kind}
            index={index}
            control={control}
            setValue={setValue}
            errors={
              Array.isArray(rowErrors)
                ? (rowErrors[index] as Record<string, { message?: string } | undefined> | undefined)
                : undefined
            }
            lookups={lookups}
            canRemove={fields.length > 1}
            onDuplicate={() => insert(index + 1, { ...getValues(`rows.${index}`) })}
            onRemove={() => remove(index)}
          />
        ))}
        {rowsMessage && <p className="text-sm text-destructive">{rowsMessage}</p>}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outlineSecondary"
          size="admin"
          onClick={() => append({ ...config.emptyRow })}
        >
          <Plus className="size-4" />
          Add Row
        </Button>
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Button
            variant="outline"
            size="admin"
            render={<Link href={config.listHref} />}
            nativeButton={false}
          >
            Cancel
          </Button>
          <Button type="submit" variant="highlight" size="admin" disabled={save.isPending}>
            {save.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save {fields.length} {fields.length === 1 ? "Routine" : "Routines"}
          </Button>
        </div>
      </div>
    </form>
  );
}
