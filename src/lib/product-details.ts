import "server-only";

import { cache } from "react";
import { getDb } from "@/lib/db";

export const getProduct = cache((id: string) => getDb().product.findUnique({
  where: { id },
  select: { id: true, name: true, category: true, price: true, stock: true, imageUrl: true, description: true, specifications: true },
}));

export function specificationRows(value: unknown): [string, string][] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return Object.entries(value).flatMap(([label, detail]) =>
    typeof detail === "string" || typeof detail === "number" ? [[label, String(detail)] as [string, string]] : []
  );
}
