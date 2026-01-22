import { NextFunction, Request, Response } from "express";
import { AppError } from "../../domain/errors/AppError";
import { logErrorToFile } from "../../framework/Logger/errorLogger";
import { color } from "../../utilities/color";

export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  try {
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

    console.error(color.red(`[${statusCode}] ${req.method} ${req.originalUrl}:`), err.message);
    if (err.stack) console.error(err.stack);

    res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  } catch (error) {
    console.log(color.red("Error in error handling middleware"), error);
  }
  console.log(_next);
};
