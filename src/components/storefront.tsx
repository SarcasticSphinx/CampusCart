"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, NotebookPen, Package, ShoppingBag, Plus, Search, SearchX, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BagSidebar } from "@/components/bag-sidebar";
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
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <header className="flex items-center justify-between border-b py-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight"><ShoppingBag aria-hidden="true" className="size-5 text-emerald-800" />CampusCart</Link>
        <BagSidebar cart={cart} error={error} onAdd={add} onQuantityChange={(id, quantity) => setCart(setQuantity(cart, id, quantity))} />
      </header>
      <main className="pb-16">
        <section className="py-12 sm:py-16">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-emerald-800">A little less searching. A little more studying.</p>
          <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Everyday essentials.<br /><span className="text-muted-foreground">Ready for campus.</span></h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">A small, considered collection of books, stationery, and the things that get you through the semester.</p>
        </section>
        <div className="mb-7 flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" aria-label="Product categories">
            {categories.map(({ name, icon: Icon }) => <Button key={name} variant={category === name ? "default" : "ghost"} size="sm" aria-pressed={category === name} onClick={() => setCategory(name)}><Icon aria-hidden="true" className="size-3.5" />{name}</Button>)}
          </div>
          <div className="relative sm:w-64"><Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search products" placeholder="Search essentials…" value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" /></div>
        </div>
        <div>
          <section aria-label="Products">
            <p className="mb-4 text-sm text-muted-foreground">{visibleProducts.length} essentials</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => {
                const Icon = product.category === "Books" ? BookOpen : product.category === "Stationery" ? NotebookPen : Package;
                const quantity = cart.find((item) => item.id === product.id)?.quantity ?? 0;
                return <Card key={product.id} className="gap-0 overflow-hidden rounded-xl py-0 shadow-none">
                  <div className="flex h-36 items-center justify-center bg-stone-100" aria-hidden="true"><Icon className="size-14 stroke-[1] text-stone-500" /></div>
                  <CardContent className="space-y-3 p-4">
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                    <h2 className="text-sm font-medium">{product.name}</h2>
                    <div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold">{formatPrice(product.price)}</span><Button variant="outline" size="sm" disabled={quantity >= product.stock} aria-label={`Add ${product.name} to bag`} onClick={() => add(product)}><Plus aria-hidden="true" className="size-3.5" />Add</Button></div>
                  </CardContent>
                </Card>;
              })}
            </div>
            {visibleProducts.length === 0 && <Empty className="py-16"><EmptyHeader><EmptyMedia variant="icon"><SearchX aria-hidden="true" /></EmptyMedia><EmptyTitle>No products found</EmptyTitle><EmptyDescription>Try another search or category.</EmptyDescription></EmptyHeader></Empty>}
          </section>

        </div>
      </main>
      <footer className="flex flex-wrap justify-between gap-3 border-t py-6 text-xs text-muted-foreground"><span>CampusCart · Made for campus life.</span><span>Prices in BDT</span></footer>
    </div>
  );
}
