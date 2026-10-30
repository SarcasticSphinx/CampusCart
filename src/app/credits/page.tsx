import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const photos = [
  ["Study desk", "https://www.pexels.com/photo/a-blank-notebook-beside-a-laptop-on-a-white-surface-8534196/", "Pexels"],
  ["Notebook", "https://www.pexels.com/photo/minimalist-black-notebook-and-pen-on-white-background-31480649/", "Pexels"],
  ["Pen", "https://www.pexels.com/photo/black-point-pen-on-white-paper-927517/", "Pexels · Steve A Johnson"],
  ["Technical textbook", "https://www.pexels.com/photo/close-up-of-a-textbook-5527516/", "Pexels"],
  ["Weekly planner", "https://www.pexels.com/photo/flat-lay-of-office-supplies-with-weekly-planner-35051395/", "Pexels"],
  ["Canvas tote", "https://www.pexels.com/photo/handcrafted-canvas-and-leather-tote-bag-in-natural-light-35685401/", "Pexels · Daniel & Hannah Snipes"],
  ["Water bottle", "https://unsplash.com/photos/white-bottle-on-white-table-Aej5gA11eHQ", "Unsplash · Vanesa Giaconi"],
];

export const metadata = { title: "Photography credits | CampusCart" };

export default function Credits() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12 sm:py-20">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft aria-hidden="true" className="size-4" />Back to the collection</Link>
      <h1 className="mt-10 font-brand text-4xl">Behind the photographs.</h1>
      <p className="mb-8 mt-4 text-sm leading-relaxed text-muted-foreground">Thank you to the photographers whose work brings CampusCart to life. These stock photographs illustrate the collection; they are not photographs of verified retail inventory.</p>
      <Card className="py-0 shadow-none"><CardContent className="divide-y px-5">{photos.map(([title, url, source]) => <a key={title} href={url} className="flex items-center justify-between gap-4 py-4 hover:text-primary"><span><span className="block text-sm font-medium">{title}</span><span className="text-xs text-muted-foreground">{source}</span></span><ArrowUpRight aria-hidden="true" className="size-4 shrink-0" /></a>)}</CardContent></Card>
      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">Photos are locally hosted under the <a className="underline" href="https://www.pexels.com/license/">Pexels License</a> and <a className="underline" href="https://unsplash.com/license">Unsplash License</a>. Outfit and DM Serif Display are self-hosted via Fontsource under their included open font licenses.</p>
    </main>
  );
}
