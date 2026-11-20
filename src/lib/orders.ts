import "server-only";

import { cache } from "react";
import { getDb } from "@/lib/db";

export const getOrder = cache((id: string) => getDb().order.findUnique({
  where: { id },
  select: {
    id: true, status: true, subtotal: true, discount: true, promoCode: true, total: true,
    paymentMethod: true, paymentStatus: true, paymentReference: true, deliveryAddress: true, createdAt: true,
    user: { select: { name: true } },
    items: { select: { productId: true, name: true, unitPrice: true, quantity: true } },
  },
}));
