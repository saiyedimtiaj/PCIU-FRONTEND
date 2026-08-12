"use client";

import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface AlertProps {
  variant: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: { label: string; onClick: () => void };
  icon?: boolean;
  className?: string;
}

const variantMap = {
  info: {
    bg: "bg-info-light border-info text-foreground",
    icon: <Info className="h-5 w-5 text-info shrink-0" />,
  },
  success: {
    bg: "bg-success-light border-success text-foreground",
    icon: <CheckCircle2 className="h-5 w-5 text-success shrink-0" />,
  },
  warning: {
    bg: "bg-warning-light border-warning text-foreground",
    icon: <AlertTriangle className="h-5 w-5 text-warning shrink-0" />,
  },
  error: {
    bg: "bg-destructive/10 border-destructive text-foreground",
    icon: <XCircle className="h-5 w-5 text-destructive shrink-0" />,
  },
};

export const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  message,
  dismissible = false,
  onDismiss,
  action,
  icon = true,
  className,
}) => {
  const currentVariant = variantMap[variant];

  return (
    <div
      className={cn(
        "relative w-full rounded-r-lg border-l-4 p-4 flex gap-3 shadow-sm text-sm items-start transition-all",
        currentVariant.bg,
        className
      )}
    >
      {icon && currentVariant.icon}
      <div className="flex-1 space-y-1">
        {title && <h5 className="font-semibold tracking-tight leading-none">{title}</h5>}
        <p className="text-muted-foreground/90 leading-relaxed">{message}</p>
        {action && (
          <div className="pt-2">
            <button
              type="button"
              onClick={action.onClick}
              className="text-xs font-semibold underline underline-offset-2 opacity-90 hover:opacity-100"
            >
              {action.label}
            </button>
          </div>
        )}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-md p-1 opacity-60 hover:opacity-100 transition-opacity focus:outline-none focus:ring-1 focus:ring-current"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  loading?: boolean;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
}) => {
  return (
    <AlertDialogPrimitive.Root
      open={open}
      onOpenChange={(nextOpen, eventDetails) => {
        if (nextOpen) return;
        if (loading) {
          eventDetails.cancel();
          return;
        }
        onClose();
      }}
    >
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <AlertDialogPrimitive.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <AlertDialogPrimitive.Popup className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg transition-all data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <div className="mb-4 flex flex-col space-y-2 text-center sm:text-left">
              <AlertDialogPrimitive.Title className="text-lg font-semibold">
                {title}
              </AlertDialogPrimitive.Title>
              <AlertDialogPrimitive.Description className="text-sm leading-normal text-muted-foreground">
                {description}
              </AlertDialogPrimitive.Description>
            </div>
            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                {cancelLabel}
              </Button>
              <Button
                variant={variant === "danger" ? "destructive" : "default"}
                loading={loading}
                onClick={async () => {
                  await onConfirm();
                }}
              >
                {confirmLabel}
              </Button>
            </div>
          </AlertDialogPrimitive.Popup>
        </AlertDialogPrimitive.Viewport>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
};
