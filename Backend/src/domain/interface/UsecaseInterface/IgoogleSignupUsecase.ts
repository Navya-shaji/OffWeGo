import { User } from "../../entities/UserEntity";

export interface IGoogleSignupUseCase {
  execute(googleToken: string,fcmToken:string): Promise<User>;
}
