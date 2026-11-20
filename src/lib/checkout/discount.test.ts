import { describe, expect, it } from "vitest";
import { MinimumSpendDiscount, NoDiscount, PercentageDiscount, discountForCode } from "./discount";

describe("discount strategies", () => {
  it("NoDiscount never reduces the subtotal", () => {
    expect(new NoDiscount().discountFor(24000)).toBe(0);
  });

  it("PercentageDiscount rounds down to whole paisa", () => {
    expect(new PercentageDiscount("STUDENT10", "Student 10% off", 10).discountFor(12345)).toBe(1234);
  });

  it("MinimumSpendDiscount applies only at or above the threshold", () => {
    const save50 = new MinimumSpendDiscount("SAVE50", "BDT 50 off BDT 1,000+", 100000, 5000);
    expect(save50.discountFor(100000)).toBe(5000);
    expect(save50.discountFor(99999)).toBe(0);
  });

  it("never discounts more than the subtotal", () => {
    expect(new MinimumSpendDiscount("BIG", "Big", 0, 9000).discountFor(5000)).toBe(5000);
  });

  it("selects a strategy from a case-insensitive promo code", () => {
    expect(discountForCode(undefined)).toBeInstanceOf(NoDiscount);
    expect(discountForCode("  ")).toBeInstanceOf(NoDiscount);
    expect(discountForCode("student10").code).toBe("STUDENT10");
    expect(discountForCode("SAVE50").code).toBe("SAVE50");
  });

  it("rejects unknown promo codes", () => {
    expect(() => discountForCode("FREE")).toThrow("Promo code not recognised");
  });
});
