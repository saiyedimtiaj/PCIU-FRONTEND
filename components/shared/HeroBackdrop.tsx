import { Fragment } from "react";
import Link from "next/link";
import { ChevronRight, House } from "lucide-react";

/**
 * The layered navy banner background (glows, sheen, dot texture, grid, orbit
 * rings) shared by the circulars and clubs heroes. Place inside a
 * `relative isolate overflow-hidden bg-primary` section — it sits at `-z-10`.
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {/* Base: deep navy into a brighter royal blue */}
      <div className="absolute inset-0 bg-linear-to-br from-primary via-primary-glow to-secondary/70" />
      {/* Colour glows: blue bloom on the right, warm accent near the title */}
      <div className="absolute -top-32 right-[8%] size-[34rem] rounded-full bg-secondary/40 blur-[120px]" />
      <div className="absolute top-1/3 left-[38%] size-[26rem] rounded-full bg-primary-glow/80 blur-[100px]" />
      <div className="absolute -top-24 -left-24 size-80 rounded-full bg-accent/15 blur-[90px]" />
      <div className="absolute -bottom-40 left-1/4 size-[28rem] rounded-full bg-secondary/25 blur-[110px]" />
      {/* Diagonal light sheen */}
      <div className="absolute inset-y-0 left-[30%] w-[45%] -skew-x-12 bg-linear-to-r from-transparent via-primary-foreground/[0.06] to-transparent" />
      {/* Dot texture, strongest across the middle */}
      <div className="absolute inset-0 bg-[radial-gradient(currentColor_1px,transparent_1px)] bg-size-[22px_22px] opacity-[0.12] mask-[radial-gradient(ellipse_50%_70%_at_55%_45%,black,transparent)]" />
      {/* Fine grid fading in from the right */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[48px_48px] opacity-[0.05] mask-[radial-gradient(ellipse_60%_80%_at_85%_30%,black,transparent)]" />
      {/* Orbit rings */}
      <div className="absolute top-1/2 right-[-12rem] size-[36rem] -translate-y-1/2 rounded-full border border-primary-foreground/10" />
      <div className="absolute top-1/2 right-[-6rem] size-[24rem] -translate-y-1/2 rounded-full border border-primary-foreground/10" />
      <div className="absolute top-1/2 right-[-18rem] size-[48rem] -translate-y-1/2 rounded-full border border-dashed border-primary-foreground/[0.06]" />
      {/* Top highlight line + vignette for depth */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(0_0_0/0.25))]" />
    </div>
  );
}

export interface HeroCrumb {
  label: string;
  href?: string;
}

/** Translucent pill breadcrumb for dark heroes. "Home" is always first. */
export function HeroBreadcrumb({ items }: { items: HeroCrumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-primary-foreground/10 bg-primary-foreground/5 px-3 py-1 text-xs text-primary-foreground/70">
        <li className="shrink-0">
          <Link href="/" className="flex items-center gap-1 transition-colors hover:text-primary-foreground">
            <House aria-hidden className="size-3.5" />
            Home
          </Link>
        </li>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={`${item.label}-${i}`}>
              <li aria-hidden className="shrink-0">
                <ChevronRight className="size-3" />
              </li>
              {item.href && !last ? (
                <li className="shrink-0">
                  <Link href={item.href} className="transition-colors hover:text-primary-foreground">
                    {item.label}
                  </Link>
                </li>
              ) : (
                <li aria-current={last ? "page" : undefined} className="min-w-0 truncate font-medium text-primary-foreground">
                  {item.label}
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
