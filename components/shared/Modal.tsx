"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-4xl",
};

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  children: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  /** When false, Escape no longer closes the modal — only an explicit close
   * action does. Pair with closeOnOverlayClick={false} for form takeovers
   * where an accidental dismissal would lose the user's input. */
  closeOnEscape?: boolean;
  loading?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  loading = false,
  className,
}) => {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen, eventDetails) => {
        if (nextOpen) return;
        if (loading) {
          eventDetails.cancel();
          return;
        }
        if (eventDetails.reason === "outside-press" && !closeOnOverlayClick) {
          eventDetails.cancel();
          return;
        }
        if (eventDetails.reason === "escape-key" && !closeOnEscape) {
          eventDetails.cancel();
          return;
        }
        onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Viewport className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <Dialog.Popup
            className={cn(
              "relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-xl border border-border bg-background p-6 shadow-lg transition-all data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 sm:rounded-xl",
              sizeMap[size],
              className
            )}
          >
            <div className="mb-4 flex flex-col space-y-1.5 pr-6 text-center sm:text-left">
              <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="text-sm text-muted-foreground">
                  {description}
                </Dialog.Description>
              )}
            </div>

            <div className="relative min-h-0 flex-1 overflow-y-auto pr-1">
              {loading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              <div className={cn(loading && "pointer-events-none opacity-40 select-none")}>
                {children}
              </div>
            </div>

            {footer && (
              <div className="mt-6 flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
                {footer}
              </div>
            )}

            {showCloseButton && (
              <Dialog.Close
                disabled={loading}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Dialog.Close>
            )}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
