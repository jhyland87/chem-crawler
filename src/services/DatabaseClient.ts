export interface User {
  id: number;
  email: string;
}

export interface CreateUserParams {
  email: string;
  password: string;
}

export class DatabaseClient {
  async createUser(params: CreateUserParams): Promise<User> {
    // In a real implementation, this would connect to a database
    throw new Error("Not implemented");
  }

  async getUserByEmail(email: string): Promise<User | null> {
    // In a real implementation, this would query the database
    throw new Error("Not implemented");
  }
}
