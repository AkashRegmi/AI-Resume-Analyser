import { Router } from "express";
import {
  loginController,
  refreshTokenController,
  registeOwner,
  verifyUserOtpController,
} from "../controller/user.controller";
import {
  LoginSchema,
  registerOwnerSchema,
  refreshTokenSchema,
  verifyOTPSchema,
} from "../schema/user.schema";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

router.post("/register", validate(registerOwnerSchema), registeOwner);
router.post("/verify", validate(verifyOTPSchema), verifyUserOtpController);
router.post("/login", validate(LoginSchema), loginController);
router.post("/refresh", validate(refreshTokenSchema), refreshTokenController);
export default router;
