import { User } from "../../entities/userEntity";
export interface IAdminRepository{
      findByEmail(email: string): Promise<User | null>;
}