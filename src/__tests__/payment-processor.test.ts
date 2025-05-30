import { mock } from "jest-mock-extended";
import { PaymentDetails, PaymentProcessor, PaymentResult } from "../services/PaymentProcessor";
import { StripePaymentProcessor } from "../services/StripePaymentProcessor";

// Remove the global mock of PaymentProcessor as it's interfering with the concrete implementation
// jest.mock("../services/PaymentProcessor", () => {
//   return {
//     PaymentProcessor: jest.fn().mockImplementation(() => ({
//       validateAmount: jest.fn().mockReturnValue(true),
//     })),
//   };
// });

describe("PaymentProcessor Tests", () => {
  // Test the concrete implementation
  describe("StripePaymentProcessor", () => {
    let processor: StripePaymentProcessor;
    const mockApiKey = "test_api_key";

    beforeEach(() => {
      processor = new StripePaymentProcessor(mockApiKey);
    });

    it("should process a valid payment", async () => {
      const paymentDetails: PaymentDetails = {
        amount: 100,
        currency: "USD",
        customerId: "cust_123",
        paymentMethod: "card_123",
      };

      const result = await processor.processPayment(paymentDetails);

      expect(result.success).toBe(true);
      expect(result.transactionId).toMatch(/^stripe_\d+$/);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it("should reject invalid payment amounts", async () => {
      const paymentDetails: PaymentDetails = {
        amount: -100, // Invalid amount
        currency: "USD",
        customerId: "cust_123",
        paymentMethod: "card_123",
      };

      const result = await processor.processPayment(paymentDetails);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid amount");
    });

    it("should handle refunds correctly", async () => {
      const transactionId = "stripe_123";
      const amount = 50;

      const result = await processor.refundPayment(transactionId, amount);

      expect(result.success).toBe(true);
      expect(result.transactionId).toBe(`refund_${transactionId}`);
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });

  // Test using a mock of the abstract class
  describe("Mocked PaymentProcessor", () => {
    let mockProcessor: jest.Mocked<PaymentProcessor>;
    const mockPaymentResult: PaymentResult = {
      success: true,
      transactionId: "mock_trans_123",
      timestamp: new Date(),
    };

    beforeEach(() => {
      // Create a mock of the abstract class
      mockProcessor = mock<PaymentProcessor>();

      // Setup default mock implementations
      mockProcessor.processPayment.mockResolvedValue(mockPaymentResult);
      mockProcessor.refundPayment.mockResolvedValue(mockPaymentResult);
      mockProcessor.getTransactionStatus.mockResolvedValue(mockPaymentResult);
    });

    it("should use mocked processPayment implementation", async () => {
      const paymentDetails: PaymentDetails = {
        amount: 100,
        currency: "USD",
        customerId: "cust_123",
        paymentMethod: "card_123",
      };

      const result = await mockProcessor.processPayment(paymentDetails);

      expect(result).toBe(mockPaymentResult);
      expect(mockProcessor.processPayment).toHaveBeenCalledWith(paymentDetails);
    });

    it("should handle failed payments", async () => {
      const failedResult: PaymentResult = {
        success: false,
        transactionId: "failed_trans_123",
        timestamp: new Date(),
        error: "Payment declined",
      };

      mockProcessor.processPayment.mockResolvedValueOnce(failedResult);

      const paymentDetails: PaymentDetails = {
        amount: 100,
        currency: "USD",
        customerId: "cust_123",
        paymentMethod: "card_123",
      };

      const result = await mockProcessor.processPayment(paymentDetails);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Payment declined");
    });

    it("should verify abstract method calls", async () => {
      const transactionId = "trans_123";
      await mockProcessor.getTransactionStatus(transactionId);

      expect(mockProcessor.getTransactionStatus).toHaveBeenCalledWith(transactionId);
      expect(mockProcessor.getTransactionStatus).toHaveBeenCalledTimes(1);
    });
  });
});
