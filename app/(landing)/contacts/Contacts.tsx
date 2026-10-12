import {
  Building2,
  Clock3,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import Breadcrumb from "@/components/shared/Breadcrumb";
import type { AdministrationContact } from "@/lib/api/contacts";

function splitContactValues(value: string | null | undefined): string[] {
  return (
    value
      ?.split(/[,;\n]/)
      .map((item) => item.trim())
      .filter(Boolean) ?? []
  );
}

function phoneHref(phone: string): string | null {
  const normalized = phone.replace(/[^\d+]/g, "");

  return /^\+?\d+$/.test(normalized) ? `tel:${normalized}` : null;
}

function getMapUrls(mapUrl: AdministrationContact["mapUrl"]): string[] {
  const urls = Array.isArray(mapUrl) ? mapUrl : mapUrl ? [mapUrl] : [];

  return urls.filter((value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  });
}

function getMapEmbedUrl(
  mapUrl: string | undefined,
  address: string | null | undefined,
): string | null {
  if (!mapUrl) return null;

  try {
    const url = new URL(mapUrl);
    const isGoogleMaps =
      url.hostname === "google.com" ||
      url.hostname.endsWith(".google.com") ||
      url.hostname === "maps.app.goo.gl";

    if (!isGoogleMaps) return null;

    const coordinates = url.href.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);

    const embedUrl = new URL("https://www.google.com/maps");
    if (coordinates) {
      const latitude = Number(coordinates[1]);
      const longitude = Number(coordinates[2]);
      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        return null;
      }

      embedUrl.searchParams.set("q", `${latitude},${longitude}`);
    } else if (address?.trim()) {
      embedUrl.searchParams.set("q", address.trim());
    } else {
      return null;
    }

    embedUrl.searchParams.set("z", "17");
    embedUrl.searchParams.set("output", "embed");
    return embedUrl.toString();
  } catch {
    return null;
  }
}

function ContactDetail({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3.5">
      <span className="group/contact-icon flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground hover:shadow-md focus-within:bg-accent">
        <Icon
          aria-hidden="true"
          className="size-[18px] transition-transform duration-200 group-hover/contact-icon:scale-110"
        />
      </span>
      <div className="min-w-0 pt-0.5">
        <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-secondary">
          {label}
        </dt>
        <dd className="mt-1.5 text-sm leading-6 text-primary sm:text-[15px]">
          {children}
        </dd>
      </div>
    </div>
  );
}

