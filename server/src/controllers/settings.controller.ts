import { Request, Response } from "express";
import Settings from "../models/Settings";
import { logAudit } from "./audit.controller";

// Fields a client is allowed to write (ignore key/_id/timestamps).
const EDITABLE = [
  "storeName",
  "supportEmail",
  "supportPhone",
  "address",
  "currency",
  "timezone",
  "freeShippingThreshold",
  "announcements",
] as const;

async function getOrCreate() {
  let doc = await Settings.findOne({ key: "site" });
  if (!doc) doc = await Settings.create({ key: "site" });
  return doc;
}

// @desc    Get site settings (creates defaults on first read)
// @route   GET /api/settings
// @access  Public
export const getSettings = async (_req: Request, res: Response) => {
  try {
    const doc = await getOrCreate();
    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Admin
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const update: Record<string, unknown> = {};
    for (const f of EDITABLE) {
      if (req.body[f] !== undefined) update[f] = req.body[f];
    }
    const doc = await Settings.findOneAndUpdate({ key: "site" }, update, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });
    logAudit(req, "Updated Settings");
    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};
