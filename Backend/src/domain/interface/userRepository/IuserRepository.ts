import { User } from "../../entities/userEntity";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  findByPhone(phone: string) : Promise<User | null>;
  updatePassword(email: string, newHashedPassword: string): Promise<void>;
}
