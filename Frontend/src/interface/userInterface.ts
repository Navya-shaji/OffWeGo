export interface User {
  imageUrl: unknown;
  _id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: "active" | "blocked";
  createdAt: string;
  fcmToken: string;
}
