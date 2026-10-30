import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CampusCart | Campus essentials",
  description: "Books, stationery, and everyday essentials for campus life.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="min-h-screen bg-background font-sans text-foreground antialiased">{children}</body></html>;
}
