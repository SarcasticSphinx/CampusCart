import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { ProductDetail } from "@/components/product-detail";
import { getProduct, specificationRows } from "@/lib/product-details";
import { getDb } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  return { title: product ? `${product.name} | CampusCart` : "Product not found | CampusCart", description: product?.description ?? undefined };
}

async function ProductContent({ params }: Props) {
  await connection();
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();
  const companions = await getDb().product.findMany({
    where: { id: { not: product.id } },
    select: { id: true, name: true, category: true, price: true, stock: true, imageUrl: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
    take: 3,
  });
  const { specifications, ...details } = product;
  return <ProductDetail product={details} specifications={specificationRows(specifications)} companions={companions} />;
}

export default function ProductPage(props: Props) {
  return <Suspense fallback={<main className="flex min-h-[60vh] items-center justify-center gap-2 text-sm text-muted-foreground" role="status"><LoaderCircle aria-hidden="true" className="size-4 animate-spin" />Loading product details…</main>}><ProductContent {...props} /></Suspense>;
}
