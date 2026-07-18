"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarDays, Clock, MapPin, Video, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const appointmentSchema = z.object({
  type: z.enum(["in-store", "virtual"]),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  store: z.string().optional(),
  topic: z.string().min(1, "Please select a topic"),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

type Appointment = {
  id: string;
  type: "in-store" | "virtual";
  date: string;
  time: string;
  topic: string;
  status: string;
  link?: string;
  store?: string;
};

const upcomingAppointments: Appointment[] = [
  {
    id: "1",
    type: "virtual",
    date: "2026-07-20",
    time: "14:00",
    topic: "Engagement Ring Consultation",
    status: "confirmed",
    link: "meet.google.com/abc-defg-hij",
  },
];

export default function AppointmentsPage() {
  const [isBooking, setIsBooking] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>(upcomingAppointments);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      type: "virtual",
    },
  });

  const appointmentType = watch("type");

  const onSubmit = async (data: AppointmentFormValues) => {
    // Simulate API call
    const newApt: Appointment = {
      id: Date.now().toString(),
      type: data.type,
      date: data.date,
      time: data.time,
      topic: data.topic,
      status: "confirmed",
      link: data.type === "virtual" ? "meet.google.com/pending" : undefined,
      store: data.store,
    };
    
    setAppointments([...appointments, newApt]);
    setIsBooking(false);
    reset();
  };

  const inputClass =
    "w-full bg-transparent border border-border py-2.5 px-3 text-sm rounded-lg focus:outline-none focus:border-gold transition-colors";
  const labelClass =
    "text-xs uppercase tracking-wider font-medium text-muted-foreground";

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl mb-2">Appointments</h1>
          <p className="text-muted-foreground text-sm">
            Book a private consultation with our jewellery experts.
          </p>
        </div>
        {!isBooking && (
          <button
            onClick={() => setIsBooking(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-onyx dark:bg-gold text-white dark:text-onyx text-xs uppercase tracking-widest font-medium hover:bg-gold dark:hover:bg-white hover:text-onyx transition-colors rounded-lg w-fit"
          >
            <Plus size={16} /> Book Appointment
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isBooking ? (
          <motion.div
            key="booking-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border border-border rounded-xl p-6 md:p-8"
          >
            <h2 className="font-heading text-xl mb-6">Book a Consultation</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Type Selection */}
              <div className="space-y-3">
                <label className={labelClass}>Consultation Type *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-colors ${appointmentType === "virtual" ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}>
                    <input type="radio" value="virtual" {...register("type")} className="hidden" />
                    <Video size={20} className={appointmentType === "virtual" ? "text-gold" : "text-muted-foreground"} />
                    <div>
                      <p className="font-medium text-sm">Virtual Consultation</p>
                      <p className="text-xs text-muted-foreground">Video call with an expert</p>
                    </div>
                  </label>
                  
                  <label className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-colors ${appointmentType === "in-store" ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"}`}>
                    <input type="radio" value="in-store" {...register("type")} className="hidden" />
                    <MapPin size={20} className={appointmentType === "in-store" ? "text-gold" : "text-muted-foreground"} />
                    <div>
                      <p className="font-medium text-sm">In-Store Visit</p>
                      <p className="text-xs text-muted-foreground">Private boutique viewing</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Store Selection (if in-store) */}
              {appointmentType === "in-store" && (
                <div className="space-y-1.5">
                  <label className={labelClass}>Select Boutique *</label>
                  <select {...register("store")} className={inputClass}>
                    <option value="">Select a location...</option>
                    <option value="mumbai-flagship">Mumbai Flagship (Bandra)</option>
                    <option value="delhi-emporio">Delhi (DLF Emporio)</option>
                    <option value="bangalore-ub">Bangalore (UB City)</option>
                  </select>
                </div>
              )}

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className={labelClass}>Preferred Date *</label>
                  <input type="date" {...register("date")} className={inputClass} />
                  {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Preferred Time *</label>
                  <select {...register("time")} className={inputClass}>
                    <option value="">Select time...</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                  </select>
                  {errors.time && <p className="text-xs text-destructive">{errors.time.message}</p>}
                </div>
              </div>

              {/* Topic */}
              <div className="space-y-1.5">
                <label className={labelClass}>Topic of Interest *</label>
                <select {...register("topic")} className={inputClass}>
                  <option value="">Select topic...</option>
                  <option value="Engagement & Wedding">Engagement & Wedding</option>
                  <option value="High Jewellery Viewing">High Jewellery Viewing</option>
                  <option value="Custom Design">Custom Design & Bespoke</option>
                  <option value="Gifting">Gifting Advice</option>
                </select>
                {errors.topic && <p className="text-xs text-destructive">{errors.topic.message}</p>}
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className={labelClass}>Additional Notes</label>
                <textarea 
                  {...register("notes")} 
                  className={inputClass} 
                  rows={3}
                  placeholder="Any specific pieces you'd like to see?"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsBooking(false)}
                  className="px-6 py-2 border border-border text-sm font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2 bg-onyx dark:bg-gold text-white dark:text-onyx text-sm uppercase tracking-widest font-medium rounded-lg"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="appointments-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {appointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {appointments.map((apt) => (
                  <div key={apt.id} className="border border-border rounded-xl p-6 relative">
                    <div className="absolute top-0 right-0 bg-green-500/10 text-green-600 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl flex items-center gap-1">
                      <Check size={12} /> {apt.status}
                    </div>
                    
                    <h3 className="font-heading text-lg mb-4 pr-16">{apt.topic}</h3>
                    
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <CalendarDays size={16} className="text-gold" />
                        {new Date(apt.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-gold" />
                        {apt.time}
                      </div>
                      <div className="flex items-center gap-3">
                        {apt.type === 'virtual' ? (
                          <>
                            <Video size={16} className="text-gold" />
                            <a href={`https://${apt.link}`} target="_blank" rel="noreferrer" className="text-gold hover:underline">
                              Join Meeting
                            </a>
                          </>
                        ) : (
                          <>
                            <MapPin size={16} className="text-gold" />
                            <span>{apt.store}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border flex gap-4">
                      <button className="text-xs uppercase tracking-wider font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Reschedule
                      </button>
                      <button className="text-xs uppercase tracking-wider font-medium text-muted-foreground hover:text-destructive transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-border rounded-xl p-12 text-center flex flex-col items-center">
                <CalendarDays size={48} className="text-muted-foreground/20 mb-4" />
                <p className="text-muted-foreground mb-6">You have no upcoming appointments.</p>
                <button
                  onClick={() => setIsBooking(true)}
                  className="px-6 py-2 bg-onyx dark:bg-gold text-white dark:text-onyx text-sm uppercase tracking-widest font-medium rounded-lg"
                >
                  Book Now
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
