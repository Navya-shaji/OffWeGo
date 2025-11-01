import { ProfileDto } from "../../dto/User/profileDto";
import { User } from "../../entities/userEntity";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  findByPhone(phone: string): Promise<User | null>;
  findById(userId: string): Promise<User | null>;
  updatePassword(email: string, newHashedPassword: string): Promise<void>;

  updatePasswordById(userId: string, newHashedPassword: string): Promise<void>;
  getAllUsers(
    skip: number,
    limit: number,
    filter?: Record<string, unknown>
  ): Promise<User[]>;

  countUsers(filter?: Record<string, unknown>): Promise<number>;
  updateUserStatus(userId: string, status: "active" | "block"): Promise<void>;
  getProfileByEmail(email: string): Promise<ProfileDto | null>;
  searchUser(query: string): Promise<User[]>;
  updateWallet(userId: string, amount: number): Promise<void>;
}
