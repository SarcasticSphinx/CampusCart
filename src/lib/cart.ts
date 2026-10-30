import type { Product } from "./products";

export type CartItem = Product & { quantity: number };

export function addToCart(cart: CartItem[], product: Product): CartItem[] {
  const existing = cart.find((item) => item.id === product.id);
  const quantity = (existing?.quantity ?? 0) + 1;
  if (quantity > product.stock) throw new Error("Not enough stock");
  return existing
    ? cart.map((item) => item.id === product.id ? { ...product, quantity } : item)
    : [...cart, { ...product, quantity }];
}

export function setQuantity(cart: CartItem[], id: string, quantity: number): CartItem[] {
  if (!Number.isInteger(quantity) || quantity < 0) throw new Error("Invalid quantity");
  if (quantity === 0) return cart.filter((item) => item.id !== id);
  return cart.map((item) => {
    if (item.id !== id) return item;
    if (quantity > item.stock) throw new Error("Not enough stock");
    return { ...item, quantity };
  });
}

export function cartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}
