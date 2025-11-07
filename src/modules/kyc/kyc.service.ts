import axios from "axios";
import ApiError from "../../utils/apiError";
import { CreateKycSessionDto } from "./kyc.dto";
import { KycRepository } from "./kyc.repository";
import {
  DIDIT_API_BASE,
  DIDIT_API_KEY,
  DIDIT_WORKFLOW_ID,
  FRONTEND_URL,
} from "../../config/env";
import { ably } from "../../config/ably";

export class KycService {
  private kycRepo = new KycRepository();

  async createSession(dto: CreateKycSessionDto) {
    const { email, age } = dto;

    if (age < 21) {
      throw new ApiError(400, "User must be 21 or older to continue KYC.");
    }

    try {
      const response = await axios.post(
        `${DIDIT_API_BASE}/session/`,
        {
          workflow_id: DIDIT_WORKFLOW_ID,
          vendor_data: email,
          metadata: { email, age },
          success_redirect_url: `${FRONTEND_URL}/kyc/success`,
          cancel_redirect_url: `${FRONTEND_URL}/kyc/cancel`,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": DIDIT_API_KEY,
          },
        }
      );

      const data = response.data;

      // Store KYC session info in DB
      const kycRecord = await this.kycRepo.createKyc(email, age, data.session_id);

      return {
        kycRecord,
        diditSessionUrl: data.url,
      };
    } catch (error: any) {
      console.error("Didit API Error:", error.response?.data || error.message);
      throw new ApiError(500, "Failed to create KYC session");
    }
  }

  async handleWebhook(eventBody: any) {
    try {
      const sessionId = eventBody.session_id;
      let status = eventBody.status;

      if (!sessionId || !status) {
        console.warn("⚠️ Webhook missing session_id or status");
        return;
      }

      status = status.toUpperCase();

      console.log(`Session ${sessionId} has status: ${status}`);

      if (status === "Approved") {
        await this.kycRepo.updateStatus(sessionId, status);

        const record = await this.kycRepo.findBySessionId(sessionId);
        if (record?.email) {
          await ably.channels
            .get(`user-${record.email}`)
            .publish("kycUpdate", { status, sessionId });
          console.log(`Published KYC update to user-${record.email}`);
        }
      }
      // Update DB
      await this.kycRepo.updateStatus(sessionId, status);
      const record = await this.kycRepo.findBySessionId(sessionId);
      if (record?.email) {
        // Publish event to Ably channel for this user
        await ably.channels
          .get(`user-${record.email}`)
          .publish("kycUpdate", { status, sessionId });
        console.log(`Published KYC update to usersssssssssssssssssssssssssssssssssssssssssssssssss-${record.email}`);
      }
    } catch (err: any) {
      console.error("Webhook error:", err.message);
      throw err;
    }
  }

  async getStatusByEmail(email: string) {
    if (!email) {
      throw new Error("Email is required");
    }

    const record = await this.kycRepo.findByEmail(email);

    if (!record) {
      throw new Error("KYC record not found");
    }

    return record;
  }
}
