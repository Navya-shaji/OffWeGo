import { User } from "../../entities/userEntity";

export interface IGoogleSignupUseCase {
  execute(googleToken: string,fcmToken:string): Promise<User>;
}
