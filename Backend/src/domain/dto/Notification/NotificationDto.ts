import { Role } from "../../constants/Roles";

export interface NotificationDto{
  title: string;
  body: string;
  recipientType:Role
  tokens?: string[]; 
  topic?: string; 
  createdAt?: Date;
}