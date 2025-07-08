import { IAdminLoginUseCase } from "../../../domain/interface/admin/IAdminUsecase";
import { IPasswordService } from "../../../domain/interface/serviceInterface/IhashpasswordService";
import { ITokenService } from "../../../domain/interface/serviceInterface/ItokenService";
import { LoginDTo } from "../../../domain/dto/user/LoginDto";
import { IAdminRepository } from "../../../domain/interface/admin/IAdminRepository";

export class AdminLoginuseCase implements IAdminLoginUseCase {
  constructor(
    private adminRepository: IAdminRepository,
    private hashService: IPasswordService,
    private tokenService: ITokenService
  ) {}

  async execute(
    data: LoginDTo
  ): Promise<{ token: string; admin: { id: string; email: string } }> {
    const { email, password } = data;
    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) throw new Error("Not found");
    const isPasswordValid = await this.hashService.compare(
      password,
      admin.password
    );
    if (!isPasswordValid) throw new Error("Password is not valid");
    const token = this.tokenService.generateToken({
      id: admin._id,
      email: admin.email,
      role: "admin",
    });
    return {
      token,
      admin: {
        id: admin._id?.toString() ?? "",
        email: admin.email,
      },
    };
  }
}
