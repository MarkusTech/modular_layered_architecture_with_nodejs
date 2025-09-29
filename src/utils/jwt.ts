import jwt, { SignOptions, Secret } from "jsonwebtoken";

const ACCESS_SECRET: Secret = process.env.JWT_SECRET as Secret;
const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET as Secret;

const ACCESS_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "15m") as SignOptions["expiresIn"];
const REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as SignOptions["expiresIn"];

export function signAccessToken(payload: object) {
  const options: SignOptions = { expiresIn: ACCESS_EXPIRES_IN };
  return jwt.sign(payload, ACCESS_SECRET, options);
}

export function signRefreshToken(payload: object) {
  const options: SignOptions = { expiresIn: REFRESH_EXPIRES_IN };
  return jwt.sign(payload, REFRESH_SECRET, options);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET) as jwt.JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET) as jwt.JwtPayload;
}
