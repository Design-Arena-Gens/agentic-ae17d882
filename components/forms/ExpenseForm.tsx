"use client";

import { FormEvent, useMemo, useState } from "react";
import { ExpenseCategory, ExpenseStatus } from "@/types";

const categories: ExpenseCategory[] = [
  "Labor",
  "Materials",
  "Equipment",
  "Subcontractors",
  "Permits",
  "Logistics",
  "Misc"
];

const statuses: ExpenseStatus[] = ["Pending", "Approved", "Paid"];

export interface ExpenseFormValues {
  description: string;
  vendor: string;
  category: ExpenseCategory;
  status: ExpenseStatus;
  amount: number;
  date: string;
  notes: string;
}

interface ExpenseFormProps {
  onSubmit: (values: ExpenseFormValues) => void;
  isProjectSelected: boolean;
}

const defaultState: ExpenseFormValues = {
  description: "",
  vendor: "",
  category: "Materials",
  status: "Pending",
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
  notes: ""
};

export function ExpenseForm({ onSubmit, isProjectSelected }: ExpenseFormProps) {
  const [values, setValues] = useState<ExpenseFormValues>(defaultState);
  const [touched, setTouched] = useState(false);

  const isValid = useMemo(() => {
    return (
      values.description.trim().length > 2 &&
      values.vendor.trim().length > 1 &&
      values.amount > 0
    );
  }, [values]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);

    if (!isValid) {
      return;
    }

    onSubmit(values);
    setValues({ ...defaultState, date: new Date().toISOString().slice(0, 10) });
    setTouched(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-slate-800">Log new expense</h2>
        <p className="text-xs text-slate-500">
          Track costs as they occur to maintain budget accuracy.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Description
          </span>
          <input
            required
            value={values.description}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder="e.g. Concrete pour phase 3"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Vendor
          </span>
          <input
            required
            value={values.vendor}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, vendor: event.target.value }))
            }
            placeholder="Supplier or subcontractor name"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Category
          </span>
          <select
            value={values.category}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                category: event.target.value as ExpenseCategory
              }))
            }>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Status
          </span>
          <select
            value={values.status}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                status: event.target.value as ExpenseStatus
              }))
            }>
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Amount (USD)
          </span>
          <input
            required
            type="number"
            min={0}
            step="0.01"
            value={values.amount === 0 ? "" : values.amount}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                amount: Number(event.target.value)
              }))
            }
            placeholder="0.00"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Expense date
          </span>
          <input
            required
            type="date"
            value={values.date}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, date: event.target.value }))
            }
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Notes
          </span>
          <textarea
            rows={2}
            value={values.notes}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, notes: event.target.value }))
            }
            placeholder="Optional context or approvals"
            className="resize-none"
          />
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isProjectSelected || !isValid}
          className="bg-brand-600 text-white hover:bg-brand-500 focus-visible:ring-offset-2">
          Add expense
        </button>
      </div>

      {touched && !isValid ? (
        <p className="text-xs text-red-500">
          Provide a description, vendor, and amount greater than zero.
        </p>
      ) : null}
      {!isProjectSelected ? (
        <p className="text-xs text-slate-500">
          Create or select a project to log expenses.
        </p>
      ) : null}
    </form>
  );
}
