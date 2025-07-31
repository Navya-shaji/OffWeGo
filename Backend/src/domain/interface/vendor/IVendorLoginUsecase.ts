import { LoginDTo } from "../../dto/user/LoginDto";

export interface IVendorLoginUsecase {
  execute(
    data: LoginDTo
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    vendor: {
      id: string;
      email: string;
      name: string;
      status: string;         
      documentUrl: string;   
      phone:string
    };
  } | null>;
}
