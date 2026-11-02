"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Building2, CalendarCheck2, Check, Clock3, DoorOpen, LoaderCircle } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import RequirePermission from "@/components/admin/RequirePermission";
import { Alert } from "@/components/shared/Aleart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToastManager } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { entityKeys, useCreateEntity } from "@/features/entity";
import { getBookableSlotsAction, type BookableSlot } from "@/app/(admin)/room-booking-actions";
import { roomBookingSchema, type RoomBookingValues } from "@/lib/admin/entities/room-bookings";

const SLUG = "room-bookings";
const LIST_HREF = "/admin/scheduling/room-bookings";

function todayIso(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function StepCard({
  step,
  title,
  subtitle,
  done,
  children,
}: {
  step: number;
  title: string;
  subtitle?: string;
  done?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-start gap-3">
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
            done ? "bg-success text-white" : "bg-primary/10 text-primary",
          )}
        >
          {done ? <Check className="size-4" /> : step}
        </span>
        <div>
          <h2 className="font-heading text-base font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p className="mt-1.5 text-xs font-medium text-destructive" role="alert">
      {message}
    </p>
  ) : null;
}

export default function RoomBookingForm() {
  return (
    <RequirePermission slug={SLUG} action="create" label="room bookings">
      <RoomBookingFormInner />
    </RequirePermission>
  );
}

