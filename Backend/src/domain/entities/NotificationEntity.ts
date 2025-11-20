import { Role } from "../constants/Roles";

export interface Notification {
  title: string;
  body: string;
  recipientType:Role
  tokens?: string[]; 
  topic?: string; 
  createdAt?: Date;
}
