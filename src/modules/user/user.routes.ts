import { Router } from "express";
import { authenticate, requireRoles } from "../../middlewares/auth.middleware";

const router = Router();

router.get(
  "/me",
  authenticate,
  requireRoles("ADMIN", "USER"), // allowed roles
  (req, res) => {
    const user = (req as any).user;
    res.json({ user });
  }
);

export default router;
