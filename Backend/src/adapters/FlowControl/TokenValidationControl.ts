import { NextFunction, Request, Response } from "express";
import { ITokenService } from "../../domain/interface/ServiceInterface/ItokenService";
import { HttpStatus } from "../../domain/statusCode/Statuscode";
import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload & { id: string; email: string; role: string };
  }
}

export const verifyTokenAndCheckBlackList = (tokenService: ITokenService) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Access denied. No token provided." });
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const isBlacklisted = await tokenService.checkTokenBlacklist(token);
      if (isBlacklisted) {
        res
          .status(HttpStatus.UNAUTHORIZED) // unified with expired/invalid
          .json({ message: "This token is blacklisted" });
        return;
      }

      const decoded = await tokenService.verifyToken(token, "access");
      if (!decoded) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "Invalid or expired token" });
        return;
      }

      // Ensure required fields exist before assigning
      if (!decoded.id || !decoded.email || !decoded.role) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "Token missing required claims" });
        return;
      }

      req.user = decoded as JwtPayload & {
        id: string;
        email: string;
        role: string;
      };

      next();
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: "Invalid or expired token",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
};
