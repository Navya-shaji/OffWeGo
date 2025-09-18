import { User } from "../../entities/UserEntity";

export interface IAuthRepository {
  signupWithGoogle(googleToken: string): Promise<User>;
}