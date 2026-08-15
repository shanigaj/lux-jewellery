import { Request, Response } from "express";
import User, { IUser } from "../models/User";

type AuthedRequest = Request & { user?: IUser };

async function loadUser(req: AuthedRequest) {
  // req.user is set by `protect`; reload to get a mutable, current doc.
  return User.findById(req.user?._id);
}

function ensureSingleDefault(user: IUser, defaultId?: string) {
  const hasDefault = user.addresses.some((a) => a.isDefault);
  if (!hasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }
  if (defaultId) {
    user.addresses.forEach((a) => {
      a.isDefault = String(a._id) === String(defaultId);
    });
  }
}

// @route GET /api/auth/addresses
export const getAddresses = async (req: AuthedRequest, res: Response) => {
  try {
    const user = await loadUser(req);
    res.status(200).json({ success: true, data: user?.addresses ?? [] });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @route POST /api/auth/addresses
export const addAddress = async (req: AuthedRequest, res: Response) => {
  try {
    const user = await loadUser(req);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    const makeDefault = req.body.isDefault || user.addresses.length === 0;
    user.addresses.push({ ...req.body, isDefault: false });
    if (makeDefault) {
      const added = user.addresses[user.addresses.length - 1];
      ensureSingleDefault(user, String(added._id));
    } else {
      ensureSingleDefault(user);
    }
    await user.save();
    res.status(201).json({ success: true, data: user.addresses });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

// @route PUT /api/auth/addresses/:addrId
export const updateAddress = async (req: AuthedRequest, res: Response) => {
  try {
    const user = await loadUser(req);
    const addr = user?.addresses.id(req.params.addrId);
    if (!user || !addr) {
      res.status(404).json({ success: false, message: "Address not found" });
      return;
    }
    const { isDefault, ...rest } = req.body;
    addr.set(rest);
    if (isDefault) ensureSingleDefault(user, String(addr._id));
    else ensureSingleDefault(user);
    await user.save();
    res.status(200).json({ success: true, data: user.addresses });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

// @route DELETE /api/auth/addresses/:addrId
export const deleteAddress = async (req: AuthedRequest, res: Response) => {
  try {
    const user = await loadUser(req);
    const addr = user?.addresses.id(req.params.addrId);
    if (!user || !addr) {
      res.status(404).json({ success: false, message: "Address not found" });
      return;
    }
    addr.deleteOne();
    ensureSingleDefault(user);
    await user.save();
    res.status(200).json({ success: true, data: user.addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
