import { LoginDTo } from "../../dto/User/LoginDto";

export interface IVendorLoginUsecase {
  execute(
    data: LoginDTo,
    fcmToken: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    fcmToken:string
    vendor: {
      id: string;
      email: string;
      name: string;
      status: string;
      documentUrl: string;
      phone: string;
      isBlocked: boolean;
      profileImage: string;
      rejectionReason?: string;
    };
  } | null>;
}
