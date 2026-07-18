import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import logger from "../utils/logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`${err.name}: ${err.message}\n${err.stack}`);

  // Zod Validation Error
  if (err instanceof ZodError) {
    const errors = (err as any).errors.map((e: any) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    return res.status(400).json({
      status: "error",
      message: "Validation Error",
      errors,
    });
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      status: "error",
      message: `A record with that ${field} already exists.`,
    });
  }

  // Mongoose Cast Error (Invalid ID)
  if (err.name === "CastError") {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID format.",
    });
  }
  
  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "error",
      message: "Invalid token. Please log in again.",
    });
  }
  
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "error",
      message: "Token has expired. Please log in again.",
    });
  }

  // Default Error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
