import type { Product } from "./products";
export type CartItem = Product & { quantity: number };
export function addToCart(_cart: CartItem[], _product: Product): CartItem[] { throw new Error("Not implemented"); }
export function setQuantity(_cart: CartItem[], _id: string, _quantity: number): CartItem[] { throw new Error("Not implemented"); }
export function cartTotal(_cart: CartItem[]): number { throw new Error("Not implemented"); }
