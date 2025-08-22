import { IAdminLoginUseCase } from "../../../domain/interface/admin/IAdminUsecase";
import { IPasswordService } from "../../../domain/interface/serviceInterface/IhashpasswordService";
import { ITokenService } from "../../../domain/interface/serviceInterface/ItokenService";
import { LoginDTo } from "../../../domain/dto/user/LoginDto";
import { IAdminRepository } from "../../../domain/interface/admin/IAdminRepository";
import { mapToAdmin } from "../../../mappers/Admin/AdminMapper";
import { AdminResponseDto } from "../../../domain/dto/user/AdminResponseDto";

export class AdminLoginuseCase implements IAdminLoginUseCase {
  constructor(
    private adminRepository: IAdminRepository,
    private hashService: IPasswordService,
    private tokenService: ITokenService
    
  ) {}

  async execute(data: LoginDTo): Promise<AdminResponseDto> {
    const { email, password } = data;

    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) throw new Error("Admin not found");

    const isPasswordValid = await this.hashService.compare(
      password,
      admin.password
    );
    if (!isPasswordValid) throw new Error("Invalid email or password");

    const payload = { id: admin._id, email: admin.email, role: admin.role };

    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    return mapToAdmin(admin, accessToken, refreshToken);
  }
}
