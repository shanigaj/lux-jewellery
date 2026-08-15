import { Request, Response } from "express";
import Appointment from "../models/Appointment";
import { logAudit } from "./audit.controller";

type AuthedRequest = Request & { user?: { _id: string } };

// @desc    Book an appointment (guests allowed; linked to user if signed in)
// @route   POST /api/appointments
// @access  Public (optional auth)
export const createAppointment = async (req: AuthedRequest, res: Response) => {
  try {
    const appt = await Appointment.create({
      ...req.body,
      user: req.user?._id,
    });
    res.status(201).json({ success: true, data: appt });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Current user's appointments
// @route   GET /api/appointments/mine
// @access  Private
export const getMyAppointments = async (req: AuthedRequest, res: Response) => {
  try {
    const items = await Appointment.find({ user: req.user?._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    All appointments (admin)
// @route   GET /api/appointments
// @access  Admin
export const getAllAppointments = async (_req: Request, res: Response) => {
  try {
    const items = await Appointment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Update appointment status (admin)
// @route   PUT /api/appointments/:id/status
// @access  Admin
export const updateAppointmentStatus = async (req: AuthedRequest, res: Response) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!appt) {
      res.status(404).json({ success: false, message: "Appointment not found" });
      return;
    }
    logAudit(req, "Updated Appointment", appt.name);
    res.status(200).json({ success: true, data: appt });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};
