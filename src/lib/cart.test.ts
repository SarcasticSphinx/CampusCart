import { describe, expect, it } from "vitest";
import { addToCart, cartTotal, setQuantity } from "./cart";

const product = { id: "notebook", name: "Notebook", category: "Stationery", price: 12000, stock: 2 };

describe("cart", () => {
  it("adds a product and merges repeated additions", () => {
    const cart = addToCart(addToCart([], product), product);
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
    expect(cartTotal(cart)).toBe(24000);
  });
  it("does not exceed available stock", () => {
    expect(() => addToCart([{ ...product, quantity: 2 }], product)).toThrow("Not enough stock");
    expect(() => addToCart([], { ...product, stock: 0 })).toThrow("Not enough stock");
  });
  it("removes a line when its quantity becomes zero", () => {
    expect(setQuantity([{ ...product, quantity: 1 }], product.id, 0)).toEqual([]);
  });
  it("rejects invalid quantities", () => {
    for (const quantity of [-1, 1.5, NaN, Infinity, 3]) {
      expect(() => setQuantity([{ ...product, quantity: 1 }], product.id, quantity)).toThrow();
    }
  });
  it("updates quantities without mutating the input", () => {
    const cart = [{ ...product, quantity: 1 }];
    expect(setQuantity(cart, product.id, 2)[0].quantity).toBe(2);
    expect(cart[0].quantity).toBe(1);
  });
  it("returns zero for an empty cart", () => {
    expect(cartTotal([])).toBe(0);
  });
});
