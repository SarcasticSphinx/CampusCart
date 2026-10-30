"use client";

import { CircleAlert, Minus, Plus, ShoppingBag } from "lucide-react";
import { ProductImage } from "@/components/product-image";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { CartItem } from "@/lib/cart";
import { cartTotal } from "@/lib/cart";
import { formatPrice, type Product } from "@/lib/products";

type BagSidebarProps = {
  cart: CartItem[];
  error: string;
  onAdd: (product: Product) => void;
  onQuantityChange: (id: string, quantity: number) => void;
};

export function BagSidebar({ cart, error, onAdd, onQuantityChange }: BagSidebarProps) {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" aria-label={`Open bag, ${count} items`} />}>
        <ShoppingBag aria-hidden="true" className="size-4" />
        Your bag <Badge variant="secondary">{count}</Badge>
      </SheetTrigger>
      <SheetContent side="right" className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        <SheetHeader className="p-6 pr-12">
          <SheetTitle className="flex items-center gap-2"><ShoppingBag aria-hidden="true" className="size-5" />Your bag <Badge variant="secondary">{count}</Badge></SheetTitle>
          <SheetDescription>Your campus essentials, all in one place.</SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="min-h-0 flex-1 overflow-y-auto p-6" aria-live="polite">
          {cart.length === 0 ? (
            <Empty className="h-full px-0">
              <EmptyHeader>
                <EmptyMedia variant="icon"><ShoppingBag aria-hidden="true" /></EmptyMedia>
                <EmptyTitle>Your bag is empty</EmptyTitle>
                <EmptyDescription>Add a few essentials to get ready for campus.</EmptyDescription>
              </EmptyHeader>
              <SheetClose render={<Button variant="outline" />}>Continue shopping</SheetClose>
            </Empty>
          ) : (
            <ul className="space-y-6">
              {cart.map((item) => (
                <li key={item.id} className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3"><div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted"><ProductImage product={item} sizes="64px" /></div><div><p className="font-medium">{item.name}</p><p className="mt-1 text-xs text-muted-foreground">{formatPrice(item.price)} each</p></div></div>
                    <span className="shrink-0 font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon-sm" aria-label={`Decrease ${item.name} quantity`} onClick={() => onQuantityChange(item.id, item.quantity - 1)}><Minus aria-hidden="true" /></Button>
                    <span className="min-w-4 text-center tabular-nums">{item.quantity}</span>
                    <Button variant="outline" size="icon-sm" disabled={item.quantity >= item.stock} aria-label={`Increase ${item.name} quantity`} onClick={() => onAdd(item)}><Plus aria-hidden="true" /></Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {error && <Alert variant="destructive" className="mt-4"><CircleAlert aria-hidden="true" /><AlertDescription>{error}</AlertDescription></Alert>}
        </div>
        <Separator />
        <SheetFooter className="gap-4 p-6">
          <div className="flex justify-between font-semibold"><span>Subtotal</span><span>{formatPrice(cartTotal(cart))}</span></div>
          {cart.length > 0 && <SheetClose render={<Button variant="outline" />}>Continue shopping</SheetClose>}
          <p className="text-xs leading-relaxed text-muted-foreground">Your bag resets on refresh. Checkout will be available in a later increment.</p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
