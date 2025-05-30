import { NotificationService } from "../services/NotificationService";

// Create a mock implementation that can be used across test files
export const createMockNotificationService = () => {
  const mockService = {
    sendNotification: jest.fn(),
    getNotificationStatus: jest.fn(),
    deliverNotification: jest.fn(),
    sendEmail: jest.fn(),
    sendSMS: jest.fn(),
    sendPushNotification: jest.fn(),
  };

  return mockService as unknown as jest.Mocked<NotificationService>;
};

// Default mock implementation
const mockNotificationService = createMockNotificationService();

// Export the mock implementation
export default mockNotificationService;
