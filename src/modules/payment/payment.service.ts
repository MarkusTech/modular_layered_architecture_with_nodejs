import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
import { PaymentRepository } from "./payment.repository";
import { CreatePaymentInput } from "./payment.schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-09-30.clover" as any,
});

export class PaymentService {
    private paymentRepo = new PaymentRepository();

    async createPayment(data: CreatePaymentInput) {
        const { userId, amount, currency } = data;

        const payment = await this.paymentRepo.create({
            userId: userId ?? "guest", // ✅ fallback value
            amount,
            currency,
            status: "pending",
        });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency,
            metadata: {
                paymentId: payment.id,
                userId: userId ?? "guest",
            },
        });

        await this.paymentRepo.updateStatus(payment.id, "pending", paymentIntent.id);

        return { id: payment.id, clientSecret: paymentIntent.client_secret };
    }

    async handleWebhook(event: Stripe.Event) {
        const data = event.data.object as Stripe.PaymentIntent;

        switch (event.type) {
            case "payment_intent.succeeded":
                await this.paymentRepo.updateStatus(
                    data.metadata.paymentId,
                    "succeeded",
                    data.id
                );
                break;

            case "payment_intent.payment_failed":
                await this.paymentRepo.updateStatus(
                    data.metadata.paymentId,
                    "failed",
                    data.id
                );
                break;

            case "payment_intent.canceled":
                await this.paymentRepo.updateStatus(
                    data.metadata.paymentId,
                    "canceled",
                    data.id
                );
                break;
        }
    }

    async getPaymentById(id: string) {
        return this.paymentRepo.findById(id);
    }

    async listPayments() {
        return this.paymentRepo.findAll();
    }

    async updatePaymentStatus(id: string, status: string) {
        return this.paymentRepo.updateStatus(id, status);
    }
}
