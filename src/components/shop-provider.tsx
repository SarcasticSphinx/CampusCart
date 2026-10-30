"use client";

import { createContext, useContext, useState } from "react";
import { addToCart, setQuantity, type CartItem } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { toast } from "@/components/ui/toast";

type ShopState = {
  cart: CartItem[];
  error: string;
  bagOpen: boolean;
  setBagOpen: (open: boolean) => void;
  add: (product: Product) => void;
  changeQuantity: (id: string, quantity: number) => void;
};

const ShopContext = createContext<ShopState | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [error, setError] = useState("");
  const [bagOpen, setBagOpen] = useState(false);

  function add(product: Product) {
    try {
      setCart(addToCart(cart, product));
      setError("");
      const id = toast.add({
        type: "success",
        title: "Added to your bag",
        description: product.name,
        timeout: 5000,
        actionProps: {
          children: "View bag",
          onClick: () => { setBagOpen(true); toast.close(id); },
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to add item.";
      setError(message);
      toast.add({ type: "error", title: "Could not add item", description: message });
    }
  }

  function changeQuantity(id: string, quantity: number) {
    try { setCart(setQuantity(cart, id, quantity)); setError(""); }
    catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update quantity.";
      setError(message);
      toast.add({ type: "error", title: "Could not update bag", description: message });
    }
  }

  return <ShopContext.Provider value={{ cart, error, bagOpen, setBagOpen, add, changeQuantity }}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const shop = useContext(ShopContext);
  if (!shop) throw new Error("useShop must be used within ShopProvider");
  return shop;
}
