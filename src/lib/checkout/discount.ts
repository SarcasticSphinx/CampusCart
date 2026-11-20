/**
 * Strategy pattern (behavioural).
 * Each promotion is a separate object with the same `discountFor` operation, so checkout can apply
 * any promotion without knowing its rule. A new promotion is a new class plus one registry entry.
 */
export interface DiscountStrategy {
  readonly code: string | null;
  readonly label: string;
  /** Returns the discount in paisa for a subtotal in paisa. Never more than the subtotal. */
  discountFor(subtotal: number): number;
}

export class NoDiscount implements DiscountStrategy {
  readonly code = null;
  readonly label = "No discount";
  discountFor(): number {
    return 0;
  }
}

export class PercentageDiscount implements DiscountStrategy {
  constructor(readonly code: string, readonly label: string, private readonly percent: number) {}

  discountFor(subtotal: number): number {
    return Math.floor((subtotal * this.percent) / 100);
  }
}

export class MinimumSpendDiscount implements DiscountStrategy {
  constructor(readonly code: string, readonly label: string, private readonly minimumSpend: number, private readonly amount: number) {}

  discountFor(subtotal: number): number {
    return subtotal >= this.minimumSpend ? Math.min(this.amount, subtotal) : 0;
  }
}

const promotions: DiscountStrategy[] = [
  new PercentageDiscount("STUDENT10", "Student 10% off", 10),
  new MinimumSpendDiscount("SAVE50", "BDT 50 off orders of BDT 1,000 or more", 100000, 5000),
];

export function discountForCode(code?: string | null): DiscountStrategy {
  const normalised = (code ?? "").trim().toUpperCase();
  if (!normalised) return new NoDiscount();
  const promotion = promotions.find((candidate) => candidate.code === normalised);
  if (!promotion) throw new Error("Promo code not recognised");
  return promotion;
}
