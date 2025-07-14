import jwt from "jsonwebtoken";
import { ITokenService } from "../../domain/interface/serviceInterface/ItokenService";

export class JwtSevice implements ITokenService {
    generateAccessToken(payload: object): string {
        if(!process.env.JWT_ACCESSTOKENSECRETKEY){
             throw new Error("Jwt secret is not configured")
        }
        return jwt.sign(payload, process.env.JWT_ACCESSTOKENSECRETKEY as string, { expiresIn: "15m" })
    }
    generateRefreshToken(payload:object):string{
        if(!process.env.JWT_REFRESHTOKEN){
            throw new Error("Refresh token is not configured")
        }
        return jwt.sign(payload, process.env.JWT_REFRESHTOKEN as string, { expiresIn: "1d" })
    }
}

