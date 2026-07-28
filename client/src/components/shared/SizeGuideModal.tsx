"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SizeGuideContent } from "@/components/shared/SizeGuideContent";

interface SizeGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SizeGuideModal({ open, onOpenChange }: SizeGuideModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Size Guide</DialogTitle>
          <DialogDescription>
            Find your perfect fit for rings, bracelets and necklaces.
          </DialogDescription>
        </DialogHeader>
        <SizeGuideContent />
      </DialogContent>
    </Dialog>
  );
}
