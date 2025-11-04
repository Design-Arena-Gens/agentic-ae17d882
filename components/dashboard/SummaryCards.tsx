"use client";

import { ReactNode } from "react";
import { Banknote, ClipboardCheck, Construction, PieChart } from "lucide-react";

interface SummaryCard {
  label: string;
  value: string;
  subtext?: string;
  icon: ReactNode;
  accent: string;
}

export interface SummaryCardsProps {
  cards: SummaryCard[];
}

export function SummaryCards({ cards }: SummaryCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm shadow-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
              {card.subtext ? (
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                  {card.subtext}
                </p>
              ) : null}
            </div>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${card.accent}`}>
              {card.icon}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

export const defaultIcons = {
  budget: <PieChart className="h-6 w-6" />,
  contingency: <Construction className="h-6 w-6" />,
  paid: <Banknote className="h-6 w-6" />,
  outstanding: <ClipboardCheck className="h-6 w-6" />
};
