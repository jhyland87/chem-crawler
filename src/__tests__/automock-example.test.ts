import { mock } from "jest-mock-extended";
import { DatabaseClient } from "../services/DatabaseClient";
import { EmailService } from "../services/EmailService";
import { UserService } from "../services/UserService";

// Enable automock for all classes
jest.mock("../services/DatabaseClient");
jest.mock("../services/EmailService");

describe("UserService with Automock", () => {
  let userService: UserService;
  let mockDatabaseClient: jest.Mocked<DatabaseClient>;
  let mockEmailService: jest.Mocked<EmailService>;

  beforeEach(() => {
    // Create mocked instances using mock instead of autoMock
    mockDatabaseClient = mock<DatabaseClient>();
    mockEmailService = mock<EmailService>();

    // Create the service with mocked dependencies
    userService = new UserService(mockDatabaseClient, mockEmailService);
  });

  it("should create a new user and send welcome email", async () => {
    // Setup mock implementations
    mockDatabaseClient.createUser.mockResolvedValue({ id: 1, email: "test@example.com" });
    mockEmailService.sendWelcomeEmail.mockResolvedValue(true);

    // Call the method we want to test
    const result = await userService.registerUser("test@example.com", "password123");

    // Verify the result
    expect(result).toBe(true);

    // Verify that our mocks were called correctly
    expect(mockDatabaseClient.createUser).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith("test@example.com");
  });

  it("should handle database errors gracefully", async () => {
    // Setup mock to throw an error
    mockDatabaseClient.createUser.mockRejectedValue(new Error("Database connection failed"));

    // Test that the error is handled properly
    await expect(userService.registerUser("test@example.com", "password123")).rejects.toThrow(
      "Failed to register user",
    );

    // Verify email was not sent when database operation failed
    expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
  });
});
