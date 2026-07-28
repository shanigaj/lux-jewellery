"use client";

import { Gift } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export interface GiftOptionsValue {
  giftWrap: boolean;
  giftNote: string;
}

interface GiftOptionsProps {
  value: GiftOptionsValue;
  onChange: (value: GiftOptionsValue) => void;
}

const MAX_NOTE_LENGTH = 200;

export function GiftOptions({ value, onChange }: GiftOptionsProps) {
  return (
    <div className="border border-border rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Gift size={16} className="text-gold" />
          Gift Wrapping
        </div>
        <Switch
          checked={value.giftWrap}
          onCheckedChange={(checked) => onChange({ ...value, giftWrap: checked })}
        />
      </div>

      {value.giftWrap && (
        <div className="pl-6 space-y-2">
          <p className="text-xs text-muted-foreground">
            Complimentary signature box, ribbon and a handwritten note card.
          </p>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
              Gift note (optional)
            </span>
            <textarea
              value={value.giftNote}
              onChange={(e) =>
                onChange({ ...value, giftNote: e.target.value.slice(0, MAX_NOTE_LENGTH) })
              }
              rows={3}
              placeholder="Write a short message for the recipient..."
              className="w-full bg-transparent border border-border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-gold transition-colors"
            />
            <span className="mt-1 block text-right text-[11px] text-muted-foreground">
              {value.giftNote.length}/{MAX_NOTE_LENGTH}
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
