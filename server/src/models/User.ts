import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: "user" | "admin" | "manager" | "support";
  tier: "silver" | "gold" | "platinum" | "diamond";
  isVerified: boolean;
  authProvider: "local" | "google" | "apple";
  providerId?: string;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  otp?: string;
  otpExpire?: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
    },
    password: { type: String, select: false },
    role: { type: String, enum: ["user", "admin", "manager", "support"], default: "user" },
    tier: { type: String, enum: ["silver", "gold", "platinum", "diamond"], default: "silver" },
    isVerified: { type: Boolean, default: false },
    authProvider: { type: String, enum: ["local", "google", "apple"], default: "local" },
    providerId: { type: String },
    refreshToken: { type: String, select: false },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    otp: String,
    otpExpire: Date,
  },
  { timestamps: true }
);

// Encrypt password before saving
UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
