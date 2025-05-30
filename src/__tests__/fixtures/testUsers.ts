// Test-specific user data
export const testUsers = {
  // Regular users
  regular: {
    id: "user_123",
    email: "user@example.com",
    name: "Test User",
    preferences: {
      notifications: true,
      language: "en",
    },
  },

  // Admin users
  admin: {
    id: "admin_123",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    permissions: ["read", "write", "delete"],
  },

  // Users with specific test scenarios
  scenarios: {
    noNotifications: {
      id: "user_456",
      email: "no-notifications@example.com",
      name: "No Notifications User",
      preferences: {
        notifications: false,
        language: "en",
      },
    },
    multipleDevices: {
      id: "user_789",
      email: "multi-device@example.com",
      name: "Multi Device User",
      devices: [
        { id: "device_1", type: "mobile" },
        { id: "device_2", type: "tablet" },
      ],
    },
  },
} as const;
