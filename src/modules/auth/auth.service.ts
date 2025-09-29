import bcrypt from "bcryptjs";
import prisma from "../../config/prismaClient";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import ApiError from "../../utils/apiError";

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(401, "Invalid email or password");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new ApiError(401, "Invalid email or password");

  const accessToken = signAccessToken({ id: user.id, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id, role: user.role });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}

export async function refreshToken(refreshToken: string) {
  // verify and issue new access token
  try {
    const decoded = verifyRefreshToken(refreshToken);
    // you could also check a DB store of refresh tokens here
    const accessToken = signAccessToken({ id: decoded.id, role: decoded.role });
    return { accessToken };
  } catch (err) {
    throw new ApiError(401, "Invalid refresh token");
  }
}