import { NoDiscount, type DiscountStrategy } from "./discount";

/**
 * Builder pattern (creational).
 * An order needs a customer, an address, one or more priced lines and a discount, each with its own
 * validation. The builder collects these step by step and `build()` returns a complete, validated draft.
 */
export type OrderProduct = { id: string; name: string; price: number; stock: number };
export type OrderLine = { productId: string; name: string; unitPrice: number; quantity: number };
export type OrderDraft = {
  customer: { name: string; email: string };
  address: string;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  promoCode: string | null;
  total: number;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class OrderBuilder {
  private customer?: { name: string; email: string };
  private address?: string;
  private readonly lines = new Map<string, OrderLine & { stock: number }>();
  private discount: DiscountStrategy = new NoDiscount();

  forCustomer(name: string, email: string): this {
    if (!name.trim()) throw new Error("Enter your name");
    if (!EMAIL.test(email.trim())) throw new Error("Enter a valid email address");
    this.customer = { name: name.trim(), email: email.trim().toLowerCase() };
    return this;
  }

  deliverTo(address: string): this {
    if (address.trim().length < 10) throw new Error("Enter a full delivery address");
    this.address = address.trim();
    return this;
  }

  addLine(product: OrderProduct, quantity: number): this {
    if (!Number.isInteger(quantity) || quantity <= 0) throw new Error("Invalid quantity");
    const total = (this.lines.get(product.id)?.quantity ?? 0) + quantity;
    if (total > product.stock) throw new Error(`Only ${product.stock} of ${product.name} left in stock`);
    this.lines.set(product.id, { productId: product.id, name: product.name, unitPrice: product.price, quantity: total, stock: product.stock });
    return this;
  }

  applyDiscount(strategy: DiscountStrategy): this {
    this.discount = strategy;
    return this;
  }

  build(): OrderDraft {
    if (!this.customer) throw new Error("Customer details are required");
    if (!this.address) throw new Error("Delivery address is required");
    if (this.lines.size === 0) throw new Error("Your bag is empty");
    const lines = [...this.lines.values()].map(({ productId, name, unitPrice, quantity }) => ({ productId, name, unitPrice, quantity }));
    const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
    const discount = Math.min(this.discount.discountFor(subtotal), subtotal);
    return { customer: this.customer, address: this.address, lines, subtotal, discount, promoCode: this.discount.code, total: subtotal - discount };
  }
}
