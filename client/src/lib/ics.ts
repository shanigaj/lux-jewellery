// Minimal RFC5545 .ics builder — used for "Add to Calendar" downloads.
// No backend calendar integration; the browser downloads a file the user's
// calendar app opens directly.

export interface IcsEvent {
  title: string;
  description?: string;
  location?: string;
  start: Date;
  durationMinutes?: number;
  /** RFC5545 RRULE, e.g. "FREQ=MONTHLY;INTERVAL=3" for a recurring reminder. */
  recurrenceRule?: string;
  url?: string;
}

function formatIcsDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeIcsText(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildIcs(event: IcsEvent): string {
  const start = event.start;
  const end = new Date(start.getTime() + (event.durationMinutes ?? 60) * 60000);
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@luxdiamonds`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//LUX DIAMONDS//Appointments//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
  ];
  if (event.description) lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);
  if (event.location) lines.push(`LOCATION:${escapeIcsText(event.location)}`);
  if (event.url) lines.push(`URL:${event.url}`);
  if (event.recurrenceRule) lines.push(`RRULE:${event.recurrenceRule}`);
  lines.push(
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  );
  return lines.join("\r\n");
}

export function downloadIcs(filename: string, event: IcsEvent): void {
  const content = buildIcs(event);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
