/**
 * Adapter pattern (structural).
 * Checkout depends only on `PaymentGateway`. `CampusWalletSimulator` stands in for a third-party
 * wallet whose API uses taka strings and result codes; `CampusWalletAdapter` translates between them.
 * The simulator moves no real money.
 */
export type PaymentMethod = "CASH_ON_DELIVERY" | "CAMPUS_WALLET";
export type PaymentStatus = "PENDING" | "PAID";

export type PaymentResult = { method: PaymentMethod; status: PaymentStatus; reference: string };

export interface PaymentGateway {
  readonly method: PaymentMethod;
  /** Charges an amount in paisa for an order reference. Throws PaymentDeclinedError when refused. */
  charge(amount: number, orderReference: string): Promise<PaymentResult>;
}

export class PaymentDeclinedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentDeclinedError";
  }
}

export class CashOnDeliveryGateway implements PaymentGateway {
  readonly method = "CASH_ON_DELIVERY" as const;

  async charge(_amount: number, orderReference: string): Promise<PaymentResult> {
    return { method: this.method, status: "PENDING", reference: `COD-${orderReference}` };
  }
}

type WalletRequest = { totalTaka: string; merchantRef: string };
type WalletResponse = { code: "00" | "51"; transactionId: string; message: string };

/** Simulated external wallet with an interface CampusCart does not control. */
export class CampusWalletSimulator {
  constructor(private readonly balanceLimitTaka = 5000) {}

  async makePayment({ totalTaka, merchantRef }: WalletRequest): Promise<WalletResponse> {
    if (Number(totalTaka) > this.balanceLimitTaka) return { code: "51", transactionId: "", message: "Insufficient wallet balance" };
    return { code: "00", transactionId: `CW-${merchantRef}`, message: "Approved" };
  }
}

export class CampusWalletAdapter implements PaymentGateway {
  readonly method = "CAMPUS_WALLET" as const;

  constructor(private readonly wallet: CampusWalletSimulator) {}

  async charge(amount: number, orderReference: string): Promise<PaymentResult> {
    const response = await this.wallet.makePayment({ totalTaka: (amount / 100).toFixed(2), merchantRef: orderReference });
    if (response.code !== "00") throw new PaymentDeclinedError(response.message);
    return { method: this.method, status: "PAID", reference: response.transactionId };
  }
}
