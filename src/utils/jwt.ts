import jwt, { SignOptions, Secret } from "jsonwebtoken";
import {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} from "../config/env";

export function signAccessToken(payload: object) {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as any };
  return jwt.sign(payload, JWT_SECRET as Secret, options);
}

export function signRefreshToken(payload: object) {
  const options: SignOptions = { expiresIn: JWT_REFRESH_EXPIRES_IN as any };
  return jwt.sign(payload, JWT_REFRESH_SECRET as Secret, options);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET as Secret) as jwt.JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET as Secret) as jwt.JwtPayload;
}
