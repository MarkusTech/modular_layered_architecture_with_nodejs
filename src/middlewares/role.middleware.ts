import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";

export function authorizeRole(...roles: string[]) {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new ApiError(403, "Forbidden");
        }
        next();
    };
}
