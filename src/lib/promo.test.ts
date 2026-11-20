import { describe, expect, it } from "vitest";
import { promoDiscount } from "./promo";

describe("promoDiscount", () => {
  it("gives no discount without a code", () => {
    expect(promoDiscount(24000)).toBe(0);
  });
  it("takes 10% off with STUDENT10", () => {
    expect(promoDiscount(24000, "student10")).toBe(2400);
  });
  it("takes BDT 50 off orders of BDT 1,000 or more with SAVE50", () => {
    expect(promoDiscount(100000, "SAVE50")).toBe(5000);
    expect(promoDiscount(99999, "SAVE50")).toBe(0);
  });
  it("rejects unknown codes", () => {
    expect(() => promoDiscount(24000, "FREE")).toThrow("Promo code not recognised");
  });
});
