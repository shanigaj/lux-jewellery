import { Router } from "express";
import { register, login, verifyOTP, refreshToken, logout, forgotPassword, getUsers } from "../controllers/auth.controller";
import { protect, authorize } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);

// Admin
router.get("/users", protect, authorize("admin"), getUsers);

export default router;
