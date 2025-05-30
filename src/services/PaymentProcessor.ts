export interface PaymentDetails {
  amount: number;
  currency: string;
  customerId: string;
  paymentMethod: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  timestamp: Date;
  error?: string;
}

export abstract class PaymentProcessor {
  abstract processPayment(details: PaymentDetails): Promise<PaymentResult>;
  abstract refundPayment(transactionId: string, amount: number): Promise<PaymentResult>;
  abstract getTransactionStatus(transactionId: string): Promise<PaymentResult>;

  // A concrete method that can be used by all implementations
  protected validateAmount(amount: number): boolean {
    return amount > 0 && amount <= 1000000; // Example validation
  }
}
