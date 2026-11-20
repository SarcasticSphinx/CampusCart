import { beforeEach, describe, expect, it, vi } from "vitest";
import { CheckoutError, CheckoutService, type CheckoutRepository, type CheckoutRequest } from "./checkout-service";
import { PaymentDeclinedError, type PaymentGateway } from "./payment";

const products = [
  { id: "notebook", name: "Everyday notebook", price: 12000, stock: 20 },
  { id: "pens", name: "Black ink pen set", price: 8000, stock: 30 },
];

const request: CheckoutRequest = {
  customer: { name: "Rahim", email: "rahim@student.ruet.ac.bd" },
  address: "Hall 3, RUET, Rajshahi",
  items: [{ productId: "notebook", quantity: 2 }, { productId: "pens", quantity: 1 }],
  promoCode: "STUDENT10",
  paymentMethod: "CAMPUS_WALLET",
};

// The database and the payment provider are replaced with mocks so the service is tested in isolation.
function mockRepository(): CheckoutRepository {
  return {
    findProducts: vi.fn().mockResolvedValue(products),
    createPendingOrder: vi.fn().mockResolvedValue({ id: "order-1" }),
    confirmOrder: vi.fn().mockResolvedValue(undefined),
    cancelOrder: vi.fn().mockResolvedValue(undefined),
  };
}

function mockGateway(method: PaymentGateway["method"]): PaymentGateway {
  return { method, charge: vi.fn().mockResolvedValue({ method, status: "PAID", reference: "TX-1" }) };
}

describe("CheckoutService", () => {
  let repository: CheckoutRepository;
  let wallet: PaymentGateway;
  let cash: PaymentGateway;
  let service: CheckoutService;

  beforeEach(() => {
    repository = mockRepository();
    wallet = mockGateway("CAMPUS_WALLET");
    cash = mockGateway("CASH_ON_DELIVERY");
    service = new CheckoutService(repository, [cash, wallet]);
  });

  it("prices the order from the database, reserves stock, charges the chosen gateway and confirms", async () => {
    const confirmation = await service.placeOrder(request);

    expect(repository.findProducts).toHaveBeenCalledWith(["notebook", "pens"]);
    const draft = vi.mocked(repository.createPendingOrder).mock.calls[0][0];
    expect(draft.total).toBe(28800);
    expect(wallet.charge).toHaveBeenCalledWith(28800, "order-1");
    expect(cash.charge).not.toHaveBeenCalled();
    expect(repository.confirmOrder).toHaveBeenCalledWith("order-1", { method: "CAMPUS_WALLET", status: "PAID", reference: "TX-1" });
    expect(confirmation).toEqual({ orderId: "order-1", subtotal: 32000, discount: 3200, total: 28800, paymentStatus: "PAID", paymentReference: "TX-1" });
  });

  it("ignores client-sent prices and uses database prices", async () => {
    const tampered = { ...request, items: [{ productId: "notebook", quantity: 1, price: 1 }] } as unknown as CheckoutRequest;
    const confirmation = await service.placeOrder({ ...tampered, promoCode: undefined });
    expect(confirmation.total).toBe(12000);
  });

  it("rejects products that no longer exist without touching the database or payment", async () => {
    await expect(service.placeOrder({ ...request, items: [{ productId: "ghost", quantity: 1 }] })).rejects.toThrow(CheckoutError);
    expect(repository.createPendingOrder).not.toHaveBeenCalled();
    expect(wallet.charge).not.toHaveBeenCalled();
  });

  it("rejects an unsupported payment method", async () => {
    await expect(service.placeOrder({ ...request, paymentMethod: "CARD" as CheckoutRequest["paymentMethod"] })).rejects.toThrow("Unsupported payment method");
  });

  it("cancels the reserved order and releases stock when the payment is declined", async () => {
    vi.mocked(wallet.charge).mockRejectedValue(new PaymentDeclinedError("Insufficient balance"));

    await expect(service.placeOrder(request)).rejects.toThrow("Insufficient balance");
    expect(repository.cancelOrder).toHaveBeenCalledWith("order-1");
    expect(repository.confirmOrder).not.toHaveBeenCalled();
  });

  it("returns a pending payment for cash on delivery", async () => {
    vi.mocked(cash.charge).mockResolvedValue({ method: "CASH_ON_DELIVERY", status: "PENDING", reference: "COD-order-1" });
    const confirmation = await service.placeOrder({ ...request, paymentMethod: "CASH_ON_DELIVERY" });
    expect(confirmation.paymentStatus).toBe("PENDING");
  });
});
