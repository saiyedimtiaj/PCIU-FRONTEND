import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FacebookIcon,
  YoutubeIcon,
  LinkedinIcon,
  InstagramIcon,
} from "@/components/shared/social-icons";
import { getHomeMenus } from "@/lib/api/menus";
import type { MenuItem } from "@/types/menu";

interface FooterLink {
  name: string;
  href: string;
}

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { label: "YouTube", href: "https://youtube.com", icon: YoutubeIcon },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon },
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
];

// Shown only when /home/menus is unreachable, so the footer never renders
// with empty columns during a backend outage.
const FALLBACK_ACADEMICS: FooterLink[] = [
  { name: "Faculties", href: "/faculty" },
  { name: "Departments", href: "/department" },
  { name: "Programs", href: "/academics" },
  { name: "Research", href: "/research" },
];

const FALLBACK_ADMISSIONS: FooterLink[] = [
  { name: "Apply Now", href: "/admission" },
  { name: "Library", href: "/library" },
  { name: "Registrar Office", href: "/management" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms of Service", href: "#terms" },
  { label: "Accessibility", href: "#accessibility" },
];

const focusRing =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60";

const contactLinkClass = `${focusRing} text-sm text-primary-foreground/70 transition-colors hover:text-highlight focus-visible:text-highlight sm:text-base`;

const isExternal = (href: string) => /^(https?:)?\/\//i.test(href);

/** API slugs are usually "/notices", but tolerate a missing leading slash. */
const toHref = (slug: string) =>
  isExternal(slug) || slug.startsWith("/") || slug.startsWith("#")
    ? slug
    : `/${slug}`;

const toFooterLinks = (items: MenuItem[]): FooterLink[] =>
  items.map((item) => ({ name: item.name, href: toHref(item.slug) }));

function FooterNavLink({ name, href }: FooterLink) {
  const className = `${focusRing} group inline-flex items-center gap-2.5 py-0.5 text-sm text-primary-foreground/75 transition-all duration-200 hover:translate-x-1 hover:text-highlight focus-visible:translate-x-1 focus-visible:text-highlight sm:text-base`;

  const content = (
    <>
      <span
        aria-hidden
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5 text-highlight ring-1 ring-white/10 transition-colors duration-200 group-hover:bg-highlight group-hover:text-[rgb(8,32,63)] group-hover:ring-highlight group-focus-visible:bg-highlight group-focus-visible:text-[rgb(8,32,63)]"
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </span>
      <span className="relative">
        {name}
        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-highlight transition-all duration-300 group-hover:w-full group-focus-visible:w-full" />
      </span>
    </>
  );

  return isExternal(href) ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {content}
    </a>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

/** Untitled by design — the label is for screen readers only. */
function FooterLinkColumn({
  label,
  links,
}: {
  label: string;
  links: FooterLink[];
}) {
  if (links.length === 0) return null;

  return (
    <nav aria-label={label} className="group/col font-bold">
      {/* Decorative accent; mt-3 centres it on the "Contact Us" heading's line */}
      <div aria-hidden className="mt-3 mb-4 flex items-center gap-1.5">
        <span className="h-1 w-10 rounded-full bg-linear-to-r from-highlight to-highlight-hover shadow-[0_0_10px_rgba(245,183,29,0.45)] transition-all duration-500 group-hover/col:w-16" />
        <span className="h-1 w-3 rounded-full bg-highlight/50 transition-all duration-500 group-hover/col:w-2" />
        <span className="h-1 w-1.5 rounded-full bg-highlight/25" />
      </div>
      <ul className="space-y-3.5">
        {links.map((link) => (
          <li key={link.href + link.name}>
            <FooterNavLink {...link} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default async function Footer() {
  const menus = await getHomeMenus();

  const academicsLinks = menus
    ? toFooterLinks(menus.footer_academics)
    : FALLBACK_ACADEMICS;
  const admissionLinks = menus
    ? toFooterLinks(menus.footer_admission)
    : FALLBACK_ADMISSIONS;

  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[rgb(8,32,63)] pt-14 pb-8 text-primary-foreground sm:pt-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="container relative mx-auto px-4 sm:px-6 md:px-5">
        <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:gap-10">
          {/* About */}
          <div>
            <Link
              href="/"
              className={`${focusRing} mb-6 inline-flex items-center gap-3`}
            >
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                <Image
                  src="/images/pciu-logo.png"
                  alt="PCIU Logo"
                  fill
                  sizes="48px"
                  className="object-contain p-1.5"
                />
              </span>
              <span>
                <span className="block font-heading text-lg font-bold leading-tight">
                  Port City International
                </span>
                <span className="block text-xs text-primary-foreground/70">
                  University
                </span>
              </span>
            </Link>
            <address className="mb-6 text-sm not-italic leading-relaxed text-primary-foreground/70 sm:text-base">
              7-14 Nikunja Housing Society
              <br />
              Khulshi, Chattogram
            </address>
            <ul className="flex items-center gap-3" aria-label="Social media">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-highlight hover:text-[rgb(8,32,63)] hover:ring-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <Icon className="h-4.5 w-4.5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <FooterLinkColumn label="Academics" links={academicsLinks} />
          <FooterLinkColumn label="Admissions" links={admissionLinks} />

          {/* Contact */}
          <div>
            <h3 className="mb-5 font-heading text-lg font-bold sm:mb-6">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin
                  aria-hidden
                  className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                />
                <span className="text-sm text-primary-foreground/70 sm:text-base">
                  Chattogram, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone aria-hidden className="h-5 w-5 shrink-0 text-accent" />
                <a href="tel:+8801851120791" className={contactLinkClass}>
                  +880-18511-20791
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail aria-hidden className="h-5 w-5 shrink-0 text-accent" />
                <a
                  href="mailto:admission@portcity.edu.bd"
                  className={`${contactLinkClass} break-all`}
                >
                  admission@portcity.edu.bd
                </a>
              </li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-primary-foreground/50 sm:text-sm">
              Office Hours: Sunday–Thursday
              <br />
              9:00 AM – 5:00 PM
            </p>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-[rgb(13,42,79)] px-5 py-6 sm:px-8 sm:py-7">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 text-center lg:flex-row lg:justify-between lg:gap-10 lg:text-left">
            <div className="lg:max-w-md">
              <h3 className="font-heading text-xl font-bold">Stay Connected</h3>
              <p className="mt-2 text-sm text-primary-foreground/70 sm:text-base">
                Subscribe to our newsletter for the latest updates and
                announcements
              </p>
            </div>

            <div className="flex w-full max-w-md flex-col items-center gap-3 lg:w-auto lg:shrink-0 lg:items-end">
              <div className="flex w-full flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  placeholder="Your email address"
                  aria-label="Email address"
                  className="h-11 flex-1 border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-accent sm:min-w-60"
                />
                <Button
                  variant="highlight"
                  size="cta"
                  className="px-8 text-[rgb(8,32,63)]"
                >
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-primary-foreground/50">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-primary-foreground/50 sm:pt-8 sm:text-sm md:flex-row">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} Port City International University. All
            rights reserved.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {LEGAL_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className={`${focusRing} transition-colors hover:text-accent focus-visible:text-accent`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
