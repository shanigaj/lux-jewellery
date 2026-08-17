"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Video,
  Sparkles,
  Check,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  CalendarDays,
  Clock,
  MapPin,
  CalendarPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { useCreateAppointmentMutation } from "@/store/api/appointmentApi";
import { useGetSettingsQuery } from "@/store/api/settingsApi";
import { downloadIcs } from "@/lib/ics";
import {
  EXPERIENCES,
  BOUTIQUES,
  INTERESTS,
  TIME_SLOTS,
  upcomingDays,
  formatDayLabel,
  toISODate,
  to12Hour,
  buildAppointmentMessage,
  type ExperienceType,
  type AppointmentDetails,
} from "@/lib/appointments";

const EXPERIENCE_ICON: Record<ExperienceType, typeof Store> = {
  "in-store": Store,
  virtual: Video,
  styling: Sparkles,
};

const STEPS = ["Experience", "Schedule", "Your details"] as const;

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const phoneOk = (v: string) => v.replace(/\D/g, "").length >= 8;

export default function BookAppointmentPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [createAppointment] = useCreateAppointmentMutation();

  // Boutiques & time slots are admin-managed (Settings); fall back to defaults.
  const { data: settingsData } = useGetSettingsQuery();
  const boutiques = settingsData?.data?.boutiques?.length ? settingsData.data.boutiques : BOUTIQUES;
  const timeSlots = settingsData?.data?.timeSlots?.length ? settingsData.data.timeSlots : [...TIME_SLOTS];

  const [experience, setExperience] = useState<ExperienceType | null>(null);
  const [boutiqueId, setBoutiqueId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");
  const [notes, setNotes] = useState("");
  const [triedSubmit, setTriedSubmit] = useState(false);

  const days = useMemo(() => upcomingDays(14), []);
  const needsBoutique = experience === "in-store";

  const scheduleValid =
    (!needsBoutique || !!boutiqueId) && !!date && !!time;
  const detailsValid =
    name.trim().length > 1 && emailOk(email) && phoneOk(phone) && !!interest;

  const canContinue = step === 0 ? !!experience : step === 1 ? scheduleValid : detailsValid;

  const selectedExperience = EXPERIENCES.find((e) => e.id === experience);
  const selectedBoutique = boutiques.find((b) => b.id === boutiqueId);

  function next() {
    if (!canContinue) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function confirm() {
    setTriedSubmit(true);
    if (!experience || !detailsValid || !scheduleValid) return;
    const details: AppointmentDetails = {
      experience,
      boutiqueId: needsBoutique ? boutiqueId : undefined,
      date,
      time,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      interest,
      notes,
    };
    // Persist the request (fire-and-forget), then hand off to WhatsApp.
    createAppointment(details);
    window.open(getWhatsAppUrl(buildAppointmentMessage(details)), "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  function addToCalendar() {
    if (!experience || !date || !time) return;
    downloadIcs(`sparenza-jewels-appointment-${date}`, {
      title: `Sparenza & Co. — ${selectedExperience?.title ?? "Appointment"}`,
      description: `${selectedExperience?.blurb ?? ""}${
        interest ? `\nInterest: ${interest}` : ""
      }\nRequest sent via sparenza.com — a specialist will confirm shortly.`,
      location:
        experience === "virtual"
          ? "Video consultation (link to follow)"
          : selectedBoutique
          ? `${selectedBoutique.name}, ${selectedBoutique.address}`
          : undefined,
      start: new Date(`${date}T${time}:00`),
      durationMinutes: experience === "virtual" ? 30 : 60,
    });
  }

  if (submitted) {
    return (
      <div className="container-luxury flex min-h-[70vh] items-center justify-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg text-center"
        >
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Check className="text-primary" size={30} />
          </div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-luxury-wide text-gold">
            Request sent
          </p>
          <h1 className="font-heading text-4xl text-foreground md:text-5xl">
            We&apos;ll confirm your <em className="italic text-primary">appointment</em> shortly.
          </h1>
          <p className="mx-auto mt-6 max-w-md font-light leading-relaxed text-muted-foreground">
            Your request has opened in WhatsApp. A diamond specialist will confirm your slot and
            send a calendar invite. If WhatsApp didn&apos;t open, please check your pop-up blocker.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={addToCalendar}
              className="inline-flex items-center gap-2 rounded-[2px] border border-border px-8 py-4 text-[12px] font-semibold uppercase tracking-wider text-foreground transition-colors hover:border-primary"
            >
              <CalendarPlus size={16} /> Add to calendar
            </button>
            <a
              href="/"
              className="rounded-[2px] border border-border px-8 py-4 text-[12px] font-semibold uppercase tracking-wider text-foreground transition-colors hover:border-primary"
            >
              Back to home
            </a>
            <a
              href="/products"
              className="rounded-[2px] bg-primary px-8 py-4 text-[12px] font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-[#0A4E32]"
            >
              Explore pieces
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-luxury py-16 md:py-24">
      {/* Heading */}
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-luxury-wide text-gold">
          By Appointment
        </p>
        <h1 className="font-heading text-4xl leading-[1.08] text-foreground md:text-5xl lg:text-6xl">
          Book a private <em className="italic text-primary">appointment</em>
        </h1>
        <p className="mt-6 font-light leading-relaxed text-muted-foreground">
          Spend unhurried time with a diamond specialist — in one of our boutiques or over a
          private video call. Complimentary and entirely without obligation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* ── Main flow ── */}
        <div className="min-w-0">
          {/* Step indicator */}
          <ol className="mb-10 flex items-center gap-2">
            {STEPS.map((label, i) => (
              <li key={label} className="flex flex-1 items-center gap-2">
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-semibold tabular-nums transition-colors",
                    i < step && "border-primary bg-primary text-primary-foreground",
                    i === step && "border-primary text-primary",
                    i > step && "border-border text-muted-foreground"
                  )}
                >
                  {i < step ? <Check size={14} /> : i + 1}
                </span>
                <span
                  className={cn(
                    "hidden text-[11px] uppercase tracking-wider sm:block",
                    i === step ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
                {i < STEPS.length - 1 && (
                  <span className={cn("h-px flex-1", i < step ? "bg-primary" : "bg-border")} />
                )}
              </li>
            ))}
          </ol>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* STEP 0 — Experience */}
              {step === 0 && (
                <div className="grid gap-4 sm:grid-cols-3">
                  {EXPERIENCES.map((exp) => {
                    const Icon = EXPERIENCE_ICON[exp.id];
                    const active = experience === exp.id;
                    return (
                      <button
                        key={exp.id}
                        type="button"
                        onClick={() => {
                          setExperience(exp.id);
                          if (exp.id !== "in-store") setBoutiqueId("");
                        }}
                        className={cn(
                          "flex flex-col items-start gap-4 rounded-[2px] border p-6 text-left transition-all duration-300",
                          active
                            ? "border-primary bg-card shadow-luxury"
                            : "border-border hover:border-primary/40 hover:bg-card"
                        )}
                      >
                        <Icon size={26} className={active ? "text-primary" : "text-gold"} />
                        <div>
                          <h3 className="font-heading text-xl text-foreground">{exp.title}</h3>
                          <p className="mt-1 text-[11px] uppercase tracking-wider text-gold">
                            {exp.duration}
                          </p>
                        </div>
                        <p className="text-sm font-light leading-relaxed text-muted-foreground">
                          {exp.blurb}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 1 — Schedule */}
              {step === 1 && (
                <div className="space-y-10">
                  {needsBoutique && (
                    <div>
                      <h3 className="mb-4 font-heading text-2xl text-foreground">Choose a boutique</h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {boutiques.map((b) => {
                          const active = boutiqueId === b.id;
                          return (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => setBoutiqueId(b.id)}
                              className={cn(
                                "flex items-start gap-3 rounded-[2px] border p-4 text-left transition-colors",
                                active ? "border-primary bg-card" : "border-border hover:border-primary/40"
                              )}
                            >
                              <MapPin size={18} className={active ? "text-primary" : "text-gold"} />
                              <span>
                                <span className="block font-heading text-base text-foreground">
                                  {b.name}
                                </span>
                                <span className="block text-sm font-light text-muted-foreground">
                                  {b.address}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="mb-4 flex items-center gap-2 font-heading text-2xl text-foreground">
                      <CalendarDays size={20} className="text-gold" /> Select a date
                    </h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                      {days.map((d) => {
                        const iso = toISODate(d);
                        const { weekday, day, month } = formatDayLabel(d);
                        const active = date === iso;
                        return (
                          <button
                            key={iso}
                            type="button"
                            onClick={() => setDate(iso)}
                            className={cn(
                              "flex min-w-[68px] flex-col items-center gap-1 rounded-[2px] border px-3 py-3 transition-colors",
                              active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-foreground hover:border-primary/40"
                            )}
                          >
                            <span className="text-[10px] uppercase tracking-wider opacity-70">
                              {weekday}
                            </span>
                            <span className="font-heading text-xl tabular-nums">{day}</span>
                            <span className="text-[10px] uppercase tracking-wider opacity-70">
                              {month}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 flex items-center gap-2 font-heading text-2xl text-foreground">
                      <Clock size={20} className="text-gold" /> Select a time
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {timeSlots.map((t) => {
                        const active = time === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTime(t)}
                            className={cn(
                              "rounded-[2px] border px-5 py-2.5 text-sm tabular-nums transition-colors",
                              active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-foreground hover:border-primary/40"
                            )}
                          >
                            {to12Hour(t)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 — Details */}
              {step === 2 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" required error={triedSubmit && name.trim().length < 2}>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aanya Mehta"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Email" required error={triedSubmit && !emailOk(email)}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Phone" required error={triedSubmit && !phoneOk(phone)}>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 ..."
                      className={inputCls}
                    />
                  </Field>
                  <Field label="I'm interested in" required error={triedSubmit && !interest}>
                    <select
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className={inputCls}
                    >
                      <option value="">Select…</option>
                      {INTERESTS.map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Anything we should know? (optional)">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Occasion, budget range, specific pieces…"
                        className={cn(inputCls, "resize-none")}
                      />
                    </Field>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          <div className="mt-12 flex items-center justify-between">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className={cn(
                "inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider transition-colors",
                step === 0 ? "cursor-not-allowed text-muted-foreground/40" : "text-foreground hover:text-primary"
              )}
            >
              <ArrowLeft size={16} /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                disabled={!canContinue}
                className={cn(
                  "inline-flex items-center gap-2 rounded-[2px] px-9 py-4 text-[12px] font-semibold uppercase tracking-wider transition-all duration-500",
                  canContinue
                    ? "bg-primary text-primary-foreground hover:bg-[#0A4E32]"
                    : "cursor-not-allowed bg-muted text-muted-foreground"
                )}
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={confirm}
                className="inline-flex items-center gap-2 rounded-[2px] bg-[#25D366] px-9 py-4 text-[12px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#1ebe5b]"
              >
                <MessageCircle size={16} /> Confirm on WhatsApp
              </button>
            )}
          </div>
        </div>

        {/* ── Live summary rail ── */}
        <aside className="h-fit rounded-[2px] border border-border bg-card p-7 lg:sticky lg:top-28">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-luxury-wide text-gold">
            Your appointment
          </p>
          <dl className="space-y-4 text-sm">
            <SummaryRow label="Experience" value={selectedExperience?.title} />
            {needsBoutique && <SummaryRow label="Boutique" value={selectedBoutique?.name} />}
            <SummaryRow
              label="Date"
              value={
                date
                  ? new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })
                  : undefined
              }
            />
            <SummaryRow label="Time" value={time ? to12Hour(time) : undefined} />
            <SummaryRow label="Interest" value={interest || undefined} />
            <SummaryRow label="Name" value={name.trim() || undefined} />
          </dl>
          <div className="mt-6 border-t border-border pt-5 text-[12px] font-light leading-relaxed text-muted-foreground">
            Complimentary · No obligation · A specialist confirms every request personally.
          </div>
        </aside>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-[2px] border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors";

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] uppercase tracking-wider text-muted-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-[11px] text-destructive">Please complete this field.</span>}
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className={cn("text-right", value ? "text-foreground" : "text-muted-foreground/40")}>
        {value ?? "—"}
      </dd>
    </div>
  );
}
