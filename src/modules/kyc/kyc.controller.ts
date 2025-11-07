import { Request, Response } from "express";
import { KycService } from "./kyc.service";

const kycService = new KycService();

export class KycController {
  async createSession(req: Request, res: Response) {
    try {
      const result = await kycService.createSession(req.body);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(err.statusCode || 500).json({ message: err.message });
    }
  }

  async webhook(req: Request, res: Response) {
    try {
      await kycService.handleWebhook(req.body);
      res.json({ received: true });
    } catch (err: any) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
  }

  async getStatus(req: Request, res: Response) {
    try {
      const email = req.query.email as string;

      const statusRecord = await kycService.getStatusByEmail(email);
      res.json(statusRecord);
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  }
}
