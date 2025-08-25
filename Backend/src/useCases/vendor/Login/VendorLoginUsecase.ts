import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";
import { IPasswordService } from "../../../domain/interface/serviceInterface/IhashpasswordService";
import { ITokenService } from "../../../domain/interface/serviceInterface/ItokenService";
import { LoginDTo } from "../../../domain/dto/user/LoginDto";

export class VendorLoginUsecase {
  constructor(
    private _vendorRepository: IVendorRepository,
    private _hashService: IPasswordService,
    private _tokenService: ITokenService
  ) {}

  async execute(data: LoginDTo): Promise<{
    accessToken: string;
    refreshToken: string;
    vendor: {
      id: string;
      email: string;
      name: string;
      status: string;
      documentUrl: string;
      phone: string;
      isBlocked: boolean;
      profileImage: string;
    };
  } | null> {
    const { email, password } = data;

    const vendor = await this._vendorRepository.findByEmail(
      email.toLowerCase().trim()
    );

    if (!vendor) {
      return null;
    }

    if (vendor.status !== "approved") {
      return null;
    }

    const isPasswordValid = await this._hashService.compare(
      password,
      vendor.password
    );

    if (!isPasswordValid) {
      return null;
    }

    const payload = {
      id: vendor._id,
      email: vendor.email,
      role: "vendor",
    };

    const accessToken = this._tokenService.generateAccessToken(payload);
    const refreshToken = this._tokenService.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      vendor: {
        id: vendor.id,
        email: vendor.email,
        name: vendor.name,
        status: vendor.status,
        documentUrl: vendor.documentUrl,
        phone: vendor.phone,
        isBlocked: vendor.isBlocked ?? false,
        profileImage: vendor.profileImage ? vendor.profileImage.toString() : "",
      },
    };
  }
}
