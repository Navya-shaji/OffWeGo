import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";
import { IPasswordService } from "../../../domain/interface/serviceInterface/IhashpasswordService";
import { ITokenService } from "../../../domain/interface/serviceInterface/ItokenService";
import { LoginDTo } from "../../../domain/dto/user/LoginDto";

export class VendorLoginUsecase {
  constructor(
    private vendorRepository: IVendorRepository,
    private hashService: IPasswordService,
    private tokenService: ITokenService
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

    const vendor = await this.vendorRepository.findByEmail(
      email.toLowerCase().trim()
    );

    if (!vendor) {
      return null;
    }

    if (vendor.status !== "approved") {
      return null;
    }

    const isPasswordValid = await this.hashService.compare(
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

    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

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
