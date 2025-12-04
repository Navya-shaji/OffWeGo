export interface INotificationEntity {
  _id?: string;
  recipientId: string;
  recipientType: "user" | "vendor";
  title: string;
  message: string;
  createdAt: Date;
  read:boolean;
}
