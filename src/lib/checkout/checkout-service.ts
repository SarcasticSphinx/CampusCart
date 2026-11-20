import { discountForCode } from "./discount";
import { OrderBuilder, type OrderDraft, type OrderProduct } from "./order-builder";
import { PaymentDeclinedError, type PaymentGateway, type PaymentMethod, type PaymentResult, type PaymentStatus } from "./payment";

export type CheckoutRequest = {
  customer: { name: string; email: string };
  address: string;
  items: { productId: string; quantity: number }[];
  promoCode?: string;
  paymentMethod: PaymentMethod;
};

export type OrderConfirmation = {
  orderId: string;
  subtotal: number;
  discount: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentReference: string;
};

/** Persistence boundary. The Prisma implementation lives in prisma-checkout-repository.ts. */
export interface CheckoutRepository {
  findProducts(ids: string[]): Promise<OrderProduct[]>;
  /** Saves the order as PENDING and reserves stock atomically. Throws OutOfStockError if stock ran out. */
  createPendingOrder(draft: OrderDraft, paymentMethod: PaymentMethod): Promise<{ id: string }>;
  confirmOrder(orderId: string, payment: PaymentResult): Promise<void>;
  /** Marks the order CANCELLED and returns its reserved stock. */
  cancelOrder(orderId: string): Promise<void>;
}

/** An error whose message is safe to show to the customer. */
export class CheckoutError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
    this.name = "CheckoutError";
  }
}

export class CheckoutService {
  private readonly gateways: Map<PaymentMethod, PaymentGateway>;

  constructor(private readonly repository: CheckoutRepository, gateways: PaymentGateway[]) {
    this.gateways = new Map(gateways.map((gateway) => [gateway.method, gateway]));
  }

  async placeOrder(request: CheckoutRequest): Promise<OrderConfirmation> {
    const gateway = this.gateways.get(request.paymentMethod);
    if (!gateway) throw new CheckoutError("Unsupported payment method");

    const draft = await this.buildDraft(request);
    const { id } = await this.repository.createPendingOrder(draft, gateway.method);

    let payment: PaymentResult;
    try {
      payment = await gateway.charge(draft.total, id);
    } catch (error) {
      await this.repository.cancelOrder(id);
      if (error instanceof PaymentDeclinedError) throw new CheckoutError(error.message, 402);
      throw error;
    }

    await this.repository.confirmOrder(id, payment);
    return { orderId: id, subtotal: draft.subtotal, discount: draft.discount, total: draft.total, paymentStatus: payment.status, paymentReference: payment.reference };
  }

  private async buildDraft(request: CheckoutRequest): Promise<OrderDraft> {
    const ids = [...new Set(request.items.map((item) => item.productId))];
    const products = new Map((await this.repository.findProducts(ids)).map((product) => [product.id, product]));
    try {
      const builder = new OrderBuilder().forCustomer(request.customer.name, request.customer.email).deliverTo(request.address);
      for (const item of request.items) {
        const product = products.get(item.productId);
        if (!product) throw new CheckoutError("A product in your bag is no longer available", 409);
        builder.addLine(product, item.quantity);
      }
      return builder.applyDiscount(discountForCode(request.promoCode)).build();
    } catch (error) {
      if (error instanceof CheckoutError) throw error;
      throw new CheckoutError(error instanceof Error ? error.message : "Invalid order");
    }
  }
}
