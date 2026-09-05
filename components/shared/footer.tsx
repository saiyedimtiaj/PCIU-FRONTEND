import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FacebookIcon,
  YoutubeIcon,
  LinkedinIcon,
  InstagramIcon,
} from "@/components/shared/social-icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[rgb(8,32,63)] pt-16 pb-8 text-primary-foreground sm:pt-20" id="contact">
      {/* Decorative background layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-[rgb(8,32,63)] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-[rgb(8,32,63)]" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 md:px-5">
        {/* Main Footer Content */}
        <div className="mb-12 grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                <Image
                  src="/images/pciu-logo.png"
                  alt="PCIU Logo"
                  fill
                  sizes="48px"
                  className="object-contain p-1.5"
                />
              </div>
              <div>
                <div className="font-heading text-lg font-bold leading-tight">
                  Port City International
                </div>
                <div className="text-xs text-primary-foreground/70">University</div>
              </div>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-primary-foreground/70 sm:text-base">
              7-14 Nikunja Housing Society
              <br />
              Khulshi, Chattogram
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[rgb(245,183,29)] hover:ring-[rgb(245,183,29)]"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://youtube.com"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[rgb(245,183,29)] hover:ring-[rgb(245,183,29)]"
                aria-label="YouTube"
              >
                <YoutubeIcon className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://linkedin.com"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[rgb(245,183,29)] hover:ring-[rgb(245,183,29)]"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://instagram.com"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[rgb(245,183,29)] hover:ring-[rgb(245,183,29)]"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Academics */}
          <div>
            <Link
              href="/academics"
              className="group mb-6 inline-flex items-center gap-1.5 font-heading text-lg font-bold transition-colors hover:text-accent"
            >
              Academics
              <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
            <ul className="space-y-3">
              <li>
                <Link href="/faculty" className="text-sm text-primary-foreground/70 transition-colors hover:text-[rgb(245,183,29)] sm:text-base">
                  Faculties
                </Link>
              </li>
              <li>
                <Link href="/department" className="text-sm text-primary-foreground/70 transition-colors hover:text-[rgb(245,183,29)] sm:text-base">
                  Departments
                </Link>
              </li>
              <li>
                <Link href="/academics" className="text-sm text-primary-foreground/70 transition-colors hover:text-[rgb(245,183,29)] sm:text-base">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="/research" className="text-sm text-primary-foreground/70 transition-colors hover:text-[rgb(245,183,29)] sm:text-base">
                  Research
                </Link>
              </li>
            </ul>
          </div>

          {/* Admissions & Resources */}
          <div>
            <Link
              href="/admission"
              className="group mb-6 inline-flex items-center gap-1.5 font-heading text-lg font-bold transition-colors hover:text-accent"
            >
              Admissions
              <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
            <ul className="space-y-3">
              <li>
                <Link href="/admission" className="text-sm text-primary-foreground/70 transition-colors hover:text-[rgb(245,183,29)] sm:text-base">
                  Apply Now
                </Link>
              </li>
              <li>
                <Link href="/admission" className="text-sm text-primary-foreground/70 transition-colors hover:text-[rgb(245,183,29)] sm:text-base">
                  Scholarships
                </Link>
              </li>
              <li>
                <Link href="/admission" className="text-sm text-primary-foreground/70 transition-colors hover:text-[rgb(245,183,29)] sm:text-base">
                  Tuition &amp; Fees
                </Link>
              </li>
              <li>
                <Link href="/library" className="text-sm text-primary-foreground/70 transition-colors hover:text-[rgb(245,183,29)] sm:text-base">
                  Library
                </Link>
              </li>
              <li>
                <Link href="/management" className="text-sm text-primary-foreground/70 transition-colors hover:text-[rgb(245,183,29)] sm:text-base">
                  Registrar Office
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 font-heading text-lg font-bold">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-sm text-primary-foreground/70 sm:text-base">
                  Chattogram, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-accent" />
                <a
                  href="tel:+8801851120791"
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-[rgb(245,183,29)] sm:text-base"
                >
                  +880-18511-20791
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-accent" />
                <a
                  href="mailto:admission@portcity.edu.bd"
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-[rgb(245,183,29)] sm:text-base"
                >
                  admission@portcity.edu.bd
                </a>
              </li>
            </ul>
            <p className="mt-4 text-xs text-primary-foreground/50 sm:text-sm">
              Office Hours: Sunday–Thursday
              <br />
              9:00 AM – 5:00 PM
            </p>
          </div>
        </div>

       {/* Newsletter */}
<div className="mb-6 rounded-2xl border-t border-white/10 bg-[rgb(13,42,79)] px-4 py-6 sm:px-8 sm:py-4">
  <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
    {/* Text */}
    <div className="lg:max-w-sm">
      <h3 className="font-heading my-1 text-xl font-bold">Stay Connected</h3>
      <p className="my-2 text-sm text-primary-foreground/70 sm:text-base">
        Subscribe to our newsletter for the latest updates and announcements
      </p>
    </div>

    {/* Form */}
    <div className="flex w-full max-w-md flex-col items-center gap-3 lg:w-auto lg:shrink-0 lg:items-end">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
        <Input
          type="email"
          placeholder="Your email address"
          className="flex-1 border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-accent sm:min-w-[220px]"
          aria-label="Email address"
        />
        <Button
          variant="highlight"
          className="bg-[rgb(245,183,29)] px-8 py-5 text-[rgb(8,32,63)] hover:bg-[rgb(245,183,29)]/90"
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
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-primary-foreground/50 sm:text-sm md:flex-row">
            <p className="text-center md:text-left">
              © {currentYear} Port City International University. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <a href="#privacy" className="transition-colors hover:text-accent">
                Privacy Policy
              </a>
              <a href="#terms" className="transition-colors hover:text-accent">
                Terms of Service
              </a>
              <a href="#accessibility" className="transition-colors hover:text-accent">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}