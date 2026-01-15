import { RefreshTokenUseCase } from "../../../useCases/Auth/refreshtokenusecase";
import { RefreshTokenController } from "../../../adapters/controller/Auth/authcontroller";
import { JwtService } from "../../Services/jwtService";

const jwtService = new JwtService();
const refreshTokenUseCase = new RefreshTokenUseCase(jwtService);

export const refreshTokenController = new RefreshTokenController(refreshTokenUseCase);
