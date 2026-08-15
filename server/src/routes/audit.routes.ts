import { Router } from "express";
import { getAuditLogs } from "../controllers/audit.controller";
import { protect, authorize } from "../middleware/auth";

const router = Router();

router.get("/", protect, authorize("admin"), getAuditLogs);

export default router;
