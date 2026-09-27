import { Router } from "express";
import { listUsers } from "../controller/admin.controller";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/users", authMiddleware, adminMiddleware, listUsers);

export default router;
