import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class PaymentRepository {
    async create(data: any) {
        return prisma.payment.create({ data });
    }

    async updateStatus(id: string, status: string, stripePaymentId?: string) {
        return prisma.payment.update({
            where: { id },
            data: { status, stripePaymentId },
        });
    }

    async findById(id: string) {
        return prisma.payment.findUnique({ where: { id } });
    }

    async findAll() {
        return prisma.payment.findMany({ orderBy: { createdAt: "desc" } });
    }
}
