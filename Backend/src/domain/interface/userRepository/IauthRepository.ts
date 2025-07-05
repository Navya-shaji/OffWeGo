import { User } from "../../entities/userEntity";

export interface IAuthRepository {
  signupWithGoogle(googleToken: string): Promise<User>;
}