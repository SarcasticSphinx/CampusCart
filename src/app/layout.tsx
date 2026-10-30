import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { ShopProvider } from "@/components/shop-provider";
import { Toaster } from "@/components/ui/toast";

const outfit = localFont({
  src: "../../node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2",
  variable: "--font-outfit",
  weight: "100 900",
  display: "swap",
});
const wordmark = localFont({
  src: [
    { path: "../../node_modules/@fontsource/dm-serif-display/files/dm-serif-display-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/dm-serif-display/files/dm-serif-display-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-wordmark",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CampusCart | Good things for campus life",
  description: "A considered collection of books, stationery, and everyday essentials. Small things for your next big chapter.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${outfit.variable} ${wordmark.variable}`}><body className="min-h-screen bg-background font-sans text-foreground antialiased"><Toaster><ShopProvider><SiteHeader />{children}</ShopProvider></Toaster></body></html>;
}
