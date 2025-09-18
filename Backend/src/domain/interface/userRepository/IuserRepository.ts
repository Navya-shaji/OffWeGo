import { ProfileDto } from "../../dto/user/ProfileDto";
import { User } from "../../entities/UserEntity";
export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  findByPhone(phone: string): Promise<User | null>;
  updatePassword(email: string, newHashedPassword: string): Promise<void>;
  getAllUsers(
    skip: number,
    limit: number,
    filter?: Record<string, any>
  ): Promise<User[]>;
  countUsers(filter?: Record<string, any>): Promise<number>;
  updateUserStatus(userId: string, status: "active" | "block"): Promise<void>;
  getProfileByEmail(email: string): Promise<ProfileDto | null>;
  searchUser(Query:string):Promise<User[]>
}
