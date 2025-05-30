import { NotificationService } from "../services/NotificationService";

// Create a mock implementation that can be used across test files
export const createMockNotificationService = () => {
  const mockService = {
    sendNotification: jest.fn(),
    getNotificationStatus: jest.fn(),
  };

  return mockService as jest.Mocked<NotificationService>;
};

// Default mock implementation
const mockNotificationService = createMockNotificationService();

// Export the mock implementation
export default mockNotificationService;
