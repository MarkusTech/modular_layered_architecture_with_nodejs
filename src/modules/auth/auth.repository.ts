import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: {
    email: string;
    password: string;
    name: string;
    tenantId: string;
    role?: "USER" | "ADMIN" | "VENDOR";
  }) {
    return prisma.user.create({ data });
  }
}
