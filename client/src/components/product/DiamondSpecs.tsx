"use client";

import { IDiamondSpecs } from "@/types/product.types";
import { BadgeCheck, Diamond, Sparkles, Scale, Award } from "lucide-react";

interface DiamondSpecsProps {
  specs: IDiamondSpecs;
}

export function DiamondSpecs({ specs }: DiamondSpecsProps) {
  if (!specs) return null;

  const attributes = [
    { label: "Shape", value: specs.shape, icon: <Diamond size={16} /> },
    { label: "Carat", value: `${specs.caratWeight} ct`, icon: <Scale size={16} /> },
    { label: "Color", value: specs.color, icon: <Sparkles size={16} /> },
    { label: "Clarity", value: specs.clarity, icon: <Sparkles size={16} /> },
    { label: "Cut", value: specs.cut, icon: <Diamond size={16} /> },
    { label: "Certificate", value: specs.certification, icon: <BadgeCheck size={16} /> },
  ];

  return (
    <div className="bg-muted/30 p-6 rounded-xl border border-border">
      <div className="flex items-center gap-2 mb-6">
        <Award className="text-gold" size={20} />
        <h3 className="font-heading text-lg">Diamond Specifications</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
        {attributes.map((attr, idx) => (
          attr.value ? (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                {attr.icon}
                <span className="text-[10px] uppercase tracking-wider">{attr.label}</span>
              </div>
              <span className="text-sm font-medium capitalize pl-5">
                {attr.value.toString().replace("_", " ")}
              </span>
            </div>
          ) : null
        ))}
      </div>

      {specs.certificationNumber && (
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">View official grading report:</p>
          <button className="text-sm font-medium text-gold hover:underline flex items-center gap-2 transition-all">
            <BadgeCheck size={16} />
            {specs.certification} Report: {specs.certificationNumber}
          </button>
        </div>
      )}
    </div>
  );
}
