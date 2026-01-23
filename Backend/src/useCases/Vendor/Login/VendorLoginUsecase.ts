import { LoginDTo } from "../../../domain/dto/User/LoginDto";
import { IPasswordService } from "../../../domain/interface/ServiceInterface/IhashpasswordService";
import { ITokenService } from "../../../domain/interface/ServiceInterface/ItokenService";
import { IVendorLoginUsecase } from "../../../domain/interface/Vendor/IVendorLoginUsecase";
import { IVendorRepository } from "../../../domain/interface/Vendor/IVendorRepository";

export class VendorLoginUsecase implements IVendorLoginUsecase {
  constructor(
    private _vendorRepository: IVendorRepository,
    private _hashService: IPasswordService,
    private _tokenService: ITokenService
  ) { }

  async execute(
    data: LoginDTo,
    fcmToken?: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    fcmToken: string;
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
  } | null> {

    const { email, password } = data;

    const vendor = await this._vendorRepository.findByEmail(
      email.toLowerCase().trim()
    );

    if (!vendor) return null;

    const isPasswordValid = await this._hashService.compare(
      password,
      vendor.password
    );
    if (!isPasswordValid) return null;

    let savedFcmToken = "";
    if (fcmToken) {
      const updatedVendor = await this._vendorRepository.updateFcmToken(
        vendor._id.toString(),
        fcmToken
      );
      savedFcmToken = updatedVendor?.fcmToken || fcmToken;
    } else {
      savedFcmToken = vendor.fcmToken || "";
    }

    const payload = {
      id: vendor._id.toString(),
      email: vendor.email,
      role: "vendor",
    };

    const accessToken = this._tokenService.generateAccessToken(payload);
    const refreshToken = this._tokenService.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      fcmToken: savedFcmToken,
      vendor: {
        id: vendor.id,
        email: vendor.email,
        name: vendor.name,
        status: vendor.status,
        documentUrl: vendor.documentUrl,
        phone: vendor.phone,
        isBlocked: vendor.isBlocked ?? false,
        profileImage: vendor.profileImage?.toString() || "",
        rejectionReason: vendor.rejectionReason || "",
      },
    };
  }
}
