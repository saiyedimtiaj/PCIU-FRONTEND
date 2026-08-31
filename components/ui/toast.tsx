"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitive.Provider;
const useToastManager = ToastPrimitive.useToastManager;

const TYPE_ICON: Record<string, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const TYPE_ACCENT: Record<string, string> = {
  success: "border-l-secondary text-secondary",
  error: "border-l-destructive text-destructive",
  warning: "border-l-accent text-accent",
  info: "border-l-primary text-primary",
};

function Toaster() {
  const { toasts } = useToastManager();

  return (
    <ToastPrimitive.Portal>
      <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 outline-none">
        {toasts.map((toast) => {
          const Icon = TYPE_ICON[toast.type ?? "info"] ?? Info;
          const accent = TYPE_ACCENT[toast.type ?? "info"] ?? TYPE_ACCENT.info;
          return (
            <ToastPrimitive.Root
              key={toast.id}
              toast={toast}
              className={cn(
                "relative flex w-full items-start gap-3 rounded-lg border border-border border-l-4 bg-card p-4 shadow-lg transition-all",
                "data-starting-style:translate-x-full data-starting-style:opacity-0",
                "data-ending-style:translate-x-full data-ending-style:opacity-0",
                accent
              )}
            >
              <Icon className="size-5 shrink-0" />
              <div className="min-w-0 flex-1 text-foreground">
                {toast.title && (
                  <ToastPrimitive.Title className="text-sm font-semibold">
                    {toast.title}
                  </ToastPrimitive.Title>
                )}
                {toast.description && (
                  <ToastPrimitive.Description className="text-sm text-muted-foreground">
                    {toast.description}
                  </ToastPrimitive.Description>
                )}
              </div>
              <ToastPrimitive.Close
                className="shrink-0 rounded-sm text-muted-foreground opacity-70 transition-opacity hover:opacity-100"
                aria-label="Dismiss notification"
              >
                <X className="size-4" />
              </ToastPrimitive.Close>
            </ToastPrimitive.Root>
          );
        })}
      </ToastPrimitive.Viewport>
    </ToastPrimitive.Portal>
  );
}

export { ToastProvider, Toaster, useToastManager };
