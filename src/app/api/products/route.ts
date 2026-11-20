import { connection } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  // Stock changes with every order, so this must run per request, never be prerendered at build time.
  await connection();
  const products = await getDb().product.findMany({
    select: { id: true, name: true, category: true, price: true, stock: true, imageUrl: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
  return Response.json(products);
}
