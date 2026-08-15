import { Request, Response } from "express";
import AuditLog from "../models/AuditLog";

interface AuthedRequest extends Request {
  user?: { _id?: string; id?: string; firstName?: string; lastName?: string; email?: string; role?: string };
}

/**
 * Fire-and-forget audit trail writer. Never throws into the request path —
 * a logging failure must not break the action being logged.
 */
export async function logAudit(req: AuthedRequest, action: string, target?: string) {
  try {
    const u = req.user;
    const userName = u
      ? [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email || "Admin"
      : "System";
    await AuditLog.create({
      action,
      target,
      userName,
      role: u?.role,
      ip: req.headers["x-forwarded-for"]?.toString() || req.socket?.remoteAddress || "",
    });
  } catch {
    // swallow — auditing is best-effort
  }
}

// @desc    List audit logs (most recent first)
// @route   GET /api/audit-logs
// @access  Admin
export const getAuditLogs = async (_req: Request, res: Response) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(200);
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
