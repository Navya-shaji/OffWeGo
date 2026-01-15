import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../domain/statusCode/Statuscode";

export const checkRoleBasedcontrol = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (
      !user ||
      !allowedRoles
        .map((r) => r.toLowerCase())
        .includes(user.role?.toLowerCase())
    ) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: "Access Denied: Unauthorized role",
      });
    }
    next();
  };
};
