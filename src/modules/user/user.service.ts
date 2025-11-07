import prisma from "../../config/prismaClient";
import { ImageService } from "../../services/image.service";

export class UserService {
    async updateProfile(userId: number, data: Partial<{
        firstName: string;
        lastName: string;
        phoneNumber: string;
        address: string;
        bio: string;
    }>) {
        return prisma.user.update({
            where: { id: userId },
            data,
        });
    }

    async updateProfileImage(userId: number, filePath: string) {
        const avatarUrl = await ImageService.uploadImage(filePath, "users/avatars", 300, 300);
        return prisma.user.update({
            where: { id: userId },
            data: { avatarUrl },
        });
    }

    async listUsers() {
        return prisma.user.findMany({
            select: { id: true, email: true, role: true, firstName: true, lastName: true, avatarUrl: true, createdAt: true },
        });
    }

    async getUserById(userId: number) {
        return prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, role: true, firstName: true, lastName: true, avatarUrl: true, createdAt: true },
        });
    }

    async deleteUser(userId: number) {
        return prisma.user.delete({ where: { id: userId } });
    }
}