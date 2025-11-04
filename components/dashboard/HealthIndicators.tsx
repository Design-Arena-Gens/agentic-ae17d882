"use client";

import { Progress } from "./Progress";

interface HealthIndicatorsProps {
  utilization: number;
  paidRatio: number;
  daysRemaining: number;
  totalDuration: number;
}

export function HealthIndicators({
  utilization,
  paidRatio,
  daysRemaining,
  totalDuration
}: HealthIndicatorsProps) {
  const remainingRatio = totalDuration > 0 ? daysRemaining / totalDuration : 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-700">Health indicators</h2>
      <div className="mt-4 space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Budget utilization</span>
            <span>{Math.round(utilization * 100)}%</span>
          </div>
          <Progress value={utilization * 100} className="mt-2" accent="brand" />
        </div>
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Paid vs approved</span>
            <span>{Math.round(paidRatio * 100)}%</span>
          </div>
          <Progress value={paidRatio * 100} className="mt-2" accent="emerald" />
        </div>
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Schedule coverage</span>
            <span>{Math.max(0, Math.round(daysRemaining))} days left</span>
          </div>
          <Progress value={Math.min(100, Math.max(0, remainingRatio * 100))} className="mt-2" accent="sky" />
        </div>
      </div>
    </section>
  );
}
