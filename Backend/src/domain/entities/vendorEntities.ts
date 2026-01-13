import { Role } from "../constants/Roles";

export interface Vendor {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  profileImage?: string;
  documentUrl: string;
  createdAt?: Date;
  status?: "pending" | "approved" | "rejected" | "active";
  rejectionReason?: string;
  role?: Role.VENDOR;
  lastLogin?: Date;
  isAdmin?: boolean;
  googleVerified?: boolean;
  isBlocked?: boolean;
  fcmToken: string;

  subscription?: {
    plan: string;
    subscribedAt: Date;
    expiresAt: Date;
    maxPackages: number;
  };

  packageLimit?: number;
  currentPackages?: number;
}
