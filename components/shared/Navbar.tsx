"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Search, ChevronDown, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const aboutMenu = [
  { name: "About the University", href: "/about-the-university" },
  { name: "Campus Life", href: "#campus-life" },
  { name: "Management", href: "/management" },
];

const researchMenu = [
  { name: "Research Centres", href: "/research?section=centres" },
  { name: "Research Areas", href: "/research?section=areas" },
  { name: "Research & Publications", href: "/research?section=publications" },
  { name: "Partnerships & Collaboration", href: "/research?section=partnerships" },
  { name: "MoUs", href: "/research?section=mous" },
  { name: "Port City Journal", href: "/research/port-city-journal" },
  { name: "Call For Paper", href: "/research/call-for-paper" },
  { name: "Call For Paper Guidelines", href: "/research/call-for-paper-guidelines" },
];

const academicsMenu = {
  quickLinks: [
    { name: "Exam Schedule", href: "/academics?section=exam-schedule" },
    { name: "Class Schedule", href: "/academics?section=class-schedule" },
    { name: "Rules & Grading System", href: "/academics?section=result-grading" },
    { name: "Examination Policies", href: "/academics?section=examination-policies" },
    { name: "Academic Results", href: "/academics?section=academic-results" },
    { name: "Online Certification Verification", href: "/academics?section=certification-verification" },
  ],
  faculties: [
    {
      name: "Faculty of Business Studies",
      departments: [{ name: "Department of Business Administration", href: "/department/bba" }],
    },
    {
      name: "Faculty of Humanities, Social Sciences & Law",
      departments: [
        { name: "Department of English", href: "/department/english" },
        { name: "Department of Law", href: "/department/law" },
        { name: "Department of Journalism and Media Studies", href: "/department/journalism" },
      ],
    },
    {
      name: "Faculty of Science and Engineering",
      departments: [
        { name: "Department of Computer Science and Engineering", href: "/department/cse" },
        { name: "Department of Electrical and Electronic Engineering", href: "/department/eee" },
        { name: "Department of Civil Engineering", href: "/department/civil" },
        { name: "Department of Textile Engineering", href: "/department/textile" },
        { name: "Department of Fashion Design and Technology", href: "/department/fashion" },
      ],
    },
  ],
};

const admissionMenu = [
  { name: "Admission Advertisement", href: "/admission?section=admission-advertisement" },
  { name: "Admission Requirement", href: "/admission?section=requirement" },
  { name: "Admission Schedule", href: "/admission?section=admission-schedule" },
  { name: "Admission Test", href: "/admission?section=admission-test" },
  { name: "Direct Admission", href: "/admission?section=direct-admission" },
  { name: "Documents Required", href: "/admission?section=documents-required" },
  { name: "Payment Policy", href: "/admission?section=payment-policy" },
  { name: "Online Admission", href: "/admission?section=online-admission" },
  { name: "Tuition & Others Fees", href: "/admission?section=tuition-fees" },
  { name: "FAQ", href: "/admission?section=faq" },
  { name: "Admission Test Result", href: "/admission?section=admission-test-result" },
  { name: "Scholarship & Financial Assistance", href: "/admission?section=scholarship" },
  { name: "Admission Contact", href: "/admission?section=admission-contact" },
];

