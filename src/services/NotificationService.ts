export interface Notification {
  id: string;
  type: "email" | "sms" | "push";
  recipient: string;
  content: string;
  status: "pending" | "sent" | "failed";
  createdAt: Date;
}

export class NotificationService {
  private notifications: Notification[] = [];

  async sendNotification(
    notification: Omit<Notification, "id" | "status" | "createdAt">,
  ): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      status: "pending",
      createdAt: new Date(),
    };

    try {
      // Simulate sending notification
      await this.deliverNotification(newNotification);
      newNotification.status = "sent";
    } catch (error) {
      newNotification.status = "failed";
      throw error;
    }

    this.notifications.push(newNotification);
    return newNotification;
  }

  async getNotificationStatus(id: string): Promise<Notification | null> {
    return this.notifications.find((n) => n.id === id) || null;
  }

  private async deliverNotification(notification: Notification): Promise<void> {
    // Simulate different delivery methods
    switch (notification.type) {
      case "email":
        await this.sendEmail(notification);
        break;
      case "sms":
        await this.sendSMS(notification);
        break;
      case "push":
        await this.sendPushNotification(notification);
        break;
      default:
        throw new Error(`Unsupported notification type: ${notification.type}`);
    }
  }

  private async sendEmail(notification: Notification): Promise<void> {
    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  private async sendSMS(notification: Notification): Promise<void> {
    // Simulate SMS sending
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  private async sendPushNotification(notification: Notification): Promise<void> {
    // Simulate push notification sending
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}
