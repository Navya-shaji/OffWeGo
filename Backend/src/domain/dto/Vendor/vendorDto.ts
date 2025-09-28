export interface VendorDto {
  id?: string; 
  name: string;
  email: string;
  phone: string;
  password:string;
  profileImage?: string;
  documentUrl: string;
  createdAt?: Date;
  status?: "pending" | "approved" | "rejected";
  role?: "Vendor";
  lastLogin?: Date;
  isAdmin?: boolean;
  googleVerified?: boolean;
  isBlocked?: boolean;
}
