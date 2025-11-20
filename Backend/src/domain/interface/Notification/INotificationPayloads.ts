export interface NotificationPayload {
  title: string;
  body: string;
  targetRole: "admin" | "vendor" | "user";
  tokens?: string[]; 
}

