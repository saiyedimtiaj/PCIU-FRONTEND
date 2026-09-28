"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  RemoveFormatting,
  Undo2,
  Redo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A lightweight rich-text editor: a styled `contentEditable` surface with a
 * formatting toolbar, emitting an HTML string. No editor dependency — it
 * drives the still-universally-supported `document.execCommand` for the
 * handful of inline/block commands the CMS needs (bold/italic/underline/
 * strike, H2/H3, lists, blockquote, links, clear formatting, undo/redo).
 *
 * `value` is HTML. It's written into the DOM only when it differs from
 * what the surface already holds, so the caret isn't reset on every
 * keystroke while the parent form re-renders.
 */

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  id?: string;
  ariaInvalid?: boolean;
  disabled?: boolean;
  className?: string;
}

type Command =
  | { kind: "exec"; command: string; value?: string; icon: ReactNode; label: string }
  | { kind: "block"; block: string; icon: ReactNode; label: string }
  | { kind: "link"; icon: ReactNode; label: string }
  | { kind: "separator" };

const COMMANDS: Command[] = [
  { kind: "exec", command: "bold", icon: <Bold className="size-4" />, label: "Bold" },
  { kind: "exec", command: "italic", icon: <Italic className="size-4" />, label: "Italic" },
  { kind: "exec", command: "underline", icon: <UnderlineIcon className="size-4" />, label: "Underline" },
  { kind: "exec", command: "strikeThrough", icon: <Strikethrough className="size-4" />, label: "Strikethrough" },
  { kind: "separator" },
  { kind: "block", block: "h2", icon: <Heading2 className="size-4" />, label: "Heading" },
  { kind: "block", block: "h3", icon: <Heading3 className="size-4" />, label: "Subheading" },
  { kind: "block", block: "blockquote", icon: <Quote className="size-4" />, label: "Quote" },
  { kind: "separator" },
  { kind: "exec", command: "insertUnorderedList", icon: <List className="size-4" />, label: "Bulleted list" },
  { kind: "exec", command: "insertOrderedList", icon: <ListOrdered className="size-4" />, label: "Numbered list" },
  { kind: "separator" },
  { kind: "link", icon: <LinkIcon className="size-4" />, label: "Insert link" },
  { kind: "exec", command: "removeFormat", icon: <RemoveFormatting className="size-4" />, label: "Clear formatting" },
  { kind: "separator" },
  { kind: "exec", command: "undo", icon: <Undo2 className="size-4" />, label: "Undo" },
  { kind: "exec", command: "redo", icon: <Redo2 className="size-4" />, label: "Redo" },
];

function isEmptyHtml(html: string): boolean {
  return (
    html
      .replace(/<br\s*\/?>/gi, "")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/gi, "")
      .trim().length === 0
  );
}

export function RichTextEditor({
  value,
  onChange,
  onBlur,
  placeholder,
  id,
  ariaInvalid,
  disabled,
  className,
}: RichTextEditorProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const fallbackId = useId();
  const editorId = id ?? fallbackId;
  const [focused, setFocused] = useState(false);
  const [showEmpty, setShowEmpty] = useState(isEmptyHtml(value ?? ""));

  // Sync incoming value → DOM, but never while it's already equal, so
  // typing doesn't fight the controlled prop and drop the caret.
  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;
    const next = value ?? "";
    if (el.innerHTML !== next) {
      el.innerHTML = next;
      setShowEmpty(isEmptyHtml(next));
    }
  }, [value]);

  const emit = useCallback(() => {
    const el = surfaceRef.current;
    if (!el) return;
    const html = isEmptyHtml(el.innerHTML) ? "" : el.innerHTML;
    setShowEmpty(html.length === 0);
    onChange(html);
  }, [onChange]);

  const run = useCallback(
    (command: Command) => {
      if (disabled || command.kind === "separator") return;
      const el = surfaceRef.current;
      if (!el) return;
      el.focus();

      if (command.kind === "exec") {
        document.execCommand(command.command, false, command.value);
      } else if (command.kind === "block") {
        // execCommand's formatBlock wants the tag wrapped in <…> on Chrome.
        document.execCommand("formatBlock", false, `<${command.block}>`);
      } else if (command.kind === "link") {
        const url = window.prompt("Link URL");
        if (url) document.execCommand("createLink", false, url);
      }
      emit();
    },
    [disabled, emit],
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-input bg-card transition-colors",
        focused && "ring-2 ring-ring",
        ariaInvalid && "border-destructive",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <div
        role="toolbar"
        aria-label="Text formatting"
        aria-controls={editorId}
        className="flex flex-wrap items-center gap-0.5 border-b border-input bg-muted/40 px-2 py-1.5"
      >
        {COMMANDS.map((command, i) =>
          command.kind === "separator" ? (
            <span key={`sep-${i}`} aria-hidden className="mx-1 h-5 w-px bg-border" />
          ) : (
            <button
              key={command.label}
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onMouseDown={(e) => {
                // Keep the selection in the editor — a real focus shift
                // would collapse it before execCommand runs.
                e.preventDefault();
              }}
              onClick={() => run(command)}
              title={command.label}
              aria-label={command.label}
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:pointer-events-none"
            >
              {command.icon}
            </button>
          ),
        )}
      </div>

      <div className="relative">
        {showEmpty && placeholder && (
          <p className="pointer-events-none absolute left-4 top-3 text-sm text-muted-foreground">
            {placeholder}
          </p>
        )}
        <div
          id={editorId}
          ref={surfaceRef}
          role="textbox"
          aria-multiline="true"
          aria-invalid={ariaInvalid || undefined}
          contentEditable={!disabled}
          suppressContentEditableWarning
          onInput={emit}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            emit();
            onBlur?.();
          }}
          className={cn(
            "prose-editor min-h-40 w-full px-4 py-3 text-sm text-foreground outline-none",
            "[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold",
            "[&_h3]:mb-1.5 [&_h3]:mt-3 [&_h3]:text-base [&_h3]:font-semibold",
            "[&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6",
            "[&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
            "[&_a]:text-primary [&_a]:underline",
            "[&_strong]:font-semibold",
          )}
        />
      </div>
    </div>
  );
}
