import { User } from "../../entities/userEntity";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
}
