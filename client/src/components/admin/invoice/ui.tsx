"use client";

// ── Small form primitives shared across the invoice builder ──
import { ReactNode } from "react";

export const inputCx =
  "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-gold transition-colors placeholder:text-muted-foreground/40";
export const labelCx =
  "block text-[11px] font-medium text-muted-foreground mb-1 uppercase tracking-wider";

export function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {label ? <label className={labelCx}>{label}</label> : null}
      {children}
    </div>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <Field label={label} className={className}>
      <input
        className={inputCx}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </Field>
  );
}

export function NumberInput({
  label,
  value,
  onChange,
  placeholder = "0",
  min = 0,
  step = "any",
  className = "",
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  placeholder?: string;
  min?: number;
  step?: number | "any";
  className?: string;
}) {
  return (
    <Field label={label} className={className}>
      <input
        className={inputCx}
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        value={value ?? ""}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") return onChange(null);
          const num = Number(raw);
          if (!Number.isFinite(num)) return;
          onChange(Math.max(min, num));
        }}
        placeholder={placeholder}
      />
    </Field>
  );
}

export function SelectInput<T extends string>({
  label,
  value,
  onChange,
  options,
  className = "",
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}) {
  return (
    <Field label={label} className={className}>
      <select
        className={inputCx}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 2,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <Field label={label} className={className}>
      <textarea
        className={inputCx}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </Field>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
  disabled,
  hideLabel,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
  disabled?: boolean;
  hideLabel?: boolean;
}) {
  return (
    <label
      className={`flex items-center justify-between gap-3 py-1.5 ${
        disabled ? "opacity-60" : "cursor-pointer"
      }`}
    >
      {!hideLabel && (
        <span className="min-w-0">
          <span className="text-sm text-foreground">{label}</span>
          {hint && <span className="block text-[11px] text-muted-foreground">{hint}</span>}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-[22px] w-[40px] flex-none items-center rounded-full transition-colors ${
          checked ? "bg-gold" : "bg-border"
        } ${disabled ? "cursor-not-allowed" : ""}`}
      >
        <span
          className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[20px]" : "translate-x-[2px]"
          }`}
        />
      </button>
    </label>
  );
}

export function SectionCard({
  title,
  icon,
  children,
  right,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <section className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">{title}</h3>
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}
