export type ExpenseCategory =
  | "Labor"
  | "Materials"
  | "Equipment"
  | "Subcontractors"
  | "Permits"
  | "Logistics"
  | "Misc";

export type ExpenseStatus = "Pending" | "Approved" | "Paid";

export interface Expense {
  id: string;
  description: string;
  vendor: string;
  category: ExpenseCategory;
  status: ExpenseStatus;
  amount: number;
  date: string;
  notes?: string;
}

export type ProjectStatus = "Planning" | "In Progress" | "On Hold" | "Completed";

export interface Project {
  id: string;
  name: string;
  client: string;
  manager: string;
  location: string;
  startDate: string;
  endDate: string;
  budget: number;
  contingency: number;
  status: ProjectStatus;
  expenses: Expense[];
}
