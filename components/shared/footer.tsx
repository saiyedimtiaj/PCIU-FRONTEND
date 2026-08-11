import { Mail, Phone, MapPin } from "lucide-react";
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
    <footer className="bg-primary text-primary-foreground pt-16 pb-8" id="contact">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center font-heading font-bold text-white text-xl">
                PCIU
              </div>
              <div>
                <div className="font-heading font-bold text-lg leading-tight">
                  Port City International
                </div>
                <div className="text-xs text-primary-foreground/80">University</div>
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-6">
              7-14 Nikunja Housing Society
              <br />
              Khulshi, Chattogram
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                className="w-10 h-10 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                className="w-10 h-10 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                className="w-10 h-10 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                className="w-10 h-10 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Academics */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6">Academics</h3>
            <ul className="space-y-3">
              <li>
                <a href="#faculties" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Faculties
                </a>
              </li>
              <li>
                <a href="#departments" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Departments
                </a>
              </li>
              <li>
                <a href="#programs" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Programs
                </a>
              </li>
              <li>
                <a href="#research" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Research
                </a>
              </li>
            </ul>
          </div>

          {/* Admissions & Resources */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6">Admissions</h3>
            <ul className="space-y-3">
              <li>
                <a href="#apply" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Apply Now
                </a>
              </li>
              <li>
                <a href="#scholarships" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Scholarships
                </a>
              </li>
              <li>
                <a href="#fees" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Tuition &amp; Fees
                </a>
              </li>
              <li>
                <a href="#library" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Library
                </a>
              </li>
              <li>
                <a href="#registrar" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Registrar Office
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80">Chattogram, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="tel:+8801851120791" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  +880-18511-20791
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <a
                  href="mailto:admission@portcity.edu.bd"
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  admission@portcity.edu.bd
                </a>
              </li>
            </ul>
            <p className="text-sm text-primary-foreground/60 mt-4">
              Office Hours: Sunday–Thursday
              <br />
              9:00 AM – 5:00 PM
            </p>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-heading font-bold text-xl mb-4">Stay Connected</h3>
            <p className="text-primary-foreground/80 mb-6">
              Subscribe to our newsletter for the latest updates and announcements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-accent"
                aria-label="Email address"
              />
              <Button variant="highlight" className="px-8">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-primary-foreground/60 mt-4">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>© {currentYear} Port City International University. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#privacy" className="hover:text-accent transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-accent transition-colors">
                Terms of Service
              </a>
              <a href="#accessibility" className="hover:text-accent transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
