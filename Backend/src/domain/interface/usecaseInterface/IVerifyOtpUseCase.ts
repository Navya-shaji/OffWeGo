import { User } from "../../../domain/entities/userEntity";

export interface IVerifyOtpUseCase {
  execute(userData: User, otp: string): Promise<User>;
}
