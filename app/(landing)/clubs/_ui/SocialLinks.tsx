import type { ComponentType } from "react";
import { Globe } from "lucide-react";
import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import type { ClubSocialLink } from "@/types/clubs";

type Icon = ComponentType<{ className?: string }>;

interface Platform {
  label: string;
  match: RegExp;
  Icon: Icon;
}

/** Always shown, in this order — linked once the club adds a URL for it. */
const CORE: Platform[] = [
  { label: "Facebook", match: /facebook|fb\.com/i, Icon: FaFacebookF },
  { label: "Instagram", match: /instagram/i, Icon: FaInstagram },
  { label: "LinkedIn", match: /linkedin/i, Icon: FaLinkedinIn },
  { label: "YouTube", match: /youtube|youtu\.be/i, Icon: FaYoutube },
  { label: "X", match: /twitter|x\.com|^x$/i, Icon: FaXTwitter },
];

/** Shown only when the club actually links them. */
const EXTRA: Platform[] = [{ label: "GitHub", match: /github/i, Icon: FaGithub }];

const matches = (p: Platform, link: ClubSocialLink) => p.match.test(link.title) || p.match.test(link.url);

export interface Item {
  key: string;
  label: string;
  Icon: Icon;
  url: string | null;
}

export function toItems(links: ClubSocialLink[]): Item[] {
  const used = new Set<ClubSocialLink>();
  const core = CORE.map((p) => {
    const link = links.find((l) => !used.has(l) && matches(p, l));
    if (link) used.add(link);
    return { key: p.label, label: p.label, Icon: p.Icon, url: link?.url ?? null };
  });
  const extra = links
    .filter((l) => !used.has(l))
    .map((l) => {
      const p = EXTRA.find((e) => matches(e, l));
      return { key: `${l.title}-${l.url}`, label: p?.label ?? l.title, Icon: p?.Icon ?? Globe, url: l.url };
    });
  return [...core, ...extra];
}

const TONES = {
  /** On the navy hero. */
  dark: {
    base: "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground backdrop-blur",
    live: "hover:-translate-y-0.5 hover:border-transparent hover:bg-primary-foreground hover:text-primary",
    idle: "opacity-45",
  },
  /** On a card. */
  light: {
    base: "border-border bg-muted/60 text-foreground",
    live: "hover:-translate-y-0.5 hover:border-transparent hover:bg-primary hover:text-primary-foreground",
    idle: "opacity-40",
  },
} as const;

/**
 * Social icons for a club. Platforms without a link yet still show (dimmed,
 * "coming soon") so the row is ready the moment admins add URLs.
 */
export default function SocialLinks({
  links,
  tone = "dark",
  className,
}: {
  links: ClubSocialLink[];
  tone?: keyof typeof TONES;
  className?: string;
}) {
  const t = TONES[tone];
  const box = "flex size-10 items-center justify-center rounded-full border transition-all duration-300";
  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label="Social media">
      {toItems(links).map(({ key, label, Icon, url }) => (
        <li key={key}>
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className={cn(box, t.base, t.live)}
            >
              <Icon className="size-4" />
            </a>
          ) : (
            <span
              role="img"
              aria-label={`${label} — coming soon`}
              title={`${label} — coming soon`}
              className={cn(box, t.base, t.idle, "cursor-not-allowed")}
            >
              <Icon className="size-4" />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
