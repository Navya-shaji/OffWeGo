import { LoginDTo } from "../../dto/user/LoginDto";

export interface IUserLoginUseCase {
  execute(credentials: LoginDTo): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      username: string;
      role: "user" | "vendor" | "admin";
      status: string;
    };
  }>
}
