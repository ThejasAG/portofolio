import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { profile, isPlaceholder } from "@/data/profile";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const name = isPlaceholder(profile.name) ? "Portfolio" : profile.name;
const title = isPlaceholder(profile.title) ? "Software Engineer" : profile.title;
const description = isPlaceholder(profile.seo.description)
  ? `${name} — ${title}.`
  : profile.seo.description;
const siteUrl = profile.seo.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${name} — ${title}`,
    template: `%s — ${name}`,
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: `${name} — ${title}`,
    description,
    siteName: name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${name} — ${title}`,
    description,
    ...(profile.seo.twitter ? { creator: profile.seo.twitter } : {}),
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0e" },
  ],
};

/**
 * Runs before paint, so the correct theme class is on <html> from the
 * first frame — no wrong-theme flash, no hydration mismatch (it only
 * touches classList, which React does not diff).
 */
const themeScript = `(function(){try{var s=localStorage.getItem("theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} grain antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-[var(--color-fg)] focus:px-4 focus:py-2 focus:text-sm focus:text-[var(--color-bg)]"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
