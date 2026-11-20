/**
 * Applies a promotional code to a bag subtotal (in paisa) and returns the discount.
 * First approach: every promotion is a branch in one switch statement.
 */
export function promoDiscount(subtotal: number, code?: string): number {
  switch ((code ?? "").trim().toUpperCase()) {
    case "":
      return 0;
    case "STUDENT10":
      return Math.floor(subtotal * 0.1);
    case "SAVE50":
      return subtotal >= 100000 ? 5000 : 0;
    default:
      throw new Error("Promo code not recognised");
  }
}
