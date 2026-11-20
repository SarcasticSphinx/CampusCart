import { getOrder } from "@/lib/orders";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
  const { user, ...summary } = order;
  return Response.json({ ...summary, customerName: user.name, createdAt: order.createdAt.toISOString() });
}
