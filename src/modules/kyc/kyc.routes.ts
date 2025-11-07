import { Router } from "express";
import { KycController } from "./kyc.controller";

const router = Router();
const controller = new KycController();

router.post("/session", controller.createSession.bind(controller));

// Webhook route (use raw body middleware in app.ts)
router.post("/webhook", controller.webhook.bind(controller));

// get status
router.get("/status", controller.getStatus.bind(controller));

export default router;
