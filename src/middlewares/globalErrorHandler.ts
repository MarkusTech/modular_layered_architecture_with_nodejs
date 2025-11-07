import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";

export function globalErrorHandler(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    const statusCode = err.statusCode || 500;

    const response: { status: string; message: string; stack?: string } = {
        status: "error",
        message: err.message || "Internal Server Error",
    };

    // Only include stack in development
    if (process.env.NODE_ENV === "development" && err.stack) {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
}
