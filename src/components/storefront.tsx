"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, NotebookPen, Package, Plus, Search, SearchX, LayoutGrid, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BagSidebar } from "@/components/bag-sidebar";
import { ProductImage } from "@/components/product-image";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { addToCart, setQuantity, type CartItem } from "@/lib/cart";
import { formatPrice, type Product } from "@/lib/products";

const categories = [
  { name: "All", icon: LayoutGrid },
  { name: "Stationery", icon: NotebookPen },
  { name: "Books", icon: BookOpen },
  { name: "Essentials", icon: Package },
];

export function Storefront({ products }: { products: Product[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [error, setError] = useState("");
  const visibleProducts = products.filter((product) =>
    (category === "All" || product.category === category) && product.name.toLowerCase().includes(query.toLowerCase())
  );

  function add(product: Product) {
    try { setCart(addToCart(cart, product)); setError(""); }
    catch (error) { setError(error instanceof Error ? error.message : "Unable to add item."); }
  }

  return (
    <>
      <div className="flex items-center justify-center gap-2 bg-primary px-4 py-2 text-center text-xs tracking-wide text-primary-foreground"><Sparkles aria-hidden="true" className="size-3" />Good things for your next chapter.</div>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4 border-b py-5 sm:py-6">
          <Link href="/" aria-label="CampusCart home" className="font-brand text-3xl tracking-[-0.06em] sm:text-4xl">campus<span className="italic text-primary">cart</span><span className="text-[#bb603e]">.</span></Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-7 text-sm text-muted-foreground md:flex"><a href="#collection" className="transition-colors hover:text-primary">The collection</a><a href="#about" className="transition-colors hover:text-primary">Our little philosophy</a></nav>
          <BagSidebar cart={cart} error={error} onAdd={add} onQuantityChange={(id, quantity) => setCart(setQuantity(cart, id, quantity))} />
        </header>
        <main>
          <section className="grid items-center gap-9 py-9 sm:py-12 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:py-14">
            <div className="py-3 lg:py-6">
              <Badge variant="outline" className="gap-2 rounded-full border-primary/20 px-3 py-1.5 text-[10px] font-medium tracking-[0.16em]"><span className="size-1.5 rounded-full bg-[#bb603e]" />THE CAMPUS EDIT · VOL. 01</Badge>
              <h1 className="mt-6 text-5xl font-medium leading-[1.03] tracking-[-0.055em] sm:text-6xl lg:text-[76px]">Small things.<br /><span className="font-brand font-normal italic text-primary">Big semester.</span></h1>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-muted-foreground sm:text-lg">For the early lectures, late-night ideas, and everything in between. Meet your new everyday essentials.</p>
              <Button render={<a href="#collection" />} className="mt-7 h-11 gap-6 rounded-full px-6">Explore the collection<ArrowUpRight aria-hidden="true" className="size-4" /></Button>
              <div className="mt-9 flex items-center gap-3 text-xs text-muted-foreground"><span className="flex size-8 items-center justify-center rounded-full border border-primary/15"><NotebookPen aria-hidden="true" className="size-4 text-primary" /></span>Less clutter. More possibility.</div>
            </div>
            <div className="relative aspect-[1.12] overflow-hidden rounded-[1.25rem] bg-[#e6e2d9]">
              <Image src="/images/products/hero.jpg" alt="An open notebook, laptop, and amber glass on a sunlit study desk" fill sizes="(max-width: 1024px) 100vw, 50vw" preload className="object-cover object-[center_58%]" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4 rounded-xl border border-white/60 bg-background/95 p-4 backdrop-blur-sm sm:bottom-6 sm:left-6 sm:right-6"><div><p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">A fresh perspective</p><p className="mt-1 font-brand text-xl">Make room for good ideas.</p></div><ArrowDown aria-hidden="true" className="size-5 shrink-0 text-primary" /></div>
            </div>
          </section>
          <Separator />
          <section id="collection" aria-label="Products" className="scroll-mt-8 pb-14 pt-10 sm:pb-20 sm:pt-14">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-primary">Considered, not complicated</p><h2 className="text-3xl font-medium tracking-tight sm:text-4xl">Your everyday lineup.</h2></div><p className="text-sm text-muted-foreground">{visibleProducts.length} {visibleProducts.length === 1 ? "essential" : "essentials"}, endless possibilities.</p></div>
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-1.5" aria-label="Product categories">
                {categories.map(({ name, icon: Icon }) => <Button key={name} variant={category === name ? "default" : "ghost"} className="h-9 rounded-full px-3.5" size="sm" aria-pressed={category === name} onClick={() => setCategory(name)}><Icon aria-hidden="true" className="size-3.5" />{name === "All" ? "All essentials" : name}</Button>)}
              </div>
              <div className="relative sm:w-60"><Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search products" placeholder="Find your next essential" value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 rounded-full bg-card pl-9" /></div>
            </div>
            <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => {
                const quantity = cart.find((item) => item.id === product.id)?.quantity ?? 0;
                return <Card key={product.id} className="group gap-0 overflow-visible rounded-none bg-transparent py-0 shadow-none ring-0">
                  <div className="relative aspect-[1.15] overflow-hidden rounded-xl bg-[#eeece5]"><ProductImage product={product} /><Badge variant="secondary" className="absolute left-3 top-3 rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-normal backdrop-blur-sm">{product.category}</Badge></div>
                  <CardContent className="px-0 pt-4">
                    <div className="flex items-center justify-between gap-3"><div><h3 className="text-base font-medium tracking-tight">{product.name}</h3><p className="mt-1 text-sm text-muted-foreground">{formatPrice(product.price)}</p></div><Button variant="outline" size="icon" className="size-10 shrink-0 rounded-full border-primary/20 bg-transparent transition-colors hover:bg-primary hover:text-primary-foreground" disabled={quantity >= product.stock} aria-label={`Add ${product.name} to bag`} onClick={() => add(product)}><Plus aria-hidden="true" className="size-4" /></Button></div>
                    {product.stock === 0 && <p className="mt-2 text-xs text-muted-foreground">Currently out of stock</p>}
                  </CardContent>
                </Card>;
              })}
            </div>
            {visibleProducts.length === 0 && <Empty className="py-16"><EmptyHeader><EmptyMedia variant="icon"><SearchX aria-hidden="true" /></EmptyMedia><EmptyTitle>No products found</EmptyTitle><EmptyDescription>Try another search or category.</EmptyDescription></EmptyHeader></Empty>}
          </section>
          <section id="about" className="mb-12 flex flex-col justify-between gap-6 rounded-2xl bg-primary px-7 py-9 text-primary-foreground sm:flex-row sm:items-center sm:px-10"><div><p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-primary-foreground/70">For wherever the day takes you</p><h2 className="font-brand text-3xl sm:text-4xl">A little more ready.<br /><span className="italic">A little more you.</span></h2></div><div className="max-w-xs"><p className="text-sm leading-relaxed text-primary-foreground/80">We believe the things you carry should make everyday life feel a little better. Simple choices, with a purpose.</p><a href="#collection" className="mt-5 inline-flex items-center gap-3 text-sm underline underline-offset-4">Find your essentials<ArrowRight aria-hidden="true" className="size-4" /></a></div></section>
        </main>
        <footer className="flex flex-wrap items-center justify-between gap-5 border-t py-7"><div><p className="font-brand text-2xl tracking-[-0.06em]">campus<span className="italic text-primary">cart</span>.</p><p className="mt-1 text-xs text-muted-foreground">Good things for campus life.</p></div><div className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground"><Link href="/credits" className="hover:text-primary">Photography credits</Link><span>Prices in BDT</span><span>© {new Date().getFullYear()} CampusCart</span></div></footer>
      </div>
    </>
  );
}
