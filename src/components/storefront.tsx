"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, NotebookPen, Package, ShoppingBag, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { addToCart, cartTotal, setQuantity, type CartItem } from "@/lib/cart";
import { formatPrice, type Product } from "@/lib/products";

const categories = ["All", "Stationery", "Books", "Essentials"];

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
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight"><ShoppingBag className="size-5" />CampusCart<span className="size-1.5 rounded-full bg-emerald-700" /></Link>
        <a href="#cart" className="flex items-center gap-2 text-sm text-muted-foreground">Your bag <Badge variant="secondary">{cart.reduce((sum, item) => sum + item.quantity, 0)}</Badge></a>
      </header>
      <main className="pb-16">
        <section className="py-12 sm:py-16">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-emerald-800">A little less searching. A little more studying.</p>
          <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Everyday essentials.<br /><span className="text-muted-foreground">Ready for campus.</span></h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">A small, considered collection of books, stationery, and the things that get you through the semester.</p>
        </section>
        <div className="mb-7 flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" aria-label="Product categories">
            {categories.map((name) => <Button key={name} variant={category === name ? "default" : "ghost"} size="sm" aria-pressed={category === name} onClick={() => setCategory(name)}>{name}</Button>)}
          </div>
          <Input aria-label="Search products" placeholder="Search essentials…" value={query} onChange={(event) => setQuery(event.target.value)} className="sm:max-w-64" />
        </div>
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_280px]">
          <section aria-label="Products">
            <p className="mb-4 text-sm text-muted-foreground">{visibleProducts.length} essentials</p>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => {
                const Icon = product.category === "Books" ? BookOpen : product.category === "Stationery" ? NotebookPen : Package;
                const quantity = cart.find((item) => item.id === product.id)?.quantity ?? 0;
                return <Card key={product.id} className="gap-0 overflow-hidden rounded-xl py-0 shadow-none">
                  <div className="flex h-36 items-center justify-center bg-stone-100" aria-hidden="true"><Icon className="size-14 stroke-[1] text-stone-500" /></div>
                  <CardContent className="space-y-3 p-4">
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                    <h2 className="text-sm font-medium">{product.name}</h2>
                    <div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold">{formatPrice(product.price)}</span><Button variant="outline" size="sm" disabled={quantity >= product.stock} aria-label={`Add ${product.name} to bag`} onClick={() => add(product)}><Plus className="size-3.5" />Add</Button></div>
                  </CardContent>
                </Card>;
              })}
            </div>
            {visibleProducts.length === 0 && <p className="py-12 text-sm text-muted-foreground">No products found. Try another search.</p>}
          </section>
          <aside id="cart" className="scroll-mt-6 rounded-xl border p-5 lg:sticky lg:top-6">
            <h2 className="mb-5 flex items-center gap-2 font-medium"><ShoppingBag className="size-4" />Your bag</h2>
            <div aria-live="polite">
              {cart.length === 0 ? <p className="py-5 text-sm leading-relaxed text-muted-foreground">A fresh start. Add a few essentials to your bag.</p> : <ul className="space-y-5">{cart.map((item) => <li key={item.id}>
                <div className="flex justify-between gap-2 text-sm"><span>{item.name}</span><span className="shrink-0">{formatPrice(item.price * item.quantity)}</span></div>
                <div className="mt-2 flex items-center gap-3"><Button variant="outline" size="icon" className="size-7" aria-label={`Decrease ${item.name} quantity`} onClick={() => setCart(setQuantity(cart, item.id, item.quantity - 1))}><Minus className="size-3" /></Button><span className="text-sm">{item.quantity}</span><Button variant="outline" size="icon" className="size-7" disabled={item.quantity >= item.stock} aria-label={`Increase ${item.name} quantity`} onClick={() => add(item)}><Plus className="size-3" /></Button></div>
              </li>)}</ul>}
              <div className="mt-6 flex justify-between border-t pt-4 text-sm font-semibold"><span>Subtotal</span><span>{formatPrice(cartTotal(cart))}</span></div>
            </div>
            {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Catalogue preview. Your bag resets on refresh. Checkout will be available in a later increment.</p>
          </aside>
        </div>
      </main>
      <footer className="flex flex-wrap justify-between gap-3 border-t py-6 text-xs text-muted-foreground"><span>CampusCart · Made for campus life.</span><span>Sample products · Prices in BDT</span></footer>
    </div>
  );
}
