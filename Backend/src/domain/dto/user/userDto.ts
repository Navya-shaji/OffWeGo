import { User } from "../../entities/userEntity";

export type RegisterDTO=Omit<User, "_id" | "createdAt" | "updatedAt" | "lastLogin" | "status" | "role" | "isAdmin">