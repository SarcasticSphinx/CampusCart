import { createCheckoutService } from "@/lib/checkout";
import { CheckoutError } from "@/lib/checkout/checkout-service";
import { parseCheckoutRequest } from "@/lib/checkout/parse-request";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const confirmation = await createCheckoutService().placeOrder(parseCheckoutRequest(body));
    return Response.json(confirmation, { status: 201 });
  } catch (error) {
    if (error instanceof CheckoutError) return Response.json({ error: error.message }, { status: error.status });
    console.error("Checkout failed", error);
    return Response.json({ error: "We could not place your order. Please try again." }, { status: 500 });
  }
}
