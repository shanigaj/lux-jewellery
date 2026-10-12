"use client";

import { useMemo } from "react";
import type { InvoiceDraft, InvoiceConfig } from "@/lib/invoice-builder/types";
import { buildInvoiceDocHtml } from "@/lib/invoice-builder/render";

interface Props {
  draft: InvoiceDraft;
  config: InvoiceConfig;
}

// The preview renders the EXACT same HTML the PDF/print path produces, inside a
// sandboxed iframe — so what you see is what prints. Re-derived from the draft
// on every change (automatic, no refresh needed).
export function InvoicePreview({ draft, config }: Props) {
  const html = useMemo(() => buildInvoiceDocHtml(draft, config), [draft, config]);

  return (
    <iframe
      title="Invoice preview"
      srcDoc={html}
      // allow-same-origin lets the logo/watermark images (served from our own
      // origin) load; no scripts run inside the document.
      sandbox="allow-same-origin"
      className="w-full h-full min-h-[1100px] bg-white rounded-lg border border-border"
    />
  );
}
