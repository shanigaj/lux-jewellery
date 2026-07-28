"use client";

import { useState } from "react";
import { BellRing, Check } from "lucide-react";
import { downloadIcs } from "@/lib/ics";

export function CareReminderButton() {
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    const start = new Date();
    start.setMonth(start.getMonth() + 3);
    start.setHours(10, 0, 0, 0);

    downloadIcs("lux-diamonds-care-reminder", {
      title: "Jewellery care & cleaning check — LUX DIAMONDS",
      description:
        "Time for your quarterly clean, inspect and prong check. Book a complimentary cleaning at any LUX DIAMONDS boutique.",
      start,
      durationMinutes: 30,
      recurrenceRule: "FREQ=MONTHLY;INTERVAL=3",
    });
    setAdded(true);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-[2px] bg-primary px-8 py-4 text-[12px] font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-[#0A4E32]"
    >
      {added ? <Check size={16} /> : <BellRing size={16} />}
      {added ? "Reminder saved" : "Remind me every 3 months"}
    </button>
  );
}
