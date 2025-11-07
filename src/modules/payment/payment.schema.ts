import { z } from "zod";

export const createPaymentSchema = z.object({
    userId: z.string().optional(),
    amount: z.number().positive({ message: "Amount must be greater than zero" }),
    currency: z.string().default("usd"),
    description: z.string().optional(),
});

export const updatePaymentStatusSchema = z.object({
    status: z.enum(["pending", "succeeded", "failed", "canceled"]),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>;
