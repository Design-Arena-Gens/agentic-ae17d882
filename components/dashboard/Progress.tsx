"use client";

import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
  accent?: "brand" | "emerald" | "sky" | "rose";
}

export function Progress({ value, className, accent = "brand" }: ProgressProps) {
  return (
    <div className={cn("h-2 rounded-full bg-slate-100", className)}>
      <div
        className={cn(
          "h-2 rounded-full transition-all",
          {
            brand: "bg-brand-500",
            emerald: "bg-emerald-500",
            sky: "bg-sky-500",
            rose: "bg-rose-500"
          }[accent]
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
