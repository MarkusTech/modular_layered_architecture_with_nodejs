import prisma from "../../config/prismaClient";

export class KycRepository {
  async createKyc(email: string, age: number, diditSessionId: string) {
    return prisma.kycVerification.create({
      data: { email, age, diditSessionId, status: "PENDING" },
    });
  }

  async updateStatus(diditSessionId: string, status: string) {
    const result = await prisma.kycVerification.updateMany({
      where: { diditSessionId },
      data: { status },
    });

    console.log(`📝 Updated ${result.count} record(s) for session ${diditSessionId} → ${status}`);
    return result;
  }

  async findBySessionId(diditSessionId: string) {
    return prisma.kycVerification.findFirst({ where: { diditSessionId } });
  }

  async findByEmail(email: string) {
    return prisma.kycVerification.findUnique({
      where: { email },
      select: { status: true, diditSessionId: true, updatedAt: true },
    });
  }
}
