"use client";

import { ExpenseCategory, ExpenseStatus } from "@/types";
import { Filter } from "lucide-react";

export interface ExpenseFilters {
  category: ExpenseCategory | "All";
  status: ExpenseStatus | "All";
  search: string;
  startDate: string | null;
  endDate: string | null;
}

interface ExpenseFiltersProps {
  filters: ExpenseFilters;
  onChange: (filters: ExpenseFilters) => void;
  categories: ExpenseCategory[];
}

export function ExpenseFiltersBar({ filters, onChange, categories }: ExpenseFiltersProps) {
  const update = (patch: Partial<ExpenseFilters>) => onChange({ ...filters, ...patch });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          <Filter className="h-4 w-4 text-brand-500" />
          Filters
        </div>
        <select
          value={filters.category}
          onChange={(event) =>
            update({ category: event.target.value as ExpenseCategory | "All" })
          }
          className="w-40">
          <option value="All">All categories</option>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(event) =>
            update({ status: event.target.value as ExpenseStatus | "All" })
          }
          className="w-36">
          <option value="All">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Paid">Paid</option>
        </select>
        <input
          value={filters.search}
          onChange={(event) => update({ search: event.target.value })}
          placeholder="Search description or vendor"
          className="flex-1 min-w-[180px]"
        />
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>From</span>
          <input
            type="date"
            value={filters.startDate ?? ""}
            onChange={(event) => update({ startDate: event.target.value || null })}
            className="w-36"
          />
          <span>To</span>
          <input
            type="date"
            value={filters.endDate ?? ""}
            onChange={(event) => update({ endDate: event.target.value || null })}
            className="w-36"
          />
        </div>
        <button
          type="button"
          onClick={() =>
            onChange({
              category: "All",
              status: "All",
              search: "",
              startDate: null,
              endDate: null
            })
          }
          className="text-xs font-semibold text-brand-600 hover:text-brand-500">
          Reset
        </button>
      </div>
    </section>
  );
}
