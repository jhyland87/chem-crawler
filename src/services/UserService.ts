import { DatabaseClient, User } from "./DatabaseClient";
import { EmailService } from "./EmailService";

export class UserService {
  constructor(
    private readonly databaseClient: DatabaseClient,
    private readonly emailService: EmailService,
  ) {}

  async registerUser(email: string, password: string): Promise<boolean> {
    try {
      const user = await this.databaseClient.createUser({ email, password });
      await this.emailService.sendWelcomeEmail(user.email);
      return true;
    } catch (error) {
      throw new Error("Failed to register user");
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.databaseClient.getUserByEmail(email);
  }
}
