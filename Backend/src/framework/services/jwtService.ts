import jwt from "jsonwebtoken";
import { ITokenService } from "../../domain/interface/serviceInterface/ItokenService";

export class JwtSevice implements ITokenService {
    generateToken(payload: object): string {
        if(!process.env.JWT_SECRET){
             throw new Error("Jwt secret is not configured")
        }
        return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1d" })
    }
}