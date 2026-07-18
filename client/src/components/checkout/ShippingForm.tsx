"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IShippingAddress } from "@/types/order.types";
import { ArrowRight } from "lucide-react";

const shippingSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(5, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
});

interface ShippingFormProps {
  onSubmit: (data: IShippingAddress) => void;
  defaultValues?: Partial<IShippingAddress>;
}

export function ShippingForm({ onSubmit, defaultValues }: ShippingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IShippingAddress>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      country: "India",
      ...defaultValues,
    },
  });

  const inputClass =
    "w-full bg-transparent border border-border py-2.5 px-3 text-sm rounded-lg focus:outline-none focus:border-gold transition-colors";
  const labelClass = "text-xs uppercase tracking-wider font-medium text-muted-foreground";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <h2 className="font-heading text-xl mb-4">Shipping Address</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={labelClass}>First Name *</label>
          <input {...register("firstName")} className={inputClass} />
          {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Last Name *</label>
          <input {...register("lastName")} className={inputClass} />
          {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={labelClass}>Email *</label>
          <input {...register("email")} type="email" className={inputClass} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Phone *</label>
          <input {...register("phone")} type="tel" className={inputClass} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Address Line 1 *</label>
        <input {...register("addressLine1")} className={inputClass} placeholder="Street address, P.O. box" />
        {errors.addressLine1 && <p className="text-xs text-destructive">{errors.addressLine1.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Address Line 2</label>
        <input {...register("addressLine2")} className={inputClass} placeholder="Apartment, suite, unit (optional)" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="space-y-1.5 col-span-2 sm:col-span-1">
          <label className={labelClass}>City *</label>
          <input {...register("city")} className={inputClass} />
          {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>State *</label>
          <input {...register("state")} className={inputClass} />
          {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Postal Code *</label>
          <input {...register("postalCode")} className={inputClass} />
          {errors.postalCode && <p className="text-xs text-destructive">{errors.postalCode.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Country *</label>
          <input {...register("country")} className={inputClass} />
          {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-onyx dark:bg-gold text-white dark:text-onyx text-sm uppercase tracking-widest font-medium hover:bg-gold dark:hover:bg-white hover:text-onyx transition-colors mt-6"
      >
        Continue to Payment <ArrowRight size={14} />
      </button>
    </form>
  );
}
