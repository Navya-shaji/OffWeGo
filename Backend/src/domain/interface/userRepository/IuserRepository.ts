import { ProfileDto } from "../../dto/User/ProfileDto"; 
import { User } from "../../entities/UserEntity"; 

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  findByPhone(phone: string): Promise<User | null>;
findById(userId: string): Promise<User | null>
  /** Change password by email */
  updatePassword(email: string, newHashedPassword: string): Promise<void>;

  /** Optional: Change password by userId */
  updatePasswordById?(userId: string, newHashedPassword: string): Promise<void>;

  getAllUsers(
    skip: number,
    limit: number,
    filter?: Record<string, unknown>
  ): Promise<User[]>;

  countUsers(filter?: Record<string, unknown>): Promise<number>;
  updateUserStatus(userId: string, status: "active" | "block"): Promise<void>;
  getProfileByEmail(email: string): Promise<ProfileDto | null>;
  searchUser(query: string): Promise<User[]>;
}
