import "server-only";

import { CheckoutService } from "./checkout-service";
import { CampusWalletAdapter, CampusWalletSimulator, CashOnDeliveryGateway } from "./payment";
import { PrismaCheckoutRepository } from "./prisma-checkout-repository";

/** Wires the real repository and payment gateways into the checkout service. */
export function createCheckoutService() {
  return new CheckoutService(new PrismaCheckoutRepository(), [
    new CashOnDeliveryGateway(),
    new CampusWalletAdapter(new CampusWalletSimulator()),
  ]);
}
