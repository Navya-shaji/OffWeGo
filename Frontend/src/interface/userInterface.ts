export interface User {
  imageUrl: any;
  _id: string;
  username: string;
  email: string;
  phone?: string;
  role: string;
  status: "active" | "blocked";
  createdAt: string;
  fcmToken: string;
}
