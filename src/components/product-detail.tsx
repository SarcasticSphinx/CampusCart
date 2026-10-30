"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Plus, ShoppingBag, ZoomIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductImage } from "@/components/product-image";
import { useShop } from "@/components/shop-provider";
import { formatPrice, type Product } from "@/lib/products";

type ProductDetailProps = {
  product: Product & { description: string | null };
  specifications: [string, string][];
  companions: Product[];
};

export function ProductDetail({ product, specifications, companions }: ProductDetailProps) {
  const { cart, add, setBagOpen } = useShop();
  const quantity = cart.find((item) => item.id === product.id)?.quantity ?? 0;

  return (
    <main className="mx-auto max-w-7xl px-5 pb-12 pt-7 sm:px-8 lg:px-12">
      <Breadcrumb className="mb-8"><BreadcrumbList><BreadcrumbItem><BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink render={<Link href="/#collection" />}>The collection</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>{product.name}</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
      <section className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
        <Dialog>
          <DialogTrigger aria-label={`Enlarge photo of ${product.name}`} className="group relative block aspect-square w-full overflow-hidden rounded-2xl bg-white outline-offset-4">
            <ProductImage product={product} sizes="(max-width: 1024px) 100vw, 50vw" fit="contain" preload />
            <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border bg-background/95 px-3 py-2 text-xs"><ZoomIn aria-hidden="true" className="size-4" />Take a closer look</span>
          </DialogTrigger>
          <DialogContent className="max-h-[90dvh] sm:max-w-3xl">
            <DialogHeader><DialogTitle>{product.name}</DialogTitle><DialogDescription>Product photograph. Select Close or press Escape to return.</DialogDescription></DialogHeader>
            <div className="relative h-[65dvh] overflow-hidden rounded-lg bg-white"><ProductImage product={product} fit="contain" sizes="(max-width: 768px) 90vw, 768px" /></div>
          </DialogContent>
        </Dialog>
        <div className="lg:py-4">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-normal">{product.category}</Badge>
          <h1 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.04em] sm:text-5xl">{product.name}</h1>
          <p className="mt-4 text-2xl font-medium text-primary">{formatPrice(product.price)}</p>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">{product.description ?? "More product information will be available soon."}</p>
          <Separator className="my-6" />
          <p className="flex items-center gap-2 text-sm"><Check aria-hidden="true" className="size-4 text-primary" />{product.stock > 0 ? `In stock · ${product.stock} available` : "Currently out of stock"}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button className="h-12 flex-1 rounded-full px-6" disabled={quantity >= product.stock} onClick={() => add(product)}><Plus aria-hidden="true" className="size-4" />{product.stock === 0 ? "Out of stock" : quantity >= product.stock ? "Stock limit reached" : "Add to bag"}</Button>
            {quantity > 0 && <Button variant="outline" className="h-12 rounded-full px-5" onClick={() => setBagOpen(true)}><ShoppingBag aria-hidden="true" className="size-4" />View bag ({quantity})</Button>}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Product code: {product.id.toUpperCase()} · Prices in BDT</p>
          <section aria-labelledby="specifications-heading" className="mt-8">
            <h2 id="specifications-heading" className="mb-4 text-lg font-medium">The details that matter.</h2>
            <div className="overflow-hidden rounded-xl border bg-card">
              <Table aria-label={`${product.name} specifications`}><TableHeader><TableRow><TableHead className="px-4">Specification</TableHead><TableHead className="px-4">Details</TableHead></TableRow></TableHeader><TableBody>{(specifications.length ? specifications : [["Category", product.category]]).map(([label, value]) => <TableRow key={label}><TableCell className="w-2/5 whitespace-normal px-4 py-3 font-medium">{label}</TableCell><TableCell className="whitespace-normal px-4 py-3 text-muted-foreground">{value}</TableCell></TableRow>)}</TableBody></Table>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Specifications describe the sample catalogue. <Link href="/credits" className="underline underline-offset-2">Product photography is illustrative.</Link></p>
          </section>
        </div>
      </section>
      {companions.length > 0 && <section className="mt-14 border-t pt-9" aria-labelledby="companions-heading"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h2 id="companions-heading" className="text-2xl font-medium tracking-tight">A few good companions.</h2><Link href="/#collection" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">View the collection<ArrowUpRight aria-hidden="true" className="size-4" /></Link></div><div className="grid gap-6 sm:grid-cols-3">{companions.map((item) => <Card key={item.id} className="group gap-0 rounded-none bg-transparent py-0 ring-0"><Link href={`/products/${encodeURIComponent(item.id)}`} aria-label={`View ${item.name}`} className="relative block aspect-[1.3] overflow-hidden rounded-xl bg-white"><ProductImage product={item} /></Link><CardContent className="px-0 pt-3"><h3 className="font-medium"><Link href={`/products/${encodeURIComponent(item.id)}`} className="hover:underline underline-offset-4">{item.name}</Link></h3><p className="mt-1 text-sm text-muted-foreground">{formatPrice(item.price)}</p></CardContent></Card>)}</div></section>}
      <Button variant="ghost" render={<Link href="/#collection" />} className="mt-8"><ArrowLeft aria-hidden="true" className="size-4" />Back to the collection</Button>
    </main>
  );
}
