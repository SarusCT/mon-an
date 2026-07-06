import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";
import { getSiteUrl } from "@/lib/siteUrl";
import MoneyPopover from "@/components/MoneyPopover";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${serif.variable} ${sans.variable}`}>
      <body>
        {children}
        <MoneyPopover />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
