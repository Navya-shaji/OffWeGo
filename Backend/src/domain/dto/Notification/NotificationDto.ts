import { Role } from "../../constants/Roles";

export interface NotificationDto {
  recipientId: string;
  recipientType: Role.USER | Role.VENDOR;
  title: string;
  message: string;
  createdAt?: Date;
  read:boolean
}
