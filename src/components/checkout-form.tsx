"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CircleAlert, LoaderCircle, ShoppingBag } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useShop } from "@/components/shop-provider";
import { cartTotal } from "@/lib/cart";
import { formatPrice } from "@/lib/products";

const paymentOptions = [
  { value: "CASH_ON_DELIVERY", label: "Cash on delivery", hint: "Pay when your order arrives." },
  { value: "CAMPUS_WALLET", label: "Campus wallet (simulated)", hint: "Test wallet. Declines orders above BDT 5,000. No real money moves." },
];

export function CheckoutForm() {
  const router = useRouter();
  const { cart, clear } = useShop();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: form.get("name"), email: form.get("email") },
          address: form.get("address"),
          promoCode: form.get("promoCode") || undefined,
          paymentMethod: form.get("paymentMethod"),
          items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "We could not place your order.");
      clear();
      router.push(`/orders/${encodeURIComponent(result.orderId)}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We could not place your order.");
      setSubmitting(false);
    }
  }

  if (cart.length === 0 && !submitting) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-md items-center px-6">
        <Empty>
          <EmptyHeader><EmptyMedia variant="icon"><ShoppingBag aria-hidden="true" /></EmptyMedia><EmptyTitle>Your bag is empty</EmptyTitle><EmptyDescription>Add a few essentials before checking out.</EmptyDescription></EmptyHeader>
          <Button variant="outline" render={<Link href="/#collection" />}><ArrowLeft aria-hidden="true" className="size-4" />Back to the collection</Button>
        </Empty>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.2fr_1fr]">
      <form onSubmit={submit} className="space-y-6" aria-label="Checkout">
        <div><h1 className="text-3xl font-medium tracking-tight">Checkout</h1><p className="mt-2 text-sm text-muted-foreground">Prices and stock are checked again when you place the order.</p></div>
        <label className="block space-y-2 text-sm font-medium">Full name<Input name="name" required autoComplete="name" className="h-10" /></label>
        <label className="block space-y-2 text-sm font-medium">Email<Input name="email" type="email" required autoComplete="email" className="h-10" /></label>
        <label className="block space-y-2 text-sm font-medium">Delivery address<textarea name="address" required minLength={10} rows={3} autoComplete="street-address" className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" /></label>
        <label className="block space-y-2 text-sm font-medium">Promo code <span className="font-normal text-muted-foreground">(optional, e.g. STUDENT10)</span><Input name="promoCode" autoComplete="off" className="h-10 uppercase" /></label>
        <fieldset className="space-y-3">
          <legend className="mb-2 text-sm font-medium">Payment</legend>
          {paymentOptions.map((option, index) => (
            <label key={option.value} className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm has-checked:border-primary">
              <input type="radio" name="paymentMethod" value={option.value} defaultChecked={index === 0} className="mt-1 accent-primary" />
              <span><span className="font-medium">{option.label}</span><span className="block text-xs text-muted-foreground">{option.hint}</span></span>
            </label>
          ))}
        </fieldset>
        {error && <Alert variant="destructive" role="alert"><CircleAlert aria-hidden="true" /><AlertDescription>{error}</AlertDescription></Alert>}
        <Button type="submit" disabled={submitting} className="h-12 w-full rounded-full">{submitting && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}Place order</Button>
      </form>
      <aside aria-label="Order summary" className="h-fit rounded-2xl border bg-card p-6">
        <h2 className="font-medium">Your bag</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {cart.map((item) => <li key={item.id} className="flex justify-between gap-4"><span>{item.name} × {item.quantity}</span><span className="tabular-nums">{formatPrice(item.price * item.quantity)}</span></li>)}
        </ul>
        <Separator className="my-4" />
        <p className="flex justify-between font-semibold"><span>Subtotal</span><span>{formatPrice(cartTotal(cart))}</span></p>
        <p className="mt-2 text-xs text-muted-foreground">Any promo discount is applied when the order is placed.</p>
      </aside>
    </main>
  );
}
