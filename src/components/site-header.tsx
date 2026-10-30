"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { BagSidebar } from "@/components/bag-sidebar";
import { useShop } from "@/components/shop-provider";

export function SiteHeader() {
  const { cart, error, bagOpen, setBagOpen, add, changeQuantity } = useShop();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-md">
      <div className="flex items-center justify-center gap-2 bg-primary px-4 py-2 text-center text-xs tracking-wide text-primary-foreground"><Sparkles aria-hidden="true" className="size-3" />Good things for your next chapter.</div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
        <Link href="/" aria-label="CampusCart home" className="font-brand text-3xl tracking-[-0.06em] sm:text-4xl">campus<span className="italic text-primary">cart</span><span className="text-[#bb603e]">.</span></Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-7 text-sm text-muted-foreground md:flex"><Link href="/#collection" className="transition-colors hover:text-primary">The collection</Link><Link href="/#about" className="transition-colors hover:text-primary">Our little philosophy</Link></nav>
        <BagSidebar cart={cart} error={error} onAdd={add} onQuantityChange={changeQuantity} open={bagOpen} onOpenChange={setBagOpen} />
      </div>
    </header>
  );
}
