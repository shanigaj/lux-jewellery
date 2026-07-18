"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { Loader2 } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", data);
      
      if (response.data.needsVerification) {
        toast.info("Please verify your email first.");
        // We pass the email to verify page via query params
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        return;
      }

      // Successful login
      dispatch(login(response.data.user));
      toast.success("Welcome back!");
      router.push("/account");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Image */}
      <div className="hidden lg:block w-1/2 relative bg-muted">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-ring.png')" }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <h2 className="font-heading text-4xl mb-4">Welcome Back</h2>
          <p className="font-light tracking-wide max-w-md">
            Sign in to access your exclusive wishlist, track orders, and experience personalized luxury.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <AnimatedSection animation="fadeUp" className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="font-heading text-3xl mb-2">Sign In</h1>
            <p className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-gold hover:underline">
                Create one
              </Link>
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

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-gold transition-colors uppercase tracking-wider"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-onyx dark:bg-gold text-white dark:text-onyx py-3 text-sm uppercase tracking-widest font-medium hover:bg-gold dark:hover:bg-white hover:text-onyx transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <OAuthButtons />
        </AnimatedSection>
      </div>
    </div>
  );
}
