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
    vendor: { id: string; email: string; name: string };
  } | null> {
    const { email, password } = data;

    console.log(" Login attempt for:", email);

    const vendor = await this.vendorRepository.findByEmail(
      email.toLowerCase().trim()
    );
    console.log("Vendor from DB:", vendor);

    if (!vendor) {
      console.log(" Vendor not found");
      return null;
    }

    if (vendor.status !== "approved") {
      console.log(`Vendor status is '${vendor.status}', not approved`);
      return null;
    }

    const isPasswordValid = await this.hashService.compare(
      password,
      vendor.password
    );
    console.log(" Password Valid:", isPasswordValid);

    if (!isPasswordValid) {
      console.log(" Password mismatch");
      return null;
    }

    const payload = {
      id: vendor._id,
      email: vendor.email,
      role: "vendor",
    };

    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    console.log(" Tokens generated");

    return {
      accessToken,
      refreshToken,
      vendor: {
        id: vendor._id?.toString() ?? "",
        email: vendor.email,
        name: vendor.name,
      },
    };
  }
}
