import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
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
// scope. The public site keeps Inter above untouched. This is a second,
// separate Poppins load (not the `poppins` instance above): admin uses it
// for body text too, so it needs 400/500 alongside the display weights
// the public site's heading-only instance carries.
const poppinsAdmin = Poppins({
  variable: "--font-admin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
      className={`${inter.variable} ${poppins.variable} ${poppinsAdmin.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
