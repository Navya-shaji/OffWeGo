import { RefreshTokenUseCase } from "../../../useCases/auth/refreshtokenusecase"; 
import { RefreshTokenController } from "../../../adapters/controller/Auth/authcontroller"; 
import { JwtService } from "../../services/jwtService";

const jwtService = new JwtService();
const refreshTokenUseCase = new RefreshTokenUseCase(jwtService);

export const refreshTokenController = new RefreshTokenController(refreshTokenUseCase);
