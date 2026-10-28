import type { Metadata, Viewport } from "next";
import { site } from "@/content/site";
import { bricolage, dmMono, fraunces, gloock, instrument } from "./fonts";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Websites for places that open early`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — Websites for places that open early`,
    description: site.description,
    url: site.url,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f3ebdd",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = [fraunces, instrument, dmMono, bricolage, gloock].map((f) => f.variable).join(" ");

  return (
    <html lang="en" className={fonts} suppressHydrationWarning>
      <head>
        {/* Marks the page as scripted before paint so reveal animations never hide content without JS. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a
          href="#main"
          className="label fixed left-3 top-3 z-[100] -translate-y-24 bg-ink px-4 py-3 text-paper transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
