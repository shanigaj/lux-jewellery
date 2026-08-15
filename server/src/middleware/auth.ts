import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

// Extend Request interface to include user
export interface AuthRequest extends Request {
  user?: IUser;
}

// Links a signed-in user if a valid token is present, but never blocks guests.
export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.jwt;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
      const user = await User.findById(decoded.id);
      if (user) req.user = user;
    }
  } catch {
    // ignore — proceed as guest
  }
  next();
};

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;

    // Check cookies for token
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized to access this route" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role ${req.user?.role} is not authorized to access this route` 
      });
    }
    next();
  };
};
