import { Request, Response } from "express";
import { AppError } from "../../domain/errors/AppEroor"; 
import { logErrorToFile } from "../../framework/Logger/errorLogger"; 

export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  logErrorToFile({
    message: err.message,
    stack: err.stack,
    statusCode,
    path: req.originalUrl,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
