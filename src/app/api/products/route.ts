import { getDb } from "@/lib/db";

export async function GET() {
  const products = await getDb().product.findMany({
    select: { id: true, name: true, category: true, price: true, stock: true, imageUrl: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
  return Response.json(products);
}
