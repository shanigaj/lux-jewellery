"use client";

// Phone field with a country-code selector. Emits a single combined string
// (e.g. "+91 9999900000") to the parent so the existing order payload shape is
// unchanged. Prefills correctly when editing an order whose phone already
// carries a dial code.
import { useMemo } from "react";
import { DIAL_CODES, parsePhone, joinPhone } from "@/lib/phone-codes";

interface Props {
  value: string;
  onChange: (combined: string) => void;
  className?: string;
  placeholder?: string;
}

export function PhoneInput({ value, onChange, className = "", placeholder = "99999 00000" }: Props) {
  const { dial, number } = useMemo(() => parsePhone(value), [value]);

  return (
    <div className={`flex ${className}`}>
      <select
        aria-label="Country code"
        value={dial}
        onChange={(e) => onChange(joinPhone(e.target.value, number))}
        className="bg-background border border-border border-r-0 rounded-l-lg pl-2 pr-1 py-2 text-sm outline-none focus:border-gold transition-colors max-w-[92px]"
      >
        {DIAL_CODES.map((d) => (
          <option key={`${d.iso}-${d.dial}`} value={d.dial}>
            {d.flag} {d.dial}
          </option>
        ))}
      </select>
      <input
        type="tel"
        inputMode="tel"
        value={number}
        onChange={(e) => onChange(joinPhone(dial, e.target.value.replace(/[^\d\s-]/g, "")))}
        placeholder={placeholder}
        className="w-full bg-background border border-border rounded-r-lg px-3 py-2 text-sm outline-none focus:border-gold transition-colors placeholder:text-muted-foreground/50"
      />
    </div>
  );
}
