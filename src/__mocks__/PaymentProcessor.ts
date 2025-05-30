import { PaymentDetails, PaymentProcessor, PaymentResult } from "../services/PaymentProcessor";

// Create a mock implementation of the abstract class
export class MockPaymentProcessor extends PaymentProcessor {
  // Mock the abstract methods
  async processPayment(details: PaymentDetails): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: `mock_${Date.now()}`,
      timestamp: new Date(),
    };
  }

  async refundPayment(transactionId: string, amount: number): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: `refund_${transactionId}`,
      timestamp: new Date(),
    };
  }

  async getTransactionStatus(transactionId: string): Promise<PaymentResult> {
    return {
      success: true,
      transactionId,
      timestamp: new Date(),
    };
  }

  // Override the protected method to make it testable
  protected validateAmount(amount: number): boolean {
    return true; // Default implementation, can be overridden in tests
  }
}
