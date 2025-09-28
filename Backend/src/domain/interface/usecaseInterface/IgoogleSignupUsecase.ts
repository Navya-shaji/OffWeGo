import { User } from "../../entities/UserEntity";

export interface IGoogleSignupUseCase {
  execute(googleToken: string): Promise<User>;
}
