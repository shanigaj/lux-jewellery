"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { Loader2 } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useCategoryImages } from "@/lib/useCategoryImages";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { heroImage } = useCategoryImages();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/register", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      });

      toast.success("Account created successfully!");
      
      // In DEV: We log the mock OTP so the user can easily copy it
      if (response.data.mockOtp) {
        console.log("DEV MOCK OTP:", response.data.mockOtp);
        toast.info(`DEV MODE: OTP is ${response.data.mockOtp}`, { duration: 10000 });
      }

      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-row-reverse">
      {/* Right side - Image */}
      <div className="hidden lg:block w-1/2 relative bg-muted">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <h2 className="font-heading text-4xl mb-4">Join Sparenza &amp; Co.</h2>
          <p className="font-light tracking-wide max-w-md">
            Create an account to save your favorite pieces, track orders, and receive exclusive invitations to private viewings.
          </p>
        </div>
      </div>

      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 py-12">
        <AnimatedSection animation="fadeUp" className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl mb-2">Create Account</h1>
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-gold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
                  First Name
                </label>
                <input
                  {...register("firstName")}
                  type="text"
                  className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-gold transition-colors"
                />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
                  Last Name
                </label>
                <input
                  {...register("lastName")}
                  type="text"
                  className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-gold transition-colors"
                />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full bg-transparent border-b border-border py-2 text-sm focus:outline-none focus:border-gold transition-colors"
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <PasswordInput
              label="Password"
              error={errors.password?.message}
              {...register("password")}
            />

            <PasswordInput
              label="Confirm Password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-onyx dark:bg-gold text-white dark:text-onyx py-3 text-sm uppercase tracking-widest font-medium hover:bg-gold dark:hover:bg-white hover:text-onyx transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
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
