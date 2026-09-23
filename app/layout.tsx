import type { Metadata, Viewport } from "next";
import { Lora, Nunito_Sans } from "next/font/google";
import { baseUrl } from "@/lib/base-url";
import { site } from "@/lib/site";
import "./globals.css";

// Lora for the wordmark and headings (warm, calligraphic serif that echoes the logo);
// Nunito Sans for body text (soft terminals, large x-height, reads well on phones).
const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-lora" });
const nunito = Nunito_Sans({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl()),
  title: {
    default: `${site.name} | Family Medicine in Kauswagan, Cagayan de Oro`,
    template: `%s | ${site.name}`,
  },
  description:
    "Family medicine clinic in Kauswagan, Cagayan de Oro. Check-ups, chronic care, vaccinations, 3-minute lab tests, and an Animal Bite Center with Dr. Anna Bianca Marie Watanabe-Ratilla.",
  openGraph: {
    title: site.name,
    description: "Primary care for the whole family, in Kauswagan, Cagayan de Oro.",
    type: "website",
    locale: "en_PH",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFBF8" },
    { media: "(prefers-color-scheme: dark)", color: "#1A201F" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lora.variable} ${nunito.variable}`} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
