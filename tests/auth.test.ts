import { describe, it, expect, beforeAll, vi } from "vitest";
import request from "supertest";
import app from "../src/app";
import * as emailUtils from "../src/utils/email";

let testEmail = "test@example.com"; // make this unique if needed
let testPassword = "Test123!";
let otpCode: string | undefined;
let accessToken: string;

beforeAll(() => {
    vi.spyOn(emailUtils, "sendEmail").mockImplementation(async (to, subject, text, html) => {
        const match = text.match(/\d{6}/);
        if (match) otpCode = match[0];
    });
});

describe("Auth API", () => {
    it("should register a new user", async () => {
        const res = await request(app)
            .post("/api/v1/auth/register")
            .send({ email: testEmail, password: testPassword });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe(testEmail);
    });

    it("should login the user", async () => {
        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: testEmail, password: testPassword });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.accessToken).toBeDefined();
        expect(res.body.data.refreshToken).toBeDefined();

        accessToken = res.body.data.accessToken; // save for later tests
    });

    it("should get current user info", async () => {
        const res = await request(app)
            .get("/api/v1/auth/me")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data.email).toBe(testEmail);
    });

    it("should send forgot password OTP", async () => {
        const res = await request(app)
            .post("/api/v1/auth/forgot-password-otp")
            .send({ email: testEmail });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(otpCode).toBeDefined();
    });

    it("should reset password with OTP", async () => {
        const res = await request(app)
            .post("/api/v1/auth/reset-password-otp")
            .send({ otp: otpCode, newPassword: "NewPass123!" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it("should login with new password", async () => {
        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: testEmail, password: "NewPass123!" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        accessToken = res.body.data.accessToken;
    });

    it("should change password", async () => {
        const res = await request(app)
            .post("/api/v1/auth/change-password")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ oldPassword: "NewPass123!", newPassword: "FinalPass123!" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it("should login with changed password", async () => {
        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: testEmail, password: "FinalPass123!" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });
});
