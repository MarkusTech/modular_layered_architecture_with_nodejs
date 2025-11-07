import { Router } from "express";
import multer from "multer";
import { UserController } from "./user.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorizeRole } from "../../middlewares/role.middleware";


const upload = multer({ dest: "uploads/" });
const router = Router();
const controller = new UserController();

// Protected profile routes
router.put("/profile", authenticate, controller.updateProfile.bind(controller));
router.post("/profile/avatar", authenticate, upload.single("avatar"), controller.uploadAvatar.bind(controller));

// Admin routes
router.get("/", authenticate, authorizeRole("ADMIN"), controller.listUsers.bind(controller));
router.get("/:id", authenticate, authorizeRole("ADMIN"), controller.getUserById.bind(controller));
router.delete("/:id", authenticate, authorizeRole("ADMIN"), controller.deleteUser.bind(controller));


export default router;
