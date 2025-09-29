import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({
    status: "error",
    message: `Not Found - ${req.originalUrl}`,
  });
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
