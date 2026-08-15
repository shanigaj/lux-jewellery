import { Router } from "express";
import {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
} from "../controllers/appointment.controller";
import { protect, optionalAuth, authorize } from "../middleware/auth";

const router = Router();

// Book (guests allowed; linked to the user if signed in)
router.post("/", optionalAuth, createAppointment);

// Current user's appointments
router.get("/mine", protect, getMyAppointments);

// Admin
router.get("/", protect, authorize("admin"), getAllAppointments);
router.put("/:id/status", protect, authorize("admin"), updateAppointmentStatus);

export default router;
