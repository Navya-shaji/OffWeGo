import { LoginDTo } from "../../dto/User/LoginDto";

export interface IAdminLoginUseCase {
  execute(data: LoginDTo): Promise<{
    accessToken: string;
    refreshToken: string;
    admin: {
      id: string;
      email: string;
      role: string;
    };
  }>;
}
