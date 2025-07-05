import { LoginDTo } from "../../dto/user/LoginDto"

export interface IAdminLoginUseCase {
  execute(data: LoginDTo): Promise<{
    token: string;
    admin: {
      id: string;
      email: string;
     
    };
  }>;
}
