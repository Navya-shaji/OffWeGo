import { User } from "../../entities/userEntity";

export interface IVerifyOtpUseCase {
  execute(userData: User, otp: string): Promise<User>;
}
