import { LoginDTo } from "../../dto/User/LoginDto";

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
      phone:string,
      isBlocked:boolean;
      profileImage:string;
    };
  } | null>;
}
