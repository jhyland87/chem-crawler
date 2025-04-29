global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
  },
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
    },
  },
  // Add other Chrome API mocks as needed
};