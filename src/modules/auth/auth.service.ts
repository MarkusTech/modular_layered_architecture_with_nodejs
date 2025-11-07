import bcrypt from "bcrypt";
import ApiError from "../../utils/apiError";
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from "../../utils/jwt";
import { AuthRepository } from "./auth.repository";
import { sendEmail } from "../../utils/email";
import { randomBytes } from "crypto";

export const AuthService = {
    async register({
        email,
        password,
        role = "USER",
    }: {
        email: string;
        password: string;
        role?: string;
    }) {
        const existing = await AuthRepository.findUserByEmail(email);
        if (existing) throw new ApiError(400, "Email already registered");

        const hashed = await bcrypt.hash(password, 12);
        const user = await AuthRepository.createUser({ email, password: hashed, role });

        return { id: user.id, email: user.email, role: user.role };
    },

    async login({ email, password }: { email: string; password: string }) {
        const user = await AuthRepository.findUserByEmail(email);
        if (!user) throw new ApiError(401, "Invalid credentials");

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) throw new ApiError(401, "Invalid credentials");

        const accessToken = signAccessToken({ sub: user.id, role: user.role });

        // Generate a unique refresh token for the database
        const refreshToken = randomBytes(64).toString("hex");

        const decoded = verifyRefreshToken(signRefreshToken({ sub: user.id }));
        const expiresAt = decoded.exp
            ? new Date(decoded.exp * 1000)
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await AuthRepository.createRefreshToken({
            token: refreshToken,
            userId: user.id,
            expiresAt,
        });

        return {
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email, role: user.role },
        };
    },

    async me(userId: number) {
        const user = await AuthRepository.findUserById(userId);
        if (!user) throw new ApiError(404, "User not found");

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
        };
    },

    async refresh({ refreshToken }: { refreshToken: string }) {
        if (!refreshToken) throw new ApiError(400, "Missing refresh token");

        let decoded;
        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch {
            throw new ApiError(401, "Invalid refresh token");
        }

        const existing = await AuthRepository.findRefreshToken(refreshToken);
        if (!existing) throw new ApiError(401, "Unknown refresh token");
        if (existing.revoked) throw new ApiError(401, "Refresh token revoked");
        if (existing.expiresAt < new Date()) {
            await AuthRepository.revokeToken(existing.id);
            throw new ApiError(401, "Refresh token expired");
        }

        // Generate a new unique refresh token
        const newRefreshToken = randomBytes(64).toString("hex");

        const newDecoded = verifyRefreshToken(signRefreshToken({ sub: existing.user.id }));
        const newExpiresAt = newDecoded.exp
            ? new Date(newDecoded.exp * 1000)
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const newTokenRecord = await AuthRepository.createRefreshToken({
            token: newRefreshToken,
            userId: existing.user.id,
            parentTokenId: existing.id,
            expiresAt: newExpiresAt,
        });

        await AuthRepository.revokeToken(existing.id, newTokenRecord.id);

        const newAccessToken = signAccessToken({
            sub: existing.user.id,
            role: existing.user.role,
        });

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    },

    async logout({ refreshToken }: { refreshToken: string }) {
        const existing = await AuthRepository.findRefreshToken(refreshToken);
        if (existing) await AuthRepository.revokeToken(existing.id);
    },

    async forgotPasswordOtp(email: string) {
        const user = await AuthRepository.findUserByEmail(email);
        if (!user) throw new ApiError(404, "User not found");

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000);

        await AuthRepository.setResetOtp(email, otp, expiry);

        await sendEmail(
            email,
            "Your password reset OTP",
            `Your OTP code is: ${otp}. It expires in 10 minutes.`,
            `<h1>Password Reset OTP</h1><p>Your OTP code is: <b>${otp}</b></p><p>Expires in 10 minutes.</p>`
        );

        return { message: "OTP sent to your email" };
    },

    async resetPasswordWithOtp(otp: string, newPassword: string) {
        const user = await AuthRepository.findUserByOtp(otp);
        if (!user) throw new ApiError(400, "Invalid or expired OTP");

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await AuthRepository.resetPassword(user.id, hashedPassword);

        return { message: "Password reset successful" };
    },

    async sendEmailVerification(email: string) {
        const user = await AuthRepository.findUserByEmail(email);
        if (!user) throw new ApiError(404, "User not found");

        const token = randomBytes(32).toString("hex");
        await AuthRepository.setEmailToken(email, token);

        await sendEmail(
            email,
            "Verify your email",
            `Please verify your email using this link: https://yourfrontend.com/verify-email?token=${token}`,
            `<h1>Email Verification</h1><p>Click the link below to verify your email:</p>
        <a href="https://yourfrontend.com/verify-email?token=${token}">Verify Email</a>`
        );

        return { message: "Verification email sent" };
    },

    async verifyEmail(token: string) {
        const result = await AuthRepository.verifyEmailToken(token);
        if (result.count === 0) throw new ApiError(400, "Invalid or expired token");
        return { message: "Email verified successfully" };
    },

    async changePassword(userId: number, oldPassword: string, newPassword: string) {
        const user = await AuthRepository.findUserWithPasswordById(userId);
        if (!user) throw new ApiError(404, "User not found");

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) throw new ApiError(400, "Old password is incorrect");

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await AuthRepository.changePassword(userId, hashedPassword);

        return { message: "Password changed successfully" };
    }
};
