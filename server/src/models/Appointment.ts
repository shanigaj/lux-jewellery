import mongoose, { Document, Schema } from "mongoose";

export interface IAppointment extends Document {
  user?: mongoose.Types.ObjectId;
  experience: string;
  boutiqueId?: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  interest?: string;
  notes?: string;
  status: "requested" | "confirmed" | "completed" | "cancelled";
}

const AppointmentSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    experience: { type: String, required: true },
    boutiqueId: { type: String },
    date: { type: String, required: true },
    time: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    interest: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ["requested", "confirmed", "completed", "cancelled"],
      default: "requested",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAppointment>("Appointment", AppointmentSchema);
