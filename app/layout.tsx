import type { Metadata } from "next";
import { Inter, Poppins, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

// Admin-dashboard-only font — see app/globals.css .admin-theme, which
// redeclares --font-sans/--font-heading to var(--font-admin) inside admin
// scope. The public site keeps Inter + Poppins above untouched.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-admin",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Port City International University",
  description:
    "Port City International University (PCIU), Chattogram — Where the Bay Meets Brilliance. A global standard university committed to excellence in education, research, and service.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