function RoomBookingFormInner() {
  const router = useRouter();
  const toast = useToastManager();
  const createBooking = useCreateEntity(SLUG);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RoomBookingValues>({
    resolver: zodResolver(roomBookingSchema),
    defaultValues: {
      date: "",
      time_slot_id: "",
      room_id: "",
      purpose: "",
      booked_by: "",
      contact_email: "",
      contact_phone: "",
    },
  });

  const date = useWatch({ control, name: "date" });
  const slotId = useWatch({ control, name: "time_slot_id" });
  const roomId = useWatch({ control, name: "room_id" });

  // Under the bookings' query prefix, so creating or cancelling a booking
  // refreshes what's free.
  const slotsQuery = useQuery({
    queryKey: [...entityKeys.resource(SLUG), "bookable", date],
    enabled: /^\d{4}-\d{2}-\d{2}$/.test(date),
    queryFn: async (): Promise<BookableSlot[]> => {
      const result = await getBookableSlotsAction(date);
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
  });

  const slots = slotsQuery.data ?? [];
  const selectedSlot = slots.find((s) => String(s.id) === slotId);

  // Free rooms of the chosen slot, grouped by building.
  const roomsByBuilding = useMemo(() => {
    const groups = new Map<string, { id: number; name: string }[]>();
    for (const room of selectedSlot?.rooms ?? []) {
      const key = room.buildingName || "Other";
      groups.set(key, [...(groups.get(key) ?? []), { id: room.id, name: room.name }]);
    }
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [selectedSlot]);

  async function onSubmit(values: RoomBookingValues) {
    try {
      await createBooking.mutateAsync(values);
      toast.add({ type: "success", title: "Room booked", description: `${values.purpose} has been booked.` });
      router.push(LIST_HREF);
    } catch (err) {
      toast.add({
        type: "error",
        title: "Could not book this room",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full space-y-6 px-4 pt-6 pb-10">
      <PageHeader
        title="Book a Room"
        description="Pick a date and time slot — only rooms that are free then can be booked."
        icon={DoorOpen}
      />

      <StepCard step={1} title="Pick a date" done={!!date}>
        <div className="max-w-xs">
          <Label htmlFor="date" className="mb-1.5 block text-sm font-medium">
            Date
          </Label>
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <Input
                id="date"
                type="date"
                min={todayIso()}
                value={field.value}
                aria-invalid={!!errors.date}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  setValue("time_slot_id", "");
                  setValue("room_id", "");
                }}
              />
            )}
          />
          <FieldError message={errors.date?.message} />
        </div>
      </StepCard>

      <StepCard
        step={2}
        title="Pick a time slot"
        subtitle="Each slot shows how many rooms are still free."
        done={!!slotId}
      >
        {!date ? (
          <p className="text-sm text-muted-foreground">Choose a date first.</p>
        ) : slotsQuery.isLoading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin" /> Checking free rooms…
          </p>
        ) : slotsQuery.isError ? (
          <Alert
            variant="error"
            message={slotsQuery.error instanceof Error ? slotsQuery.error.message : "Could not load free rooms."}
          />
        ) : slots.length === 0 ? (
          <p className="text-sm text-muted-foreground">No class time slots are set up yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {slots.map((slot) => {
              const free = slot.rooms.length;
              const active = String(slot.id) === slotId;
              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={free === 0}
                  onClick={() => {
                    setValue("time_slot_id", String(slot.id), { shouldValidate: true });
                    setValue("room_id", "");
                  }}
                  className={cn(
                    "flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all",
                    active
                      ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                      : "border-border hover:border-primary/50 hover:bg-muted/40",
                    free === 0 && "cursor-not-allowed opacity-50 hover:border-border hover:bg-transparent",
                  )}
                >
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <Clock3 className="size-3.5 text-primary" />
                    {slot.time}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      free === 0 ? "text-destructive" : "text-success",
                    )}
                  >
                    {free === 0 ? "Fully booked" : `${free} room${free === 1 ? "" : "s"} free`}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        <FieldError message={errors.time_slot_id?.message} />
      </StepCard>

      <StepCard step={3} title="Pick a free room" done={!!roomId}>
        {!selectedSlot ? (
          <p className="text-sm text-muted-foreground">Choose a time slot to see its free rooms.</p>
        ) : (
          <div className="space-y-4">
            {roomsByBuilding.map(([building, rooms]) => (
              <div key={building}>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Building2 className="size-3.5" />
                  Building {building}
                </p>
                <div className="flex flex-wrap gap-2">
                  {rooms.map((room) => {
                    const active = String(room.id) === roomId;
                    return (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => setValue("room_id", String(room.id), { shouldValidate: true })}
                        className={cn(
                          "min-w-16 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                          active
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border text-foreground hover:border-primary/50 hover:bg-muted/40",
                        )}
                      >
                        {room.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        <FieldError message={errors.room_id?.message} />
      </StepCard>

      <StepCard step={4} title="Booking details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="purpose" className="mb-1.5 block text-sm font-medium">
              Purpose <span className="text-destructive">*</span>
            </Label>
            <Input id="purpose" placeholder="Makeup Class / Club Workshop" {...register("purpose")} aria-invalid={!!errors.purpose} />
            <FieldError message={errors.purpose?.message} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="booked_by" className="mb-1.5 block text-sm font-medium">
              Booked By <span className="text-destructive">*</span>
            </Label>
            <Input id="booked_by" placeholder="John Doe" {...register("booked_by")} aria-invalid={!!errors.booked_by} />
            <FieldError message={errors.booked_by?.message} />
          </div>
          <div>
            <Label htmlFor="contact_email" className="mb-1.5 block text-sm font-medium">
              Contact Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contact_email"
              type="email"
              placeholder="john@pciu.edu.bd"
              {...register("contact_email")}
              aria-invalid={!!errors.contact_email}
            />
            <FieldError message={errors.contact_email?.message} />
          </div>
          <div>
            <Label htmlFor="contact_phone" className="mb-1.5 block text-sm font-medium">
              Contact Phone <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contact_phone"
              type="tel"
              placeholder="01700000000"
              {...register("contact_phone")}
              aria-invalid={!!errors.contact_phone}
            />
            <FieldError message={errors.contact_phone?.message} />
          </div>
        </div>
      </StepCard>

      <div className="sticky bottom-0 z-30 -mx-4 flex items-center justify-end gap-3 border-t border-border bg-card/95 px-6 py-3 backdrop-blur">
        <Button type="button" variant="ghost" render={<Link href={LIST_HREF} />} nativeButton={false}>
          <ArrowLeft className="size-4" />
          Cancel
        </Button>
        <Button type="submit" variant="highlight" loading={isSubmitting}>
          <CalendarCheck2 className="size-4" />
          Book Room
        </Button>
      </div>
    </form>
  );
}
