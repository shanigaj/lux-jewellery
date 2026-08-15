"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/axios";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  birthday: z.string().optional(),
  anniversary: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: "", lastName: "", email: "", phone: "" },
  });

  // Load the signed-in user's real profile.
  useEffect(() => {
    let active = true;
    api
      .get("/auth/me")
      .then((res) => {
        if (!active) return;
        const u = res.data?.data;
        if (u) reset({ firstName: u.firstName ?? "", lastName: u.lastName ?? "", email: u.email ?? "", phone: u.phone ?? "" });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      await api.put("/auth/me", { firstName: data.firstName, lastName: data.lastName, phone: data.phone });
      toast.success("Profile updated successfully");
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full bg-transparent border border-border py-2.5 px-3 text-sm rounded-lg focus:outline-none focus:border-gold transition-colors";
  const labelClass =
    "text-xs uppercase tracking-wider font-medium text-muted-foreground";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl mb-2">Profile Details</h1>
        <p className="text-muted-foreground text-sm">
          Update your personal information and important dates to receive special benefits.
        </p>
      </div>

      <div className="border border-border rounded-xl p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className={labelClass}>First Name *</label>
              <input {...register("firstName")} className={inputClass} />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Last Name *</label>
              <input {...register("lastName")} className={inputClass} />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className={labelClass}>Email Address *</label>
              <input {...register("email")} type="email" className={inputClass} disabled />
              <p className="text-[10px] text-muted-foreground">Email cannot be changed directly.</p>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Phone Number *</label>
              <input {...register("phone")} type="tel" className={inputClass} />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
            <div className="space-y-1.5">
              <label className={labelClass}>Birthday</label>
              <input {...register("birthday")} type="date" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Anniversary</label>
              <input {...register("anniversary")} type="date" className={inputClass} />
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-onyx dark:bg-gold text-white dark:text-onyx text-sm uppercase tracking-widest font-medium hover:bg-gold dark:hover:bg-white hover:text-onyx transition-colors rounded-lg disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <div className="border border-border rounded-xl p-6 md:p-8">
        <h2 className="font-heading text-lg mb-4">Password & Security</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Keep your account secure by updating your password regularly.
        </p>
        <button className="px-6 py-2 border border-border text-xs uppercase tracking-wider font-medium hover:border-gold transition-colors rounded-lg">
          Change Password
        </button>
      </div>
    </div>
  );
}
