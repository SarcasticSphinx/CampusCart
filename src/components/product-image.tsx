"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/products";

export function ProductImage({ product, sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" }: { product: Product; sizes?: string }) {
  const [failed, setFailed] = useState(false);
  return product.imageUrl && !failed ? (
    <Image src={product.imageUrl} alt={product.name} fill sizes={sizes} className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" onError={() => setFailed(true)} />
  ) : (
    <div className="flex h-full items-center justify-center bg-muted"><Package aria-hidden="true" className="size-10 text-muted-foreground" /><span className="sr-only">{product.name}: image unavailable</span></div>
  );
}
