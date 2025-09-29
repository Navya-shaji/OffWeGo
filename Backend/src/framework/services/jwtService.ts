import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { ITokenService } from "../../domain/interface/ServiceInterface/ItokenService";

const blacklistedTokens: Set<string> = new Set();

export class JwtService implements ITokenService {
  generateAccessToken(payload: { id: string; email?: string; role: string }): string {
    
    const secret = process.env.JWT_ACCESSTOKENSECRETKEY;
    if (!secret) throw new Error("Access token secret is not configured");

    return jwt.sign(payload, secret, { expiresIn: "1h" });
  }

  generateRefreshToken(payload: { id: string; email?: string; role: string }): string {
    const secret = process.env.JWT_REFRESHTOKEN;
    if (!secret) throw new Error("Refresh token secret is not configured");

    return jwt.sign(payload, secret, { expiresIn: "7d" });
  }

  async verifyToken(
    token: string,
    type: "access" | "refresh" = "access"
  ): Promise<JwtPayload & { id?: string; email?: string; role?: string } | null> {
    try {
      const secret =
        type === "access"
          ? process.env.JWT_ACCESSTOKENSECRETKEY
          : process.env.JWT_REFRESHTOKEN;

      if (!secret) throw new Error(`${type} token secret is not configured`);

      if (this.checkTokenBlacklist(token)) {
        throw new Error("Token is blacklisted");
      }

      return await new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
          if (err || !decoded) return reject(err);
          resolve(decoded as JwtPayload & { id?: string; email?: string; role?: string });
        });
      });
    } catch (error) {
      console.error("Token verification failed:", error);
      if (error instanceof TokenExpiredError) {
        console.log(
          "Access token expired at",
          new Date(error.expiredAt).toLocaleString()
        );
      }
      return null;
    }
  }

  checkTokenBlacklist(token: string): boolean {
    return blacklistedTokens.has(token);
  }

  blacklistToken(token: string): void {
    blacklistedTokens.add(token);
  }
}
