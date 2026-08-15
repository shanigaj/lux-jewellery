"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Loader2 } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const resetSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormValues) => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password: data.password });
      toast.success("Password reset successfully. You can now log in.");
      router.push("/login");
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || "Failed to reset password. The link may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="font-heading text-2xl mb-4 text-destructive">Invalid Link</h1>
        <p className="text-muted-foreground">The password reset link is invalid or has expired.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <AnimatedSection animation="fadeUp" className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl mb-2">New Password</h1>
          <p className="text-muted-foreground text-sm font-light">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <PasswordInput
            label="New Password"
            error={errors.password?.message}
            {...register("password")}
          />

          <PasswordInput
            label="Confirm New Password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-onyx dark:bg-gold text-white dark:text-onyx py-3 text-sm uppercase tracking-widest font-medium hover:bg-gold dark:hover:bg-white hover:text-onyx transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Reset Password"}
          </button>
        </form>

      </AnimatedSection>
    </div>
  );
}
