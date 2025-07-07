export interface Vendor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  documentUrl: string;
  status: "pending" | "approved" | "rejected";
  document:string;
  createdAt?: Date;
  
}
