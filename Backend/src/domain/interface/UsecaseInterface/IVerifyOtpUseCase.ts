import { User } from "../../entities/UserEntity";

export interface IVerifyOtpUseCase {
  execute(userData: User, otp: string): Promise<User>;
}
