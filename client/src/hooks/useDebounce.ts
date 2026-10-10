"use client";

import { useState, useEffect } from "react";

/** Returns a debounced copy of `value` that only updates after `delay` ms
 *  of no changes. Handy for search inputs that drive a server query. */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
