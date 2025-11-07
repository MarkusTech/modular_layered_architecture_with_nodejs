import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { success } from "zod";

export const AuthController = {
    async register(req: Request, res: Response) {
        const { email, password, role } = req.body;
        const user = await AuthService.register({ email, password, role });
        res.status(201).json({
            status: 201,
            success: true,
            message: "User registered successfully",
            data: user
        });
    },

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const result = await AuthService.login({ email, password });
        res.status(200).json({
            status: 200,
            success: true,
            message: "Login successful",
            data: result
        })
    },

    async refresh(req: Request, res: Response) {
        const { refreshToken } = req.body;
        const result = await AuthService.refresh({ refreshToken });
        res.status(200).json({
            status: 200,
            success: true,
            message: "Token refreshed successfully",
            data: result
        })
    },

    async me(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    status: "error",
                    message: "Unauthorized",
                });
            }

            const user = await AuthService.me(req.user.id);

            res.status(200).json({
                status: 200,
                success: true,
                message: "Current user retrieved successfully",
                data: user,
            });
        } catch (err: any) {
            res.status(err.statusCode || 500).json({
                status: "error",
                message: err.message || "Internal Server Error",
            });
        }
    },

    async logout(req: Request, res: Response) {
        const { refreshToken } = req.body;
        await AuthService.logout({ refreshToken });
        res.status(200).json({
            status: 200,
            success: true,
            message: "Logout successful",
        });
    },

    async forgotPasswordOtp(req: Request, res: Response) {
        const { email } = req.body;
        const result = await AuthService.forgotPasswordOtp(email);
        res.status(200).json({ status: 200, success: true, message: result.message });
    },

    async resetPasswordWithOtp(req: Request, res: Response) {
        const { otp, newPassword } = req.body;
        const result = await AuthService.resetPasswordWithOtp(otp, newPassword);
        res.status(200).json({ status: 200, success: true, message: result.message });
    },

    async sendEmailVerification(req: Request, res: Response) {
        const { email } = req.body;
        const result = await AuthService.sendEmailVerification(email);
        res.status(200).json({ status: 200, success: true, message: result.message });
    },

    async verifyEmail(req: Request, res: Response) {
        const { token } = req.body;
        const result = await AuthService.verifyEmail(token);
        res.status(200).json({ status: 200, success: true, message: result.message });
    },

    async changePassword(req: Request, res: Response) {
        const { oldPassword, newPassword } = req.body;
        if (!req.user) return res.status(401).json({ status: "error", message: "Unauthorized" });

        const result = await AuthService.changePassword(req.user.id, oldPassword, newPassword);
        res.status(200).json({ status: 200, success: true, message: result.message });
    },
};
