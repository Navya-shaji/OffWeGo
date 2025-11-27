import { LoginDTo } from "../../dto/User/LoginDto";

export interface IUserLoginUseCase {
  execute(data: LoginDTo, fcmToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    fcmToken:string
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
