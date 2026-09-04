// import { Mail, Phone, MapPin } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   FacebookIcon,
//   YoutubeIcon,
//   LinkedinIcon,
//   InstagramIcon,
// } from "@/components/shared/social-icons";

// export default function Footer() {
//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className="bg-primary text-primary-foreground pt-16 pb-8" id="contact">
//       <div className="container mx-auto px-4">
//         {/* Main Footer Content */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
//           {/* About */}
//           <div>
//             <div className="flex items-center gap-3 mb-6">
//               <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center font-heading font-bold text-white text-xl">
//                 PCIU
//               </div>
//               <div>
//                 <div className="font-heading font-bold text-lg leading-tight">
//                   Port City International
//                 </div>
//                 <div className="text-xs text-primary-foreground/80">University</div>
//               </div>
//             </div>
//             <p className="text-primary-foreground/80 mb-6">
//               7-14 Nikunja Housing Society
//               <br />
//               Khulshi, Chattogram
//             </p>
//             <div className="flex items-center gap-4">
//               <a
//                 href="https://facebook.com"
//                 className="w-10 h-10 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors"
//                 aria-label="Facebook"
//               >
//                 <FacebookIcon className="w-5 h-5" />
//               </a>
//               <a
//                 href="https://youtube.com"
//                 className="w-10 h-10 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors"
//                 aria-label="YouTube"
//               >
//                 <YoutubeIcon className="w-5 h-5" />
//               </a>
//               <a
//                 href="https://linkedin.com"
//                 className="w-10 h-10 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors"
//                 aria-label="LinkedIn"
//               >
//                 <LinkedinIcon className="w-5 h-5" />
//               </a>
//               <a
//                 href="https://instagram.com"
//                 className="w-10 h-10 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors"
//                 aria-label="Instagram"
//               >
//                 <InstagramIcon className="w-5 h-5" />
//               </a>
//             </div>
//           </div>

//           {/* Academics */}
//           <div>
//             <h3 className="font-heading font-bold text-lg mb-6">Academics</h3>
//             <ul className="space-y-3">
//               <li>
//                 <a href="#faculties" className="text-primary-foreground/80 hover:text-accent transition-colors">
//                   Faculties
//                 </a>
//               </li>
//               <li>
//                 <a href="#departments" className="text-primary-foreground/80 hover:text-accent transition-colors">
//                   Departments
//                 </a>
//               </li>
//               <li>
//                 <a href="#programs" className="text-primary-foreground/80 hover:text-accent transition-colors">
//                   Programs
//                 </a>
//               </li>
//               <li>
//                 <a href="#research" className="text-primary-foreground/80 hover:text-accent transition-colors">
//                   Research
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Admissions & Resources */}
//           <div>
//             <h3 className="font-heading font-bold text-lg mb-6">Admissions</h3>
//             <ul className="space-y-3">
//               <li>
//                 <a href="#apply" className="text-primary-foreground/80 hover:text-accent transition-colors">
//                   Apply Now
//                 </a>
//               </li>
//               <li>
//                 <a href="#scholarships" className="text-primary-foreground/80 hover:text-accent transition-colors">
//                   Scholarships
//                 </a>
//               </li>
//               <li>
//                 <a href="#fees" className="text-primary-foreground/80 hover:text-accent transition-colors">
//                   Tuition &amp; Fees
//                 </a>
//               </li>
//               <li>
//                 <a href="#library" className="text-primary-foreground/80 hover:text-accent transition-colors">
//                   Library
//                 </a>
//               </li>
//               <li>
//                 <a href="#registrar" className="text-primary-foreground/80 hover:text-accent transition-colors">
//                   Registrar Office
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Contact */}
//           <div>
//             <h3 className="font-heading font-bold text-lg mb-6">Contact Us</h3>
//             <ul className="space-y-4">
//               <li className="flex items-start gap-3">
//                 <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
//                 <span className="text-primary-foreground/80">Chattogram, Bangladesh</span>
//               </li>
//               <li className="flex items-center gap-3">
//                 <Phone className="w-5 h-5 text-accent flex-shrink-0" />
//                 <a href="tel:+8801851120791" className="text-primary-foreground/80 hover:text-accent transition-colors">
//                   +880-18511-20791
//                 </a>
//               </li>
//               <li className="flex items-center gap-3">
//                 <Mail className="w-5 h-5 text-accent flex-shrink-0" />
//                 <a
//                   href="mailto:admission@portcity.edu.bd"
//                   className="text-primary-foreground/80 hover:text-accent transition-colors"
//                 >
//                   admission@portcity.edu.bd
//                 </a>
//               </li>
//             </ul>
//             <p className="text-sm text-primary-foreground/60 mt-4">
//               Office Hours: Sunday–Thursday
//               <br />
//               9:00 AM – 5:00 PM
//             </p>
//           </div>
//         </div>

