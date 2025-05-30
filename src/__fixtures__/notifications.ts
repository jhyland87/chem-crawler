import { Notification } from "../services/NotificationService";

// Test fixtures for notifications
export const notificationFixtures = {
  // Valid notifications
  valid: {
    email: {
      type: "email" as const,
      recipient: "test@example.com",
      content: "Test email notification",
    },
    sms: {
      type: "sms" as const,
      recipient: "+1234567890",
      content: "Test SMS notification",
    },
    push: {
      type: "push" as const,
      recipient: "device_token_123",
      content: "Test push notification",
    },
  },

  // Invalid notifications for testing error cases
  invalid: {
    invalidEmail: {
      type: "email" as const,
      recipient: "invalid-email",
      content: "Test invalid email",
    },
    invalidSms: {
      type: "sms" as const,
      recipient: "not-a-phone",
      content: "Test invalid SMS",
    },
    invalidType: {
      type: "invalid" as any,
      recipient: "test@example.com",
      content: "Test invalid type",
    },
  },

  // Complete notification objects with all fields
  complete: {
    success: {
      id: "notif_123",
      type: "email" as const,
      recipient: "test@example.com",
      content: "Test notification",
      status: "sent" as const,
      createdAt: new Date("2024-01-01"),
    } as Notification,
    failed: {
      id: "notif_456",
      type: "sms" as const,
      recipient: "+1234567890",
      content: "Failed notification",
      status: "failed" as const,
      createdAt: new Date("2024-01-02"),
    } as Notification,
  },
};
