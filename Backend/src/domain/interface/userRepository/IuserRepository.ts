import { Profile } from "../../dto/user/profileDto";
import { User } from "../../entities/userEntity";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  findByPhone(phone: string): Promise<User | null>;
  updatePassword(email: string, newHashedPassword: string): Promise<void>;
  getAllUsers(
    skip: number,
    limit: number
  ): Promise<{ users: User[]; totalUsers: number }>;
  updateUserStatus(userId: string, status: "active" | "block"): Promise<void>;
  countUsers(): Promise<number>;
  getProfileByEmail(email:string): Promise<Profile | null>;
}
