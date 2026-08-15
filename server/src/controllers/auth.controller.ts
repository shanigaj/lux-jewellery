import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";

// --- Helper Functions ---
const signToken = (id: string, secret: string, expiresIn: string) => {
  return jwt.sign({ id }, secret as jwt.Secret, { expiresIn: expiresIn as any });
};

const sendTokenResponse = (user: IUser, statusCode: number, res: Response) => {
  // Create token
  const userIdStr = user._id.toString();
  const token = signToken(userIdStr, process.env.JWT_SECRET as string, "15m");
  const refreshToken = signToken(userIdStr, process.env.JWT_REFRESH_SECRET as string, "7d");

  const options = {
    expires: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  const refreshOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  res
    .status(statusCode)
    .cookie("jwt", token, options)
    .cookie("jwtRefresh", refreshToken, refreshOptions)
    .json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
};

// --- Controllers ---

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Generate mock OTP (normally sent via email)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      otp,
      otpExpire,
    });

    // In a real app, send OTP via email here.
    // For this mockup, we'll return it in the response so the frontend can display it in dev mode.
    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify OTP.",
      mockOtp: otp, // DEV ONLY
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      otp,
      otpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide an email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      // Re-generate OTP if not verified
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      return res.status(403).json({
        success: false,
        message: "Please verify your email",
        needsVerification: true,
        mockOtp: otp // DEV ONLY
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Refresh Token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.jwtRefresh;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
};

// @desc    Logout user / clear cookies
// @route   POST /api/auth/logout
// @access  Public
export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.cookie("jwtRefresh", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // Don't leak whether email exists
      return res.status(200).json({ success: true, message: "If an account exists, a reset email will be sent." });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Reset your Sparenza & Co. password",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto">
            <h2 style="color:#111">Reset your password</h2>
            <p>We received a request to reset your Sparenza &amp; Co. password. This link is valid for 10 minutes.</p>
            <p style="margin:28px 0">
              <a href="${resetUrl}" style="background:#111;color:#fff;padding:12px 22px;border-radius:6px;text-decoration:none">Reset password</a>
            </p>
            <p style="color:#666;font-size:13px">If you didn't request this, you can safely ignore this email.</p>
          </div>`,
      });
    } catch {
      // Roll back the token so a stale one can't linger if the email failed.
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(500).json({ success: false, message: "Could not send reset email. Please try again." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "If an account exists, a reset email has been sent.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Reset password using the emailed token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body ?? {};
    if (!token || !password || String(password).length < 6) {
      res.status(400).json({ success: false, message: "A valid token and a password (min 6 chars) are required." });
      return;
    }

    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: new Date() },
    }).select("+password");

    if (!user) {
      res.status(400).json({ success: false, message: "This reset link is invalid or has expired." });
      return;
    }

    user.password = password; // hashed by the pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset. You can now sign in." });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Get the signed-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as unknown as { user: { _id: string } }).user._id).select(
      "firstName lastName email phone role tier isVerified createdAt"
    );
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Update the signed-in user's profile
// @route   PUT /api/auth/me
// @access  Private
export const updateMe = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const update: Record<string, unknown> = {};
    if (firstName !== undefined) update.firstName = firstName;
    if (lastName !== undefined) update.lastName = lastName;
    if (phone !== undefined) update.phone = phone;

    const user = await User.findByIdAndUpdate(
      (req as unknown as { user: { _id: string } }).user._id,
      update,
      { new: true, runValidators: true }
    ).select("firstName lastName email phone role tier");

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

// @desc    List all users (admin)
// @route   GET /api/auth/users
// @access  Admin
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find()
      .select("firstName lastName email role tier isVerified createdAt")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
