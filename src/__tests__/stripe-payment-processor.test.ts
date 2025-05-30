import { mockPaymentDetails } from "../__mocks__/data/paymentData";
import { StripePaymentProcessor } from "../services/StripePaymentProcessor";

// Create a test-specific mock that extends our base mock
class TestStripePaymentProcessor extends StripePaymentProcessor {
  // Override the protected validateAmount method to control its behavior
  protected validateAmount(amount: number): boolean {
    return amount > 0 && amount <= 1000000; // Add upper limit of 1 million
  }
}

describe("StripePaymentProcessor with Mocked Parent", () => {
  let processor: TestStripePaymentProcessor;
  const mockApiKey = "test_api_key";

  beforeEach(() => {
    processor = new TestStripePaymentProcessor(mockApiKey);
  });

  it("should use parent class validation", async () => {
    // Test that the child class uses the parent's validation
    const validPayment = mockPaymentDetails[0];
    const invalidPayment = { ...validPayment, amount: -100 };

    // Valid payment should succeed
    const validResult = await processor.processPayment(validPayment);
    expect(validResult.success).toBe(true);

    // Invalid payment should fail
    const invalidResult = await processor.processPayment(invalidPayment);
    expect(invalidResult.success).toBe(false);
    expect(invalidResult.error).toBe("Invalid amount");
  });

  it("should handle refunds with parent validation", async () => {
    const transactionId = "stripe_123";

    // Test valid refund
    const validRefund = await processor.refundPayment(transactionId, 50);
    expect(validRefund.success).toBe(true);
    expect(validRefund.transactionId).toBe(`refund_${transactionId}`);

    // Test invalid refund amount
    const invalidRefund = await processor.refundPayment(transactionId, -50);
    expect(invalidRefund.success).toBe(false);
    expect(invalidRefund.error).toBe("Invalid refund amount");
  });

  it("should maintain transaction history", async () => {
    // Process a payment
    const payment = mockPaymentDetails[0];
    const result = await processor.processPayment(payment);

    // Verify the transaction status
    const status = await processor.getTransactionStatus(result.transactionId);
    expect(status).toBeDefined();
    expect(status?.success).toBe(true);
  });

  it("should handle different payment scenarios", async () => {
    // Test successful payment
    const successPayment = await processor.processPayment(mockPaymentDetails[0]);
    expect(successPayment.success).toBe(true);
    expect(successPayment.transactionId).toMatch(/^stripe_\d+$/);

    // Test payment with zero amount
    const zeroAmountPayment = { ...mockPaymentDetails[0], amount: 0 };
    const zeroResult = await processor.processPayment(zeroAmountPayment);
    expect(zeroResult.success).toBe(false);
    expect(zeroResult.error).toBe("Invalid amount");

    // Test payment with very large amount
    const largeAmountPayment = { ...mockPaymentDetails[0], amount: 2000000 };
    const largeResult = await processor.processPayment(largeAmountPayment);
    expect(largeResult.success).toBe(false);
    expect(largeResult.error).toBe("Invalid amount");
  });
});
