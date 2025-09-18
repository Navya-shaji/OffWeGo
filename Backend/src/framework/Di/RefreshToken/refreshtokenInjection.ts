import { RefreshTokenUseCase } from "../../../useCases/auth/Refreshtokenusecase"; 
import { RefreshTokenController } from "../../../adapters/controller/Auth/Authcontroller"; 
import { JwtService } from "../../Services/jwtService";

const jwtService = new JwtService();
const refreshTokenUseCase = new RefreshTokenUseCase(jwtService);

export const refreshTokenController = new RefreshTokenController(refreshTokenUseCase);
