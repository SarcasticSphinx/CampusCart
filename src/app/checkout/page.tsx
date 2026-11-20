import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = { title: "Checkout | CampusCart" };

export default function CheckoutPage() {
  return <CheckoutForm />;
}
