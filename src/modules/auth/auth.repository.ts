import prisma from "../../config/prismaClient";

export const AuthRepository = {
    async findUserByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    },

    async createUser(data: any) {
        return prisma.user.create({ data });
    },

    async createRefreshToken(data: any) {
        return prisma.refreshToken.create({ data });
    },

    async findRefreshToken(token: string) {
        return prisma.refreshToken.findUnique({ where: { token }, include: { user: true } });
    },

    async revokeToken(id: number, replacedById?: number) {
        return prisma.refreshToken.update({
            where: { id },
            data: { revoked: true, replacedById },
        });
    },

    async findUserById(id: number) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                role: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                createdAt: true
            }
        });
    },

    async findUserWithPasswordById(id: number) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                password: true,
            }
        });
    },

    async setResetOtp(email: string, otp: string, expiry: Date) {
        return prisma.user.update({
            where: { email },
            data: { resetOtp: otp, resetOtpExpiry: expiry },
        });
    },

    async findUserByOtp(otp: string) {
        return prisma.user.findFirst({
            where: {
                resetOtp: otp,
                resetOtpExpiry: { gte: new Date() }, // OTP is valid
            },
        });
    },

    async resetPassword(userId: number, newPassword: string) {
        return prisma.user.update({
            where: { id: userId },
            data: { password: newPassword, resetOtp: null, resetOtpExpiry: null },
        });
    },

    async setEmailToken(email: string, token: string) {
        return prisma.user.update({
            where: { email },
            data: { emailToken: token },
        });
    },

    async verifyEmailToken(token: string) {
        return prisma.user.updateMany({
            where: { emailToken: token },
            data: { emailVerified: true, emailToken: null },
        });
    },

    // Change password for logged-in user
    async changePassword(userId: number, newPassword: string) {
        return prisma.user.update({
            where: { id: userId },
            data: { password: newPassword },
        });
    },
};
