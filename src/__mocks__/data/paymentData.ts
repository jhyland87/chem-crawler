import { PaymentDetails, PaymentResult } from "../../services/PaymentProcessor";

export const mockPaymentDetails: PaymentDetails[] = [
  {
    amount: 100,
    currency: "USD",
    customerId: "cust_123",
    paymentMethod: "card_123",
  },
  {
    amount: 200,
    currency: "EUR",
    customerId: "cust_456",
    paymentMethod: "card_456",
  },
];

export const mockPaymentResults: PaymentResult[] = [
  {
    success: true,
    transactionId: "trans_123",
    timestamp: new Date("2024-01-01"),
  },
  {
    success: false,
    transactionId: "trans_456",
    timestamp: new Date("2024-01-02"),
    error: "Payment declined",
  },
];
