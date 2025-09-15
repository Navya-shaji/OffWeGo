import { ObjectId } from "mongoose";

export class Vendor {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  profileImage?: string;
  documentUrl: string;
  createdAt?: Date;
  status?: "pending" | "approved" | "rejected";
  role?: "Vendor";
  lastLogin?: Date;
  isAdmin?: boolean;
  googleVerified?: boolean;
  isBlocked?: boolean;
  subscription?: {
    plan: ObjectId;
    subscribedAt: Date;
    expiresAt: Date;
  };

  constructor(
    name: string,
    email: string,
    phone: string,
    password: string,
    documentUrl: string,
    profileImage?: string,
    role: "Vendor" = "Vendor",
    status: "pending" | "approved" | "rejected" = "pending",
    isAdmin: boolean = false,
    googleVerified: boolean = false,
    isBlocked: boolean = false,
    subscription?: {
      plan: ObjectId;
      subscribedAt: Date;
      expiresAt: Date;
    }
  ) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.documentUrl = documentUrl;
    this.profileImage = profileImage;
    this.role = role;
    this.status = status;
    this.isAdmin = isAdmin;
    this.googleVerified = googleVerified;
    this.isBlocked = isBlocked;
    this.subscription = subscription;
    this.createdAt = new Date();
  }
}
