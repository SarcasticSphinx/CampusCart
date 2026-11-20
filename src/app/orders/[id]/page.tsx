import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { ArrowLeft, CircleCheck, LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/products";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Order confirmed | CampusCart" };

const paymentLabels = { CASH_ON_DELIVERY: "Cash on delivery", CAMPUS_WALLET: "Campus wallet (simulated)" } as const;

async function OrderContent({ params }: Props) {
  await connection();
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 sm:px-8">
      <CircleCheck aria-hidden="true" className="size-10 text-primary" />
      <h1 className="mt-4 text-3xl font-medium tracking-tight">Thank you, {order.user.name}.</h1>
      <p className="mt-2 text-sm text-muted-foreground">Order <span className="font-mono" data-testid="order-id">{order.id}</span> · <Badge variant="secondary" data-testid="order-status">{order.status}</Badge></p>
      <ul className="mt-8 space-y-3 text-sm">
        {order.items.map((item) => <li key={item.productId} className="flex justify-between gap-4"><span>{item.name} × {item.quantity}</span><span className="tabular-nums">{formatPrice(item.unitPrice * item.quantity)}</span></li>)}
      </ul>
      <Separator className="my-5" />
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
        {order.discount > 0 && <div className="flex justify-between text-primary"><dt>Discount ({order.promoCode})</dt><dd data-testid="order-discount">−{formatPrice(order.discount)}</dd></div>}
        <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd data-testid="order-total">{formatPrice(order.total)}</dd></div>
        <div className="flex justify-between text-muted-foreground"><dt>Payment</dt><dd>{paymentLabels[order.paymentMethod]} · {order.paymentStatus === "PAID" ? "Paid" : "Due on delivery"}</dd></div>
        <div className="flex justify-between gap-6 text-muted-foreground"><dt>Deliver to</dt><dd className="text-right">{order.deliveryAddress}</dd></div>
      </dl>
      <Button variant="outline" render={<Link href="/#collection" />} className="mt-10"><ArrowLeft aria-hidden="true" className="size-4" />Continue shopping</Button>
    </main>
  );
}

export default function OrderPage(props: Props) {
  return <Suspense fallback={<main className="flex min-h-[60vh] items-center justify-center gap-2 text-sm text-muted-foreground" role="status"><LoaderCircle aria-hidden="true" className="size-4 animate-spin" />Loading your order…</main>}><OrderContent {...props} /></Suspense>;
}
