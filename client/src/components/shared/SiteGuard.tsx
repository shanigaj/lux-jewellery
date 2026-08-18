"use client";

import { useEffect } from "react";

/**
 * Client-side deterrents against casual copying of imagery and content:
 * blocks the right-click menu, image dragging/saving, text copy/cut (outside
 * form fields), and the common "view source / devtools" shortcuts.
 *
 * This only raises the effort bar for casual visitors — it is NOT a security
 * boundary. Anyone determined can still read the page via the network tab, with
 * JavaScript disabled, or with curl. Real protection lives server-side (auth,
 * rate limiting, and the security headers set in next.config / helmet).
 *
 * Form fields (input / textarea / contenteditable) are deliberately exempt so
 * customers can still type, select, and paste in the cart, checkout and forms.
 */
export default function SiteGuard() {
  useEffect(() => {
    const isEditable = (el: EventTarget | null): boolean => {
      const n = el as HTMLElement | null;
      if (!n || !n.tagName) return false;
      const tag = n.tagName.toUpperCase();
      return tag === "INPUT" || tag === "TEXTAREA" || n.isContentEditable === true;
    };

    // Right-click menu (a common "Save image as…" / "View source" entry point)
    const onContextMenu = (e: MouseEvent) => {
      if (!isEditable(e.target)) e.preventDefault();
    };

    // Drag-to-save on imagery
    const onDragStart = (e: DragEvent) => {
      const n = e.target as HTMLElement | null;
      if (n && n.tagName === "IMG") e.preventDefault();
    };

    // Copying page content (form fields stay copyable)
    const onCopyCut = (e: ClipboardEvent) => {
      if (!isEditable(e.target)) e.preventDefault();
    };

    // View-source / devtools / save-page keyboard shortcuts
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase();
      if (e.key === "F12") {
        e.preventDefault();
        return;
      }
      // Ctrl/Cmd + U (view source) or S (save page)
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (k === "U" || k === "S")) {
        e.preventDefault();
        return;
      }
      // Ctrl/Cmd + Shift + I / J / C (open devtools / inspector)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (k === "I" || k === "J" || k === "C")) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("copy", onCopyCut);
    document.addEventListener("cut", onCopyCut);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("copy", onCopyCut);
      document.removeEventListener("cut", onCopyCut);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
