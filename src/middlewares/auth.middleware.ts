import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import ApiError from "../utils/apiError";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new ApiError(401, "Missing or invalid Authorization header");
  }

  const token = header.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);

    if (!decoded.sub) {
      throw new ApiError(401, "Invalid token payload");
    }

    req.user = {
      id: typeof decoded.sub === "string" ? parseInt(decoded.sub, 10) : decoded.sub,
      role: decoded.role as string,
    };

    next();
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
}
