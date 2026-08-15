import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller";
import { protect, authorize } from "../middleware/auth";

const router = Router();

router.get("/", getSettings);
router.put("/", protect, authorize("admin"), updateSettings);

export default router;
