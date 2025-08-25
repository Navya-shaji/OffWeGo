import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../domain/statusCode/statuscode";

export const checkRoleBasedcontrol = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: "Access Denied: Unauthorized role",
      });
    }

    next();
  };
};

