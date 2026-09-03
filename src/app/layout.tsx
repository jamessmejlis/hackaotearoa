import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Archivo, Archivo_Black } from "next/font/google";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

// Self-hosted at build time by next/font — no request to Google at runtime.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "HackAotearoa — the co-working community for NZ startup builders",
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_NZ",
    url: "/",
    title: "HackAotearoa — the co-working community for NZ startup builders",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "HackAotearoa — the co-working community for NZ startup builders",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NZ" className={`${archivo.variable} ${archivoBlack.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
