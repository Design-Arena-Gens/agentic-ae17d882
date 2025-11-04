"use client";

import { Expense, ExpenseStatus } from "@/types";
import { BadgeCheck, Trash2 } from "lucide-react";

interface ExpenseTableProps {
  expenses: Expense[];
  onChangeStatus: (expenseId: string, status: ExpenseStatus) => void;
  onDelete: (expenseId: string) => void;
  emptyState: string;
}

const statusColors: Record<ExpenseStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-sky-100 text-sky-700",
  Paid: "bg-emerald-100 text-emerald-700"
};

export function ExpenseTable({ expenses, onChangeStatus, onDelete, emptyState }: ExpenseTableProps) {
  if (!expenses.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 text-center text-sm text-slate-500">
        {emptyState}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Vendor
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Date
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Amount
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {expenses.map((expense) => (
            <tr key={expense.id} className="bg-white/70">
              <td className="px-4 py-3 align-top">
                <div className="text-sm font-medium text-slate-800">
                  {expense.description}
                </div>
                {expense.notes ? (
                  <p className="mt-1 text-xs text-slate-500">{expense.notes}</p>
                ) : null}
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">{expense.vendor}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{expense.category}</td>
              <td className="px-4 py-3 text-sm text-slate-600">
                {new Date(expense.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD"
                }).format(expense.amount)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusColors[expense.status]}`}>
                  {expense.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  {(["Pending", "Approved", "Paid"] as ExpenseStatus[])
                    .filter((status) => status !== expense.status)
                    .map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => onChangeStatus(expense.id, status)}
                        className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-brand-50">
                        <BadgeCheck className="h-3 w-3" />
                        {status}
                      </button>
                    ))}
                  <button
                    type="button"
                    onClick={() => onDelete(expense.id)}
                    className="flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-200">
                    <Trash2 className="h-3 w-3" />
                    Remove
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
