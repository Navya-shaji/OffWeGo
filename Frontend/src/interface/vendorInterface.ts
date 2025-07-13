export interface Vendor {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: "pending" | "approved" | "rejected" | "blocked";
  createdAt?: string;
  documentUrl: string;
  isBlocked:boolean
}
