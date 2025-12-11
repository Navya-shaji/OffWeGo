import { ObjectId } from "mongoose";

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  status?: "active" | "block";
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  isAdmin?: boolean;
  fcmToken: string;
  isGoogleUser?: boolean;
  location?: string;
  phone?: number | string;
}

