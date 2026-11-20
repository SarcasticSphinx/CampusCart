import { describe, expect, it, vi } from "vitest";
import { CampusWalletAdapter, CampusWalletSimulator, CashOnDeliveryGateway, PaymentDeclinedError } from "./payment";

describe("payment gateways", () => {
  it("cash on delivery leaves the payment pending", async () => {
    await expect(new CashOnDeliveryGateway().charge(24000, "CC-1")).resolves.toEqual({
      method: "CASH_ON_DELIVERY", status: "PENDING", reference: "COD-CC-1",
    });
  });

  it("adapts the wallet API: paisa become a taka string and the transaction id becomes the reference", async () => {
    const wallet = { makePayment: vi.fn().mockResolvedValue({ code: "00", transactionId: "TX-9", message: "Approved" }) };
    const gateway = new CampusWalletAdapter(wallet as unknown as CampusWalletSimulator);

    const result = await gateway.charge(21600, "CC-2");

    expect(wallet.makePayment).toHaveBeenCalledWith({ totalTaka: "216.00", merchantRef: "CC-2" });
    expect(result).toEqual({ method: "CAMPUS_WALLET", status: "PAID", reference: "TX-9" });
  });

  it("turns a wallet decline into a PaymentDeclinedError", async () => {
    const wallet = { makePayment: vi.fn().mockResolvedValue({ code: "51", transactionId: "", message: "Insufficient balance" }) };
    const gateway = new CampusWalletAdapter(wallet as unknown as CampusWalletSimulator);

    await expect(gateway.charge(900000, "CC-3")).rejects.toThrow(PaymentDeclinedError);
  });

  it("the simulator approves within its limit and declines above it", async () => {
    const wallet = new CampusWalletSimulator(5000);
    await expect(wallet.makePayment({ totalTaka: "5000.00", merchantRef: "A" })).resolves.toMatchObject({ code: "00" });
    await expect(wallet.makePayment({ totalTaka: "5000.01", merchantRef: "B" })).resolves.toMatchObject({ code: "51" });
  });
});
