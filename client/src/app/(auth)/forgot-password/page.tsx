"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Loader2, ArrowLeft } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setIsLoading(true);
    try {
      await api.post("/auth/forgot-password", data);
      setIsSent(true);
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <AnimatedSection animation="fadeUp" className="w-full max-w-md">
        
        <Link href="/login" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-muted-foreground hover:text-gold transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>

        {!isSent ? (
          <>
            <div className="mb-8">
              <h1 className="font-heading text-3xl mb-2">Reset Password</h1>
              <p className="text-muted-foreground text-sm font-light">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-gold transition-colors"
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-onyx dark:bg-gold text-white dark:text-onyx py-3 text-sm uppercase tracking-widest font-medium hover:bg-gold dark:hover:bg-white hover:text-onyx transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="font-heading text-2xl mb-2">Check your email</h2>
            <p className="text-muted-foreground text-sm font-light mb-8">
              If an account exists for that email, we have sent password reset instructions.
            </p>
            <button
              onClick={() => setIsSent(false)}
              className="text-xs uppercase tracking-wider font-medium text-gold hover:underline"
            >
              Didn't receive the email? Try again
            </button>
          </div>
        )}

      </AnimatedSection>
    </div>
  );
}