function ContactCard({ contact }: { contact: AdministrationContact }) {
  const phones = splitContactValues(contact.phone);
  const emails = splitContactValues(contact.email);
  const mapUrls = getMapUrls(contact.mapUrl);
  const primaryMapUrl = mapUrls[0];
  const mapEmbedUrl = getMapEmbedUrl(primaryMapUrl, contact.address);

  return (
    <article className="overflow-hidden rounded-[28px] border border-border/70 bg-card shadow-[0_8px_35px_rgba(8,47,103,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(8,47,103,0.12)]">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="p-5 sm:p-7 lg:p-9">
          <div className="mb-8 flex items-start gap-4">
            <div className="group/contact-icon relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground hover:shadow-md">
              <Building2
                aria-hidden="true"
                className="size-6 transition-transform duration-200 group-hover/contact-icon:scale-110"
              />
              <span className="absolute -right-1.5 -top-1.5 size-3 rounded-full border-2 border-card bg-accent" />
            </div>
            <div className="min-w-0">
              <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Administration
              </span>
              <h2 className="mt-2 font-heading text-xl font-bold leading-tight tracking-tight text-primary sm:text-2xl">
                {contact.officeName}
              </h2>
            </div>
          </div>

          <dl className="space-y-6">
            {contact.address?.trim() && (
              <ContactDetail icon={MapPin} label="Office Address">
                <address className="not-italic whitespace-pre-line">
                  {contact.address}
                </address>
              </ContactDetail>
            )}

            {phones.length > 0 && (
              <ContactDetail icon={Phone} label="Phone">
                <ul className="flex flex-wrap gap-2">
                  {phones.map((phone, index) => {
                    const href = phoneHref(phone);

                    return (
                      <li
                        key={`${phone}-${index}`}
                        className="max-w-full rounded-lg border border-primary/10 bg-primary/[0.035] px-2.5 py-1.5"
                      >
                        {href ? (
                          <a
                            href={href}
                            className="break-all font-medium text-primary underline-offset-4 transition-colors hover:text-secondary hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          >
                            {phone}
                          </a>
                        ) : (
                          <span className="break-all font-medium text-primary">
                            {phone}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </ContactDetail>
            )}

            {emails.length > 0 && (
              <ContactDetail icon={Mail} label="Email Address">
                <ul className="space-y-1.5">
                  {emails.map((email, index) => (
                    <li key={`${email}-${index}`}>
                      <a
                        href={`mailto:${encodeURIComponent(email)}`}
                        className="break-all font-medium text-primary underline-offset-4 transition-colors hover:text-accent-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        {email}
                      </a>
                    </li>
                  ))}
                </ul>
              </ContactDetail>
            )}

            {contact.availableHours?.trim() && (
              <ContactDetail icon={Clock3} label="Office Hours">
                <span className="whitespace-pre-line font-medium">
                  {contact.availableHours}
                </span>
              </ContactDetail>
            )}
          </dl>

          {mapUrls.length > 0 && (
            <div className="mt-8 border-t border-border/70 pt-6">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Map locations
              </p>
              <ul className="flex flex-wrap gap-2">
                {mapUrls.map((url, index) => (
                  <li key={`${url}-${index}`}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <MapPin aria-hidden="true" className="size-4" />
                      <span>
                        {mapUrls.length > 1
                          ? `Open map ${index + 1}`
                          : "Open in Google Maps"}
                      </span>
                      <ExternalLink aria-hidden="true" className="size-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="relative isolate min-h-[360px] overflow-hidden bg-muted sm:min-h-[420px] lg:min-h-full">
          {mapEmbedUrl ? (
            <>
              <iframe
                src={mapEmbedUrl}
                title={`Google Map showing ${contact.officeName}`}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950/35 via-slate-950/10 to-transparent"
              />
              <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3 sm:inset-x-5 sm:top-5">
                <div className="inline-flex items-center gap-2.5 rounded-xl border border-white/30 bg-white/90 px-3.5 py-2.5 text-xs font-bold text-primary shadow-lg backdrop-blur-md sm:text-sm">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-accent/25 text-primary">
                    <MapPin aria-hidden="true" className="size-4" />
                  </span>
                  <span>Campus location</span>
                </div>
                {primaryMapUrl && (
                  <a
                    href={primaryMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/30 bg-white/90 px-3 py-2 text-xs font-semibold text-primary shadow-lg backdrop-blur-md transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-3.5 sm:text-sm"
                  >
                    <span className="hidden sm:inline">Open in Maps</span>
                    <span className="sm:hidden">Open map</span>
                    <ExternalLink aria-hidden="true" className="size-3.5" />
                  </a>
                )}
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-950/65 via-slate-950/20 to-transparent"
              />
              <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-2xl border border-white/25 bg-slate-950/65 p-4 text-white shadow-xl backdrop-blur-md sm:inset-x-5 sm:bottom-5 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                  {contact.officeName}
                </p>
                {contact.address?.trim() && (
                  <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-white sm:text-[15px]">
                    {contact.address}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary p-8 text-center text-primary-foreground sm:min-h-[420px]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-14 -top-16 size-56 rounded-full border border-white/10"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full border border-white/10"
              />
              <div className="relative max-w-sm">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-white/10 text-accent ring-1 ring-white/20 shadow-lg backdrop-blur-sm">
                  <MapPin aria-hidden="true" className="size-8" />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-accent">
                  Office Location
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {contact.officeName}
                </p>
                <p className="mt-2 text-sm leading-6 text-primary-foreground/75">
                  {primaryMapUrl
                    ? "Open the map link to view this office location."
                    : "A map location has not been provided for this office."}
                </p>
                {primaryMapUrl && (
                  <a
                    href={primaryMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Open map
                    <ExternalLink aria-hidden="true" className="size-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Contacts({
  contacts,
  error,
}: {
  contacts: AdministrationContact[];
  error: boolean;
}) {
  return (
    <main className="min-h-screen ">
      <section className="px-4 md:px-10">
        <Breadcrumb items={[{ label: "Contacts" }]} />
      </section>
      <section
        aria-labelledby="administration-contacts-heading"
        className="container mx-auto px-5 md:px-16 pt-5 pb-16"
      >
        <header className="mx-auto mb-10 max-w-3xl text-center lg:mb-12">
          <span className="inline-flex rounded-full bg-accent/15 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Get in touch
          </span>
          <h2
            id="administration-contacts-heading"
            className="mt-2 font-heading text-2xl font-bold tracking-tight text-primary sm:text-3xl lg:text-4xl"
          >
            PCIU Contact Office
          </h2>
          <div
            aria-hidden="true"
            className="mx-auto mt-2 h-1 w-14 rounded-full bg-accent"
          />
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Find office locations, contact information, phone numbers, email
            addresses, and available hours for Port City International
            University.
          </p>
        </header>

        {error ? (
          <div
            role="alert"
            className="mx-auto max-w-3xl rounded-3xl border border-destructive/20 bg-destructive/5 p-7 text-center sm:p-10"
          >
            <Building2
              aria-hidden="true"
              className="mx-auto size-6 text-destructive"
            />
            <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
              Contact information is temporarily unavailable
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              We could not load the administration contact information at the
              moment. Please try again later.
            </p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-border bg-card/60 p-7 text-center sm:p-10">
            <Building2
              aria-hidden="true"
              className="mx-auto size-6 text-primary"
            />
            <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
              No administration contacts are available
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              Please check back later for updated university contact details.
            </p>
          </div>
        ) : (
          <ul className="mx-auto max-w-7xl space-y-7">
            {contacts.map((contact, index) => (
              <li key={`${contact.officeName}-${index}`}>
                <ContactCard contact={contact} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
