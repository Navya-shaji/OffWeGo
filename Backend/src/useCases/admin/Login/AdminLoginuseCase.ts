import { IAdminLoginUseCase } from "../../../domain/interface/Admin/IAdminUsecase";
import { IPasswordService } from "../../../domain/interface/ServiceInterface/IhashpasswordService";
import { ITokenService } from "../../../domain/interface/ServiceInterface/ItokenService";
import { LoginDTo } from "../../../domain/dto/user/LoginDto";
import { IAdminRepository } from "../../../domain/interface/Admin/IAdminRepository";
import { mapToAdmin } from "../../../mappers/Admin/AdminMapper";
import { AdminResponseDto } from "../../../domain/dto/user/AdminResponseDto";

export class AdminLoginuseCase implements IAdminLoginUseCase {
  constructor(
    private _adminRepository: IAdminRepository,
    private _hashService: IPasswordService,
    private _tokenService: ITokenService
    
  ) {}

  async execute(data: LoginDTo): Promise<AdminResponseDto> {
    const { email, password } = data;

    const admin = await this._adminRepository.findByEmail(email);
    if (!admin) throw new Error("Admin not found");

    const isPasswordValid = await this._hashService.compare(
      password,
      admin.password
    );
    if (!isPasswordValid) throw new Error("Invalid email or password");

    const payload = { id: admin._id, email: admin.email, role: admin.role };

    const accessToken = this._tokenService.generateAccessToken(payload);
    const refreshToken = this._tokenService.generateRefreshToken(payload);

    return mapToAdmin(admin, accessToken, refreshToken);
  }
}
