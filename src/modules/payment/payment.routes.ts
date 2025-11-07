import express, { Router } from "express";
import { PaymentController } from "./payment.controller";

const router = Router();
const controller = new PaymentController();

// Stripe webhook (raw body)
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    controller.handleWebhook.bind(controller)
);

// Standard JSON endpoints
router.use(express.json());
router.post("/create", controller.createPayment.bind(controller));
router.get("/", controller.getAllPayments.bind(controller));
router.get("/:id", controller.getPaymentById.bind(controller));
router.put("/:id/status", controller.updatePaymentStatus.bind(controller));

export default router;
