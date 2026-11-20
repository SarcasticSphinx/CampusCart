import { CheckoutError, type CheckoutRequest } from "./checkout-service";

const methods = ["CASH_ON_DELIVERY", "CAMPUS_WALLET"] as const;

function text(value: unknown, field: string, max: number): string {
  if (typeof value !== "string" || value.length > max) throw new CheckoutError(`Invalid ${field}`);
  return value;
}

/** Validates untrusted JSON from the client and keeps only the fields checkout needs. */
export function parseCheckoutRequest(body: unknown): CheckoutRequest {
  if (!body || typeof body !== "object") throw new CheckoutError("Invalid request body");
  const input = body as Record<string, unknown>;
  const customer = (input.customer ?? {}) as Record<string, unknown>;
  if (!Array.isArray(input.items) || input.items.length === 0 || input.items.length > 50) throw new CheckoutError("Your bag is empty");
  const items = input.items.map((item) => {
    const line = (item ?? {}) as Record<string, unknown>;
    return { productId: text(line.productId, "product", 100), quantity: Number(line.quantity) };
  });
  if (!methods.includes(input.paymentMethod as (typeof methods)[number])) throw new CheckoutError("Unsupported payment method");
  return {
    customer: { name: text(customer.name, "name", 100), email: text(customer.email, "email", 200) },
    address: text(input.address, "address", 300),
    items,
    promoCode: input.promoCode == null ? undefined : text(input.promoCode, "promo code", 30),
    paymentMethod: input.paymentMethod as CheckoutRequest["paymentMethod"],
  };
}
