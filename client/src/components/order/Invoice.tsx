"use client";

import { useRef } from "react";
import { IInvoice } from "@/types/order.types";
import { Printer, Download } from "lucide-react";

interface InvoiceProps {
  invoice: IInvoice;
}

export function Invoice({ invoice }: InvoiceProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice ${invoice.invoiceNumber}</title>
              <style>
                body { font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a1a; }
                .header { display: flex; justify-content: space-between; align-items: start; border-bottom: 2px solid #C4A265; padding-bottom: 20px; margin-bottom: 20px; }
                .company { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
                .gold { color: #C4A265; }
                .meta { text-align: right; font-size: 12px; color: #666; }
                .meta strong { color: #1a1a1a; display: block; font-size: 14px; margin-bottom: 4px; }
                .addresses { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
                .address-block { font-size: 12px; color: #666; }
                .address-block strong { display: block; font-size: 13px; color: #1a1a1a; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th { background: #f5f5f0; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #ddd; }
                td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #eee; }
                .text-right { text-align: right; }
                .totals { margin-left: auto; width: 300px; }
                .totals .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
                .totals .row.total { font-weight: bold; font-size: 16px; border-top: 2px solid #C4A265; padding-top: 10px; margin-top: 6px; }
                .totals .row.discount { color: #16a34a; }
                .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 11px; color: #999; }
                @media print { body { padding: 20px; } }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex justify-end gap-2 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 border border-border text-xs uppercase tracking-wider font-medium hover:border-gold transition-colors rounded-lg"
        >
          <Printer size={14} /> Print Invoice
        </button>
      </div>

      {/* Invoice Content */}
      <div
        ref={printRef}
        className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-border">
          <div>
            <h2 className="font-heading text-2xl tracking-wider">
              LUX <span className="text-gold">DIAMONDS</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {invoice.companyInfo.address}
            </p>
            <p className="text-xs text-muted-foreground">
              {invoice.companyInfo.email} • {invoice.companyInfo.phone}
            </p>
            {invoice.companyInfo.gst && (
              <p className="text-xs text-muted-foreground">
                GSTIN: {invoice.companyInfo.gst}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Invoice
            </p>
            <p className="font-heading text-lg text-gold">
              {invoice.invoiceNumber}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Issued: {new Date(invoice.issuedAt).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>

        {/* Billing Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-2">
              Bill To
            </h4>
            <div className="text-sm">
              <p className="font-medium">
                {invoice.order.shippingAddress.firstName}{" "}
                {invoice.order.shippingAddress.lastName}
              </p>
              <p className="text-muted-foreground">
                {invoice.order.shippingAddress.addressLine1}
              </p>
              <p className="text-muted-foreground">
                {invoice.order.shippingAddress.city},{" "}
                {invoice.order.shippingAddress.state}{" "}
                {invoice.order.shippingAddress.postalCode}
              </p>
              <p className="text-muted-foreground">
                {invoice.order.shippingAddress.phone}
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-2">
              Order Details
            </h4>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Order: </span>
                {invoice.order.orderNumber}
              </p>
              <p>
                <span className="text-muted-foreground">Date: </span>
                {new Date(invoice.order.createdAt).toLocaleDateString("en-IN")}
              </p>
              <p>
                <span className="text-muted-foreground">Payment: </span>
                {invoice.order.payment.method.toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-xs uppercase tracking-wider font-medium text-muted-foreground">
                  Item
                </th>
                <th className="text-center py-3 text-xs uppercase tracking-wider font-medium text-muted-foreground">
                  Qty
                </th>
                <th className="text-right py-3 text-xs uppercase tracking-wider font-medium text-muted-foreground">
                  Unit Price
                </th>
                <th className="text-right py-3 text-xs uppercase tracking-wider font-medium text-muted-foreground">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item, idx) => (
                <tr key={idx} className="border-b border-border/50">
                  <td className="py-3">{item.description}</td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right">
                    ₹{item.unitPrice.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 text-right font-medium">
                    ₹{item.total.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full sm:w-72 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{invoice.subtotal.toLocaleString("en-IN")}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{invoice.discount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                GST ({invoice.taxRate * 100}%)
              </span>
              <span>₹{invoice.taxAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>
                {invoice.shippingCost === 0
                  ? "Free"
                  : `₹${invoice.shippingCost.toLocaleString("en-IN")}`}
              </span>
            </div>
            <div className="flex justify-between font-medium text-base pt-2 border-t border-gold">
              <span>Grand Total</span>
              <span className="font-heading text-gold">
                ₹{invoice.grandTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Thank you for choosing Lux Diamonds. This is a computer-generated invoice.
          </p>
        </div>
      </div>
    </div>
  );
}
