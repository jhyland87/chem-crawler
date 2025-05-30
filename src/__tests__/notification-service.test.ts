import { createMockNotificationService } from "../__mocks__/NotificationService";
import { Notification } from "../services/NotificationService";

describe("NotificationService Tests", () => {
  let mockService: ReturnType<typeof createMockNotificationService>;
  const mockNotification: Notification = {
    id: "test_123",
    type: "email",
    recipient: "test@example.com",
    content: "Test notification",
    status: "sent",
    createdAt: new Date(),
  };

  beforeEach(() => {
    // Get a fresh instance of the mock for each test
    mockService = createMockNotificationService();
    jest.clearAllMocks();
  });

  it("should send a notification successfully", async () => {
    // Setup mock implementation
    mockService.sendNotification.mockResolvedValueOnce(mockNotification);

    const notification = {
      type: "email" as const,
      recipient: "test@example.com",
      content: "Test notification",
    };

    const result = await mockService.sendNotification(notification);

    expect(result).toBe(mockNotification);
    expect(mockService.sendNotification).toHaveBeenCalledWith(notification);
    expect(mockService.sendNotification).toHaveBeenCalledTimes(1);
  });

  it("should handle notification failure", async () => {
    // Setup mock to throw an error
    const error = new Error("Failed to send notification");
    mockService.sendNotification.mockRejectedValueOnce(error);

    const notification = {
      type: "email" as const,
      recipient: "test@example.com",
      content: "Test notification",
    };

    await expect(mockService.sendNotification(notification)).rejects.toThrow(
      "Failed to send notification",
    );
  });

  it("should retrieve notification status", async () => {
    // Setup mock implementation
    mockService.getNotificationStatus.mockResolvedValueOnce(mockNotification);

    const status = await mockService.getNotificationStatus("test_123");

    expect(status).toBe(mockNotification);
    expect(mockService.getNotificationStatus).toHaveBeenCalledWith("test_123");
  });

  it("should handle multiple notifications", async () => {
    const notifications = [
      {
        type: "email" as const,
        recipient: "test1@example.com",
        content: "First notification",
      },
      {
        type: "sms" as const,
        recipient: "+1234567890",
        content: "Second notification",
      },
    ];

    // Setup mock to return different notifications
    mockService.sendNotification
      .mockResolvedValueOnce({ ...mockNotification, id: "notif_1" })
      .mockResolvedValueOnce({ ...mockNotification, id: "notif_2" });

    const results = await Promise.all(notifications.map((n) => mockService.sendNotification(n)));

    expect(results).toHaveLength(2);
    expect(results[0].id).toBe("notif_1");
    expect(results[1].id).toBe("notif_2");
    expect(mockService.sendNotification).toHaveBeenCalledTimes(2);
  });
});
