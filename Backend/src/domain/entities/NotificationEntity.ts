export interface Notification {
  title: string;
  body: string;
  recipientType: "admin" | "vendor" | "user";
  tokens?: string[]; 
  topic?: string; 
  createdAt?: Date;
}
