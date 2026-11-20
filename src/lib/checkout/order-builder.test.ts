import { describe, expect, it } from "vitest";
import { OrderBuilder } from "./order-builder";
import { PercentageDiscount } from "./discount";

const notebook = { id: "notebook", name: "Everyday notebook", price: 12000, stock: 20 };
const pens = { id: "pens", name: "Black ink pen set", price: 8000, stock: 2 };

function validBuilder() {
  return new OrderBuilder().forCustomer("Rahim", "rahim@student.ruet.ac.bd").deliverTo("Hall 3, RUET, Rajshahi");
}

describe("OrderBuilder", () => {
  it("builds an order with price snapshots, subtotal, discount and total", () => {
    const order = validBuilder()
      .addLine(notebook, 2)
      .addLine(pens, 1)
      .applyDiscount(new PercentageDiscount("STUDENT10", "Student 10% off", 10))
      .build();

    expect(order.lines).toEqual([
      { productId: "notebook", name: "Everyday notebook", unitPrice: 12000, quantity: 2 },
      { productId: "pens", name: "Black ink pen set", unitPrice: 8000, quantity: 1 },
    ]);
    expect(order.subtotal).toBe(32000);
    expect(order.discount).toBe(3200);
    expect(order.total).toBe(28800);
    expect(order.promoCode).toBe("STUDENT10");
    expect(order.customer.email).toBe("rahim@student.ruet.ac.bd");
  });

  it("merges repeated lines for the same product", () => {
    const order = validBuilder().addLine(notebook, 1).addLine(notebook, 2).build();
    expect(order.lines).toHaveLength(1);
    expect(order.lines[0].quantity).toBe(3);
  });

  it("rejects quantities above stock", () => {
    expect(() => validBuilder().addLine(pens, 3)).toThrow("Only 2 of Black ink pen set left in stock");
  });

  it("rejects non-positive or fractional quantities", () => {
    for (const quantity of [0, -1, 1.5]) expect(() => validBuilder().addLine(notebook, quantity)).toThrow("Invalid quantity");
  });

  it("requires at least one line", () => {
    expect(() => validBuilder().build()).toThrow("Your bag is empty");
  });

  it("requires a customer name, a valid email and a delivery address", () => {
    expect(() => new OrderBuilder().deliverTo("Hall 3, RUET").addLine(notebook, 1).build()).toThrow("Customer details are required");
    expect(() => new OrderBuilder().forCustomer("Rahim", "not-an-email")).toThrow("Enter a valid email address");
    expect(() => new OrderBuilder().forCustomer(" ", "a@b.co")).toThrow("Enter your name");
    expect(() => validBuilder().deliverTo("RUET")).toThrow("Enter a full delivery address");
    expect(() => new OrderBuilder().forCustomer("Rahim", "a@b.co").addLine(notebook, 1).build()).toThrow("Delivery address is required");
  });
});
