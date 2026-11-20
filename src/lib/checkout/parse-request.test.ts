import { describe, expect, it } from "vitest";
import { parseCheckoutRequest } from "./parse-request";

const valid = {
  customer: { name: "Rahim", email: "rahim@student.ruet.ac.bd" },
  address: "Hall 3, RUET, Rajshahi",
  items: [{ productId: "notebook", quantity: 2, price: 1 }],
  promoCode: "STUDENT10",
  paymentMethod: "CASH_ON_DELIVERY",
};

describe("parseCheckoutRequest", () => {
  it("keeps only the fields checkout needs", () => {
    expect(parseCheckoutRequest(valid)).toEqual({ ...valid, items: [{ productId: "notebook", quantity: 2 }] });
  });

  it("rejects bodies that are not objects", () => {
    expect(() => parseCheckoutRequest(null)).toThrow("Invalid request body");
  });

  it("rejects an empty bag", () => {
    expect(() => parseCheckoutRequest({ ...valid, items: [] })).toThrow("Your bag is empty");
  });

  it("rejects unknown payment methods", () => {
    expect(() => parseCheckoutRequest({ ...valid, paymentMethod: "CARD" })).toThrow("Unsupported payment method");
  });

  it("rejects missing or oversized text fields", () => {
    expect(() => parseCheckoutRequest({ ...valid, customer: { name: "Rahim" } })).toThrow("Invalid email");
    expect(() => parseCheckoutRequest({ ...valid, address: "x".repeat(301) })).toThrow("Invalid address");
  });
});
