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

    console.log("");
    console.log(color.red(color.bold("🔥 ERROR OCCURRED")));
    console.log(color.yellow("Message: ") + err.message);
    console.log(color.yellow("Status: ") + statusCode);
    console.log(color.yellow("Path: ") + req.originalUrl);
    console.log(color.yellow("Method: ") + req.method);
    console.log(color.yellow("Body: ") + JSON.stringify(req.body));
    console.log(color.yellow("Query: ") + JSON.stringify(req.query));
    console.log(color.yellow("Params: ") + JSON.stringify(req.params));
    console.log(color.gray("Stack: ") + (err.stack || "No stack trace"));
    console.log("");

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
  } catch (error) {
    console.log(color.red("Error in error handling middleware"), error);
  }
  console.log(_next);
};
