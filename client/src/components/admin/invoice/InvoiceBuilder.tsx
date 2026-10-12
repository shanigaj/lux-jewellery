"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Printer, FilePlus2, Eye, Pencil, SlidersHorizontal } from "lucide-react";
import type { InvoiceDraft, InvoiceConfig, PresetKey } from "@/lib/invoice-builder/types";
import { defaultDraft, defaultConfig, getPreset } from "@/lib/invoice-builder/config";
import {
  loadConfig,
  saveConfig,
  loadBusiness,
  saveBusiness,
  peekInvoiceNumber,
  commitInvoiceNumber,
} from "@/lib/invoice-builder/storage";
import { printInvoiceDoc } from "@/lib/invoice-builder/render";
import { InvoiceEditor } from "./InvoiceEditor";
import { FieldSettingsPanel } from "./FieldSettingsPanel";
import { InvoicePreview } from "./InvoicePreview";

const KNOWN_PREFIXES = ["INV", "QTN", "PI"];
const isAutoNumber = (num: string) => KNOWN_PREFIXES.some((p) => num.startsWith(`${p}-`));

export function InvoiceBuilder() {
  const [draft, setDraft] = useState<InvoiceDraft>(() => defaultDraft("INV-DRAFT"));
  const [config, setConfig] = useState<InvoiceConfig>(() => defaultConfig());
  const [leftTab, setLeftTab] = useState<"edit" | "settings">("edit");
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage on mount (client-only), then build the first draft
  // with a real peeked invoice number + saved business details.
  useEffect(() => {
    const savedConfig = loadConfig();
    const cfg = savedConfig ?? defaultConfig();
    setConfig(cfg);

    const savedBusiness = loadBusiness();
    const base = defaultDraft(peekInvoiceNumber("tax_invoice"));
    if (savedBusiness) base.business = { ...base.business, ...savedBusiness };
    setDraft(base);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist config whenever it changes (remembers the user's field setup).
  useEffect(() => {
    if (ready) saveConfig(config);
  }, [config, ready]);

  // Persist business details so they pre-fill next time.
  useEffect(() => {
    if (ready) saveBusiness(draft.business);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.business, ready]);

  const handleDraft = (next: InvoiceDraft) => {
    // If the type changed and the number is still an auto number, re-prefix it
    // so a quotation reads QTN-… and a tax invoice INV-… .
    if (next.meta.type !== draft.meta.type && isAutoNumber(next.meta.invoiceNumber)) {
      const peeked = peekInvoiceNumber(next.meta.type);
      next = { ...next, meta: { ...next.meta, invoiceNumber: peeked } };
    }
    setDraft(next);
  };

  const handlePreset = (key: PresetKey) => {
    const preset = getPreset(key);
    if (!preset) return;
    setConfig((prev) => preset.apply(prev));
    if (preset.pricingMode) {
      setDraft((d) => ({ ...d, pricing: { ...d.pricing, mode: preset.pricingMode! } }));
    }
    // International preset implies USD + no GST by default.
    if (key === "international") {
      setDraft((d) => ({
        ...d,
        meta: { ...d.meta, currency: "USD" },
        pricing: { ...d.pricing, taxMode: "none" },
      }));
    }
    toast.success(`${preset.label} preset applied`);
  };

  const regenerateNumber = () => {
    setDraft((d) => ({ ...d, meta: { ...d.meta, invoiceNumber: peekInvoiceNumber(d.meta.type) } }));
  };

  const newInvoice = () => {
    // Consume the current number so it isn't reused, then start fresh —
    // keeping the current field config and business details.
    commitInvoiceNumber();
    const base = defaultDraft(peekInvoiceNumber(draft.meta.type));
    base.business = { ...draft.business };
    base.meta.type = draft.meta.type;
    base.meta.currency = draft.meta.currency;
    setDraft(base);
    toast.success("Started a new invoice");
  };

  const hasValidItem = useMemo(
    () => draft.items.some((it) => it.name.trim().length > 0),
    [draft.items]
  );

  const handlePrint = () => {
    if (!draft.items.some((it) => it.name.trim())) {
      toast.error("Add at least one product before printing");
      return;
    }
    if (!draft.customer.name.trim()) {
      toast.error("Customer name is required");
      return;
    }
    const ok = printInvoiceDoc(draft, config);
    if (!ok) toast.error("Pop-up blocked — allow pop-ups to print/save the PDF");
  };

  if (!ready) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Header / toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl">Invoice Builder</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage which fields show per category, the logo, and the overall invoice format.
            These settings also drive{" "}
            <span className="text-foreground font-medium">Orders → Create Walk-in Order</span>,
            where you generate actual invoices.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={newInvoice}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-lg hover:border-gold transition-colors"
          >
            <FilePlus2 size={15} /> New
          </button>
          <button
            type="button"
            onClick={handlePrint}
            disabled={!hasValidItem}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-gold text-onyx rounded-lg hover:bg-gold/90 disabled:opacity-50 transition-colors shadow-sm"
          >
            <Printer size={15} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* ── Mobile view switch ── */}
      <div className="flex lg:hidden rounded-lg border border-border overflow-hidden text-sm">
        <button
          onClick={() => setMobileView("editor")}
          className={`flex-1 py-2 font-medium transition-colors ${
            mobileView === "editor" ? "bg-gold text-onyx" : "bg-background text-muted-foreground"
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => setMobileView("preview")}
          className={`flex-1 py-2 font-medium transition-colors ${
            mobileView === "preview" ? "bg-gold text-onyx" : "bg-background text-muted-foreground"
          }`}
        >
          Preview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ── Left: editor / settings ── */}
        <div className={`lg:col-span-7 ${mobileView === "preview" ? "hidden lg:block" : ""}`}>
          <div className="flex rounded-lg border border-border overflow-hidden text-sm mb-4 w-fit">
            <button
              onClick={() => setLeftTab("edit")}
              className={`flex items-center gap-1.5 px-4 py-2 font-medium transition-colors ${
                leftTab === "edit" ? "bg-gold text-onyx" : "bg-background text-muted-foreground"
              }`}
            >
              <Pencil size={14} /> Fields
            </button>
            <button
              onClick={() => setLeftTab("settings")}
              className={`flex items-center gap-1.5 px-4 py-2 font-medium transition-colors ${
                leftTab === "settings" ? "bg-gold text-onyx" : "bg-background text-muted-foreground"
              }`}
            >
              <SlidersHorizontal size={14} /> Field Settings
            </button>
          </div>

          {leftTab === "edit" ? (
            <InvoiceEditor
              draft={draft}
              config={config}
              onChange={handleDraft}
              onConfig={setConfig}
              onRegenerateNumber={regenerateNumber}
            />
          ) : (
            <div className="bg-card border border-border rounded-xl p-4">
              <FieldSettingsPanel config={config} onConfig={setConfig} onPreset={handlePreset} />
            </div>
          )}
        </div>

        {/* ── Right: live preview ── */}
        <div className={`lg:col-span-5 ${mobileView === "editor" ? "hidden lg:block" : ""}`}>
          <div className="lg:sticky lg:top-4">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground mb-2">
              <Eye size={13} /> Live Preview
            </div>
            <div className="h-[75vh] overflow-y-auto rounded-lg bg-muted/30 p-2">
              <InvoicePreview draft={draft} config={config} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
