import { Request, Response, NextFunction } from "express";
import { ITokenService } from "../../domain/interface/ServiceInterface/ItokenService";
import { HttpStatus } from "../../domain/statusCode/Statuscode";
import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload & { id: string; email?: string; role: string };
  }
}

export const verifyTokenAndCheckBlackList = (tokenService: ITokenService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];

    try {
      const decoded = await tokenService.verifyToken(token, "access");
      if (!decoded) throw new Error("Invalid or expired token");

      const payload = decoded as any;
      const id = payload.userId || payload.id || payload.vendorId || payload.adminId;

      req.user = {
        ...payload,
        id: id,
        userId: id
      };

      next();
    } catch (err) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized", error: (err as Error).message });
    }
  };
};

export const verifyTokenOptional = (tokenService: ITokenService) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }
    const token = authHeader.split(" ")[1];

    try {
      const decoded = await tokenService.verifyToken(token, "access");
      if (decoded) {
        req.user = decoded as JwtPayload & {
          id: string;
          email?: string;
          role: string;
        };
      }
      next();
    } catch {
      next();
    }
  };
};
