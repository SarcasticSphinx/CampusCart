import { Suspense } from "react";
import { connection } from "next/server";
import { LoaderCircle } from "lucide-react";
import { Storefront } from "@/components/storefront";
import { getDb } from "@/lib/db";

async function Catalogue() {
  await connection();
  const products = await getDb().product.findMany({
    select: { id: true, name: true, category: true, price: true, stock: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
  return <Storefront products={products} />;
}

export default function Home() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center gap-2 text-sm text-muted-foreground" role="status"><LoaderCircle aria-hidden="true" className="size-4 animate-spin" />Loading campus essentials…</main>}>
      <Catalogue />
    </Suspense>
  );
}
