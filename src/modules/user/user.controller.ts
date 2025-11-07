import { Request, Response } from "express";
import multer from "multer";
import { authenticate } from "../../middlewares/auth.middleware";
import { UserService } from "./user.service";
import { success } from "zod";

const upload = multer({ dest: "uploads/" });
const userService = new UserService();

export class UserController {
    async updateProfile(req: Request, res: Response) {
        const userId = req.user!.id;
        const updatedUser = await userService.updateProfile(userId, req.body);
        res.status(200).json({
            status: "success",
            message: "Profile Updated Successfully",
            data: updatedUser
        });
    }

    async uploadAvatar(req: Request, res: Response) {
        const userId = req.user!.id;
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const updatedUser = await userService.updateProfileImage(userId, req.file.path);
        res.json({
            success: true,
            message: "Avatar uploaded successfully",
            data: updatedUser
        });
    }

    async listUsers(req: Request, res: Response) {
        const users = await userService.listUsers();
        res.json({ status: "success", data: users });
    }

    async getUserById(req: Request, res: Response) {
        const userId = parseInt(req.params.id, 10);
        const user = await userService.getUserById(userId);
        if (!user) return res.status(404).json({ status: "error", message: "User not found" });
        res.json({
            success: true,
            message: "User retrieved successfully",
            data: user
        });
    }

    async deleteUser(req: Request, res: Response) {
        const userId = parseInt(req.params.id, 10);
        await userService.deleteUser(userId);
        res.json({
            success: true,
            message: "User deleted"
        });
    }
}
