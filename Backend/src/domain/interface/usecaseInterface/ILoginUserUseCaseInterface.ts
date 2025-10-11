import { LoginDTo } from "../../dto/User/LoginDto";

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
      imageUrl: string;
    };
  }>;
}
