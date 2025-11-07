import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { createPaymentSchema, updatePaymentStatusSchema } from "./payment.schema";
import Stripe from "stripe";

const service = new PaymentService();

export class PaymentController {
    async createPayment(req: Request, res: Response) {
        const parsed = createPaymentSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ status: "error", issues: parsed.error.issues });
        }
        const result = await service.createPayment(parsed.data);
        return res.json({ status: "success", data: result });
    }

    async getAllPayments(req: Request, res: Response) {
        const payments = await service.listPayments();
        res.json({ status: "success", data: payments });
    }

    async getPaymentById(req: Request, res: Response) {
        const { id } = req.params;
        const payment = await service.getPaymentById(id);

        if (!payment) {
            return res.status(404).json({ status: "error", message: "Payment not found" });
        }

        res.json({ status: "success", data: payment });
    }

    async updatePaymentStatus(req: Request, res: Response) {
        const { id } = req.params;
        const parsed = updatePaymentStatusSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ status: "error", issues: parsed.error.issues });
        }

        const updated = await service.updatePaymentStatus(id, parsed.data.status);
        if (!updated) {
            return res.status(404).json({ status: "error", message: "Payment not found" });
        }

        res.json({ status: "success", message: "Payment status updated", data: updated });
    }

    async handleWebhook(req: Request, res: Response) {
        const sig = req.headers["stripe-signature"];
        if (!sig) {
            return res.status(400).send("Missing Stripe signature header");
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: "2025-09-30.clover" as any,
        });

        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (err: any) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        await service.handleWebhook(event);
        res.json({ received: true });
    }
}
