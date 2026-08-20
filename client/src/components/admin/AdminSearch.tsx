"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { useGetProductsQuery } from "@/store/api/productApi";

/** Admin global search — live product lookup with a results dropdown (Ctrl/⌘+K). */
export function AdminSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const { data, isFetching } = useGetProductsQuery(
    { search: query, limit: 6 },
    { skip: query.trim().length < 2 }
  );
  const results = data?.data ?? [];

  // Ctrl/⌘+K focuses the search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close on outside click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div ref={boxRef} className="hidden md:block relative">
      <div className="flex items-center relative group">
        <Search size={16} className="absolute left-3 text-muted-foreground group-focus-within:text-gold transition-colors" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search products…"
          className="w-80 pl-10 pr-16 py-2 bg-muted/50 border border-transparent focus:border-gold rounded-lg text-sm outline-none transition-all focus:bg-background"
        />
        <div className="absolute right-3 flex gap-1">
          <kbd className="px-1.5 py-0.5 text-[10px] bg-background border border-border rounded shadow-sm text-muted-foreground font-sans">Ctrl</kbd>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-background border border-border rounded shadow-sm text-muted-foreground font-sans">K</kbd>
        </div>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 w-96 max-w-[80vw] bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
          {isFetching ? (
            <div className="p-4 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 size={16} className="animate-spin" /> Searching…</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">No products found for “{query}”.</div>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((p) => (
                <li key={p._id}>
                  <Link
                    href={`/admin/products/${p._id}/edit`}
                    onClick={() => { setOpen(false); setQuery(""); }}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors"
                  >
                    <span className="truncate">
                      <span className="text-sm font-medium">{p.name}</span>
                      <span className="block text-xs text-muted-foreground font-mono">{p.sku}</span>
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">₹{(p.salePrice || p.basePrice).toLocaleString("en-IN")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/products" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-xs text-gold hover:underline border-t border-border">
            View all products →
          </Link>
        </div>
      )}
    </div>
  );
}
