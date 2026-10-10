"use client";

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  "aria-label"?: string;
}

/** Accessible on/off switch with the correct (non-stretching) styling. */
export function Toggle({ checked, onChange, disabled, "aria-label": ariaLabel }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[24px] w-[44px] flex-none items-center rounded-full transition-colors disabled:opacity-50 ${
        checked ? "bg-gold" : "bg-border"
      }`}
    >
      <span
        className={`inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}
