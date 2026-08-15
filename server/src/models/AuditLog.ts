import mongoose, { Document, Schema } from "mongoose";

export interface IAuditLog extends Document {
  action: string;
  target?: string;
  userName: string;
  role?: string;
  ip?: string;
}

const AuditLogSchema: Schema = new Schema(
  {
    action: { type: String, required: true },
    target: { type: String },
    userName: { type: String, default: "System" },
    role: { type: String },
    ip: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