const facilitiesMenu = [
  { name: "Library", href: "/library" },
  { name: "Port City News.com", href: "/port-city-news" },
  { name: "Computer Labs", href: "#computer-labs" },
  { name: "Cafeteria", href: "#cafeteria" },
  { name: "Sports Complex", href: "#sports" },
  { name: "Auditorium", href: "#auditorium" },
  { name: "Medical Center", href: "#medical" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Utility Bar */}
      <div className="hidden lg:block bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <a href="#prospective" className="hover:text-accent transition-colors">
                Prospective Students
              </a>
              <a href="#current" className="hover:text-accent transition-colors">
                Current Students
              </a>
              <Link href="/faculty" className="hover:text-accent transition-colors">
                Faculty &amp; Staff
              </Link>
              <a href="#alumni" className="hover:text-accent transition-colors">
                Alumni
              </a>
              <Link href="/faculty-auth" className="hover:text-accent transition-colors font-medium">
                Faculty Portal
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin-auth"
                className="flex items-center gap-1 hover:text-accent transition-colors font-medium"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
              <button
                className="flex items-center gap-1 hover:text-accent transition-colors"
                aria-label="Language toggle"
              >
                <Globe className="w-4 h-4" />
                <span>EN</span>
              </button>
              <button className="hover:text-accent transition-colors" aria-label="Search">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 border-b border-border ${
          isScrolled ? "bg-card shadow-md" : "bg-card"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-[70px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <Image
                src="/images/pciu-logo.png"
                alt="Port City International University Logo"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
              <div className="hidden md:block">
                <div className="font-bold text-lg text-primary leading-tight">
                  Port City International
                </div>
                <div className="text-xs text-muted-foreground tracking-wide">University</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center h-full">
              <NavItem href="/" label="Home" />

              <DropdownNavItem label="About">
                <SimpleDropdown items={aboutMenu} />
              </DropdownNavItem>

              <DropdownNavItem label="Academics" wide>
                <div className="w-[820px] p-6">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mb-5 pb-3 border-b border-border">
                    {academicsMenu.quickLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className="text-sm font-semibold text-primary hover:text-accent transition-colors py-1"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    {academicsMenu.faculties.map((faculty) => (
                      <div key={faculty.name}>
                        <h3 className="font-bold text-sm text-primary mb-3 pb-2 border-b-2 border-accent">
                          {faculty.name}
                        </h3>
                        <ul className="space-y-1">
                          {faculty.departments.map((dept) => (
                            <li key={dept.name}>
                              <a
                                href={dept.href}
                                className="text-sm text-muted-foreground hover:text-primary hover:pl-1 transition-all block py-1.5"
                              >
                                {dept.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </DropdownNavItem>

              <DropdownNavItem label="Admission">
                <SimpleDropdown items={admissionMenu} />
              </DropdownNavItem>

              <DropdownNavItem label="Facilities">
                <SimpleDropdown items={facilitiesMenu} />
              </DropdownNavItem>

              <DropdownNavItem label="Research">
                <SimpleDropdown items={researchMenu} />
              </DropdownNavItem>

              <NavItem href="/iqac" label="IQAC" />
              <NavItem href="#contact" label="Contact" />
            </nav>

            {/* CTA & Mobile Menu */}
            <div className="flex items-center gap-3">
              <Button variant="accent" className="hidden md:flex" aria-label="Apply now">
                Apply Now
              </Button>

              {/* Mobile Menu Trigger */}
              <button
                className="lg:hidden p-2"
                aria-label="Toggle menu"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[300px] sm:w-[350px] bg-card overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Image src="/images/pciu-logo.png" alt="PCIU Logo" width={32} height={32} className="w-8 h-8" />
                <span className="text-primary font-heading font-bold">PCIU</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-foreground hover:text-primary font-medium py-3 px-2 border-b border-border"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>

              <MobileDropdown
                label="About"
                isOpen={openSubmenu === "about"}
                onToggle={() => setOpenSubmenu(openSubmenu === "about" ? null : "about")}
              >
                {aboutMenu.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-sm text-muted-foreground hover:text-primary py-2 px-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </MobileDropdown>

              <MobileDropdown
                label="Academics"
                isOpen={openSubmenu === "academics"}
                onToggle={() => setOpenSubmenu(openSubmenu === "academics" ? null : "academics")}
              >
                {academicsMenu.quickLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block text-sm text-primary font-medium py-2 px-4 border-b border-border/50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                {academicsMenu.faculties.map((faculty) => (
                  <div key={faculty.name} className="py-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase px-4 py-1">
                      {faculty.name}
                    </div>
                    {faculty.departments.map((dept) => (
                      <a
                        key={dept.name}
                        href={dept.href}
                        className="block text-sm text-muted-foreground hover:text-primary py-2 px-6"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {dept.name}
                      </a>
                    ))}
                  </div>
                ))}
              </MobileDropdown>

              <MobileDropdown
                label="Admission"
                isOpen={openSubmenu === "admission"}
                onToggle={() => setOpenSubmenu(openSubmenu === "admission" ? null : "admission")}
              >
                {admissionMenu.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-sm text-muted-foreground hover:text-primary py-2 px-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </MobileDropdown>

              <MobileDropdown
                label="Facilities"
                isOpen={openSubmenu === "facilities"}
                onToggle={() => setOpenSubmenu(openSubmenu === "facilities" ? null : "facilities")}
              >
                {facilitiesMenu.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-sm text-muted-foreground hover:text-primary py-2 px-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </MobileDropdown>

              <MobileDropdown
                label="Research"
                isOpen={openSubmenu === "research"}
                onToggle={() => setOpenSubmenu(openSubmenu === "research" ? null : "research")}
              >
                {researchMenu.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-sm text-muted-foreground hover:text-primary py-2 px-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </MobileDropdown>

              <a
                href="/iqac"
                className="text-foreground hover:text-primary font-medium py-3 px-2 border-b border-border"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                IQAC
              </a>
              <a
                href="#contact"
                className="text-foreground hover:text-primary font-medium py-3 px-2 border-b border-border"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>

              <Button variant="accent" className="w-full mt-4">
                Apply Now
              </Button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Sub-components ─── */

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="relative h-full flex items-center px-4 text-sm font-medium text-foreground hover:text-primary transition-colors group"
    >
      {label}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-accent transition-all duration-300 group-hover:w-full rounded-t" />
    </a>
  );
}

function DropdownNavItem({
  label,
  children,
  wide,
}: {
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="relative h-full flex items-center"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className="relative h-full flex items-center gap-1 px-4 text-sm font-medium text-foreground hover:text-primary transition-colors group"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
        <span
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] bg-accent transition-all duration-300 rounded-t ${
            open ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </button>

      <div
        className={`absolute top-full ${
          wide ? "left-1/2 -translate-x-1/2" : "left-0"
        } pt-0 transition-all duration-200 ${
          open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"
        }`}
      >
        <div className="bg-card rounded-b-lg shadow-lg border border-border border-t-[3px] border-t-accent overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

function SimpleDropdown({ items }: { items: { name: string; href: string }[] }) {
  return (
    <div className="w-[240px] py-2">
      {items.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
        >
          {item.name}
        </a>
      ))}
    </div>
  );
}

function MobileDropdown({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex items-center justify-between w-full text-foreground hover:text-primary font-medium py-3 px-2 border-b border-border"
      >
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <div className="bg-muted/50 rounded-md mt-1">{children}</div>}
    </div>
  );
}