//         {/* Newsletter */}
//         <div className="border-t border-white/10 pt-8 mb-8">
//           <div className="max-w-2xl mx-auto text-center">
//             <h3 className="font-heading font-bold text-xl mb-4">Stay Connected</h3>
//             <p className="text-primary-foreground/80 mb-6">
//               Subscribe to our newsletter for the latest updates and announcements
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
//               <Input
//                 type="email"
//                 placeholder="Your email address"
//                 className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-accent"
//                 aria-label="Email address"
//               />
//               <Button variant="highlight" className="px-8">
//                 Subscribe
//               </Button>
//             </div>
//             <p className="text-xs text-primary-foreground/60 mt-4">
//               We respect your privacy. Unsubscribe anytime.
//             </p>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="border-t border-white/10 pt-8">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
//             <p>© {currentYear} Port City International University. All rights reserved.</p>
//             <div className="flex items-center gap-6">
//               <a href="#privacy" className="hover:text-accent transition-colors">
//                 Privacy Policy
//               </a>
//               <a href="#terms" className="hover:text-accent transition-colors">
//                 Terms of Service
//               </a>
//               <a href="#accessibility" className="hover:text-accent transition-colors">
//                 Accessibility
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

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
    <footer className="relative overflow-hidden bg-primary pt-16 pb-8 text-primary-foreground sm:pt-20" id="contact">
      {/* Decorative background layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 md:px-12">
        {/* Main Footer Content */}
        <div className="mb-12 grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/5 ring-1 ring-white/10">
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
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:ring-accent"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://youtube.com"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:ring-accent"
                aria-label="YouTube"
              >
                <YoutubeIcon className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://linkedin.com"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:ring-accent"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://instagram.com"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:ring-accent"
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
                <a href="#faculties" className="text-sm text-primary-foreground/70 transition-colors hover:text-accent sm:text-base">
                  Faculties
                </a>
              </li>
              <li>
                <a href="#departments" className="text-sm text-primary-foreground/70 transition-colors hover:text-accent sm:text-base">
                  Departments
                </a>
              </li>
              <li>
                <a href="#programs" className="text-sm text-primary-foreground/70 transition-colors hover:text-accent sm:text-base">
                  Programs
                </a>
              </li>
              <li>
                <a href="#research" className="text-sm text-primary-foreground/70 transition-colors hover:text-accent sm:text-base">
                  Research
                </a>
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
                <a href="#apply" className="text-sm text-primary-foreground/70 transition-colors hover:text-accent sm:text-base">
                  Apply Now
                </a>
              </li>
              <li>
                <a href="#scholarships" className="text-sm text-primary-foreground/70 transition-colors hover:text-accent sm:text-base">
                  Scholarships
                </a>
              </li>
              <li>
                <a href="#fees" className="text-sm text-primary-foreground/70 transition-colors hover:text-accent sm:text-base">
                  Tuition &amp; Fees
                </a>
              </li>
              <li>
                <a href="#library" className="text-sm text-primary-foreground/70 transition-colors hover:text-accent sm:text-base">
                  Library
                </a>
              </li>
              <li>
                <a href="#registrar" className="text-sm text-primary-foreground/70 transition-colors hover:text-accent sm:text-base">
                  Registrar Office
                </a>
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
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-accent sm:text-base"
                >
                  +880-18511-20791
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-accent" />
                <a
                  href="mailto:admission@portcity.edu.bd"
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-accent sm:text-base"
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
        <div className="mb-8 border-t border-white/10 pt-8 sm:pt-10">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="font-heading mb-3 text-xl font-bold sm:mb-4">Stay Connected</h3>
            <p className="mb-6 text-sm text-primary-foreground/70 sm:text-base">
              Subscribe to our newsletter for the latest updates and announcements
            </p>
            <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row sm:gap-4">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-1 border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-accent"
                aria-label="Email address"
              />
              <Button variant="highlight" className="px-8">
                Subscribe
              </Button>
            </div>
            <p className="mt-4 text-xs text-primary-foreground/50">
              We respect your privacy. Unsubscribe anytime.
            </p>
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