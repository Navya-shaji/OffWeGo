import { Profile } from "../../dto/user/profileDto";
import { User } from "../../entities/userEntity";
export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  findByPhone(phone: string): Promise<User | null>;
  updatePassword(email: string, newHashedPassword: string): Promise<void>;
getAllUsers(skip: number, limit: number, filter?: Record<string, any>): Promise<User[]>;
countUsers(filter?: Record<string, any>): Promise<number>;
  updateUserStatus(userId: string, status: "active" | "block"): Promise<void>;
  getProfileByEmail(email: string): Promise<Profile | null>;
}

