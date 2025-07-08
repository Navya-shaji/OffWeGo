import { User } from "../../entities/userEntity";
export interface IregisterUserUseCase{
execute(userData: User, otp: string): Promise<boolean>;
}