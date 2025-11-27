export interface NotificationDto {
  recipientId: string;
  recipientType: "user" | "vendor" ;
  title: string;
  message: string;
  createdAt?: Date;
}
