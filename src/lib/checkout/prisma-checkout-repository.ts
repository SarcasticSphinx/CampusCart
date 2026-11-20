import "server-only";

import { getDb } from "@/lib/db";
import { CheckoutError, type CheckoutRepository } from "./checkout-service";
import type { OrderDraft } from "./order-builder";
import type { PaymentMethod, PaymentResult } from "./payment";

/** Prisma implementation of the checkout persistence boundary. */
export class PrismaCheckoutRepository implements CheckoutRepository {
  async findProducts(ids: string[]) {
    return getDb().product.findMany({ where: { id: { in: ids } }, select: { id: true, name: true, price: true, stock: true } });
  }

  async createPendingOrder(draft: OrderDraft, paymentMethod: PaymentMethod) {
    return getDb().$transaction(async (tx) => {
      // Conditional decrement: the row only changes if enough stock is still there, so two
      // customers cannot both buy the last item.
      for (const line of draft.lines) {
        const reserved = await tx.product.updateMany({
          where: { id: line.productId, stock: { gte: line.quantity } },
          data: { stock: { decrement: line.quantity } },
        });
        if (reserved.count === 0) throw new CheckoutError(`${line.name} sold out while you were checking out`, 409);
      }
      const user = await tx.user.upsert({
        where: { email: draft.customer.email },
        create: { email: draft.customer.email, name: draft.customer.name },
        update: { name: draft.customer.name },
      });
      return tx.order.create({
        data: {
          userId: user.id,
          deliveryAddress: draft.address,
          subtotal: draft.subtotal,
          discount: draft.discount,
          promoCode: draft.promoCode,
          total: draft.total,
          paymentMethod,
          items: { create: draft.lines },
        },
        select: { id: true },
      });
    });
  }

  async confirmOrder(orderId: string, payment: PaymentResult) {
    await getDb().order.update({
      where: { id: orderId },
      data: { status: "CONFIRMED", paymentStatus: payment.status, paymentReference: payment.reference },
    });
  }

  async cancelOrder(orderId: string) {
    await getDb().$transaction(async (tx) => {
      const order = await tx.order.update({ where: { id: orderId }, data: { status: "CANCELLED" }, select: { items: { select: { productId: true, quantity: true } } } });
      for (const item of order.items) {
        await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
      }
    });
  }
}
