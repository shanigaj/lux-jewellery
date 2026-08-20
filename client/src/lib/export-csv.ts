// Tiny client-side CSV export — turns an array of row objects into a downloaded
// .csv, so admin "Export" buttons work without a backend export endpoint.

function escapeCell(value: unknown): string {
  const s = value == null ? "" : String(value);
  // Quote if it contains a comma, quote or newline; double up embedded quotes.
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * Build a CSV from rows and trigger a download.
 * @param filename e.g. "orders.csv"
 * @param rows array of flat objects; keys of the first row become the header
 * @param columns optional explicit [key, header] pairs to control order/labels
 */
export function exportCsv(
  filename: string,
  rows: Record<string, unknown>[],
  columns?: { key: string; header: string }[]
): void {
  if (!rows.length) return;

  const cols =
    columns ?? Object.keys(rows[0]).map((key) => ({ key, header: key }));

  const head = cols.map((c) => escapeCell(c.header)).join(",");
  const body = rows
    .map((row) => cols.map((c) => escapeCell(row[c.key])).join(","))
    .join("\n");
  const csv = `${head}\n${body}`;

  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
