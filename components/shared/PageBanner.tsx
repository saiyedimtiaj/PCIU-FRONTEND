import { cn } from "@/lib/utils";

export interface PageBannerProps {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  variant?: "solid" | "gradient" | "blobs";
}

/**
 * Flat/gradient hero band for content pages that don't have a photo hero
 * (e.g. VCMessage, Notices, Management). For image-based heroes, see
 * about-the-university/_ui/AboutHero.tsx instead.
 */
export default function PageBanner({
  title,
  subtitle,
  align = "center",
  variant = "solid",
}: PageBannerProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden py-16 md:py-20",
        variant === "gradient"
          ? "bg-linear-to-br from-primary via-primary to-primary/90"
          : "bg-primary"
      )}
    >
      {variant === "blobs" && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-highlight rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
      )}

      <div
        className={cn(
          "container relative z-10 mx-auto px-4",
          align === "center" ? "text-center" : "text-left"
        )}
      >
        <div className={cn(align === "left" && "max-w-3xl")}>
          <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-2 md:mb-4">
            {title}
          </h1>
          {subtitle && (
            <p
              className={cn(
                "text-primary-foreground/80 text-lg max-w-2xl",
                align === "center" && "mx-auto"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
