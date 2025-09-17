import { ObjectId } from "mongoose";

export class User {
  _id?: ObjectId;
  name: string;
  email: string;
  phone: number;
  password: string;
  role: "user" | "admin";
  status?: "active" | "block";
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  isAdmin?: boolean;

  constructor(
    name: string,
    email: string,
    phone: number,
    password: string,
    role: "user" | "admin" = "user",
    status: "active" | "block" = "active",
    imageUrl?: string,
    isAdmin: boolean = false
  ) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.role = role;
    this.status = status;
    this.imageUrl = imageUrl;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.lastLogin = undefined;
    this.isAdmin = isAdmin;
  }
}
