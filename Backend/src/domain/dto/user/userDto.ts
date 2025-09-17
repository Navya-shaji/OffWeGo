import { User } from "../../entities/UserEntity";

export type RegisterDTO=Omit<User, "_id" | "createdAt" | "updatedAt" | "lastLogin" | "status" | "role" | "isAdmin">