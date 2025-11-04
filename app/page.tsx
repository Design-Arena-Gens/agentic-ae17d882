"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Expense, ExpenseCategory, ExpenseStatus, Project } from "@/types";
import { seedProjects } from "@/lib/seedData";
import { storage } from "@/lib/storage";
import { SummaryCards, defaultIcons } from "@/components/dashboard/SummaryCards";
import { ProjectList } from "@/components/dashboard/ProjectList";
import { ProjectForm, ProjectFormValues } from "@/components/forms/ProjectForm";
import { ExpenseForm, ExpenseFormValues } from "@/components/forms/ExpenseForm";
import { ExpenseFiltersBar, ExpenseFilters } from "@/components/dashboard/ExpenseFilters";
import { ExpenseTable } from "@/components/tables/ExpenseTable";
import { HealthIndicators } from "@/components/dashboard/HealthIndicators";

const categories: ExpenseCategory[] = [
  "Labor",
  "Materials",
  "Equipment",
  "Subcontractors",
  "Permits",
  "Logistics",
  "Misc"
];

const defaultFilters: ExpenseFilters = {
  category: "All",
  status: "All",
  search: "",
  startDate: null,
  endDate: null
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const createId = (prefix: string) => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
};

const computeMetrics = (project: Project) => {
  const totalBudget = project.budget + project.contingency;
  const totalSpent = project.expenses.reduce((acc, expense) => acc + expense.amount, 0);
  const approvedTotal = project.expenses
    .filter((expense) => expense.status === "Approved" || expense.status === "Paid")
    .reduce((acc, expense) => acc + expense.amount, 0);
  const paidTotal = project.expenses
    .filter((expense) => expense.status === "Paid")
    .reduce((acc, expense) => acc + expense.amount, 0);

  const outstanding = Math.max(0, approvedTotal - paidTotal);
  const remainingBudget = Math.max(0, totalBudget - totalSpent);

  const start = new Date(project.startDate);
  const end = new Date(project.endDate);
  const today = new Date();

  const totalDuration = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const elapsed = Math.max(0, Math.round((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const dailyBurn = elapsed > 0 ? totalSpent / elapsed : 0;
  const daysRemaining = dailyBurn > 0 ? remainingBudget / dailyBurn : totalDuration - elapsed;

  return {
    totalBudget,
    totalSpent,
    approvedTotal,
    paidTotal,
    outstanding,
    remainingBudget,
    utilization: totalBudget === 0 ? 0 : totalSpent / totalBudget,
    paidRatio: approvedTotal === 0 ? 1 : paidTotal / approvedTotal,
    daysRemaining: Math.max(0, Math.round(daysRemaining)),
    totalDuration
  };
};

export default function Page() {
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    seedProjects[0]?.id ?? null
  );
  const [filters, setFilters] = useState<ExpenseFilters>(defaultFilters);
  const [showProjectForm, setShowProjectForm] = useState(false);

  useEffect(() => {
    const stored = storage.load();
    if (stored && stored.length) {
      setProjects(stored);
      setSelectedProjectId(stored[0].id);
    }
  }, []);

  useEffect(() => {
    storage.save(projects);
  }, [projects]);

  useEffect(() => {
    if (!selectedProjectId && projects.length) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );

  const metrics = useMemo(() => (selectedProject ? computeMetrics(selectedProject) : null), [
    selectedProject
  ]);

  const filteredExpenses = useMemo(() => {
    if (!selectedProject) {
      return [];
    }

    return selectedProject.expenses.filter((expense) => {
      if (filters.category !== "All" && expense.category !== filters.category) {
        return false;
      }

      if (filters.status !== "All" && expense.status !== filters.status) {
        return false;
      }

      if (
        filters.search &&
        !`${expense.description} ${expense.vendor}`
          .toLowerCase()
          .includes(filters.search.trim().toLowerCase())
      ) {
        return false;
      }

      if (filters.startDate && new Date(expense.date) < new Date(filters.startDate)) {
        return false;
      }

      if (filters.endDate && new Date(expense.date) > new Date(filters.endDate)) {
        return false;
      }

      return true;
    });
  }, [selectedProject, filters]);

  const handleAddExpense = (values: ExpenseFormValues) => {
    if (!selectedProject) {
      return;
    }

    const expense: Expense = {
      id: createId("exp"),
      description: values.description.trim(),
      vendor: values.vendor.trim(),
      category: values.category,
      status: values.status,
      amount: values.amount,
      date: values.date,
      notes: values.notes.trim() ? values.notes.trim() : undefined
    };

    setProjects((prev) =>
      prev.map((project) =>
        project.id === selectedProject.id
          ? { ...project, expenses: [expense, ...project.expenses] }
          : project
      )
    );
  };

  const handleAddProject = (values: ProjectFormValues) => {
    const project: Project = {
      id: createId("proj"),
      name: values.name.trim(),
      client: values.client.trim(),
      manager: values.manager.trim(),
      location: values.location.trim(),
      startDate: values.startDate,
      endDate: values.endDate,
      status: values.status,
      budget: values.budget,
      contingency: values.contingency,
      expenses: []
    };

    setProjects((prev) => [project, ...prev]);
    setSelectedProjectId(project.id);
    setShowProjectForm(false);
  };

  const handleChangeStatus = (expenseId: string, status: ExpenseStatus) => {
    if (!selectedProject) {
      return;
    }

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== selectedProject.id) {
          return project;
        }

        return {
          ...project,
          expenses: project.expenses.map((expense) =>
            expense.id === expenseId ? { ...expense, status } : expense
          )
        };
      })
    );
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (!selectedProject) {
      return;
    }

    setProjects((prev) =>
      prev.map((project) =>
        project.id === selectedProject.id
          ? {
              ...project,
              expenses: project.expenses.filter((expense) => expense.id !== expenseId)
            }
          : project
      )
    );
  };

  const projectSummaryCards = metrics
    ? [
        {
          label: "Budget",
          value: formatCurrency(metrics.totalBudget),
          subtext: `${formatCurrency(metrics.remainingBudget)} remaining`,
          icon: defaultIcons.budget,
          accent: "bg-brand-500"
        },
        {
          label: "Contingency",
          value: formatCurrency(selectedProject?.contingency ?? 0),
          subtext: `${Math.round(metrics.utilization * 100)}% utilization`,
          icon: defaultIcons.contingency,
          accent: "bg-slate-800"
        },
        {
          label: "Paid to date",
          value: formatCurrency(metrics.paidTotal),
          subtext: `${formatCurrency(metrics.approvedTotal)} approved`,
          icon: defaultIcons.paid,
          accent: "bg-emerald-500"
        },
        {
          label: "Outstanding",
          value: formatCurrency(metrics.outstanding),
          subtext: `${metrics.daysRemaining} days runway`,
          icon: defaultIcons.outstanding,
          accent: "bg-sky-500"
        }
      ]
    : [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">
              Construction finance cockpit
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Expense and budget manager
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Monitor spend, approvals, and financial health across construction projects in
              one place.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowProjectForm((prev) => !prev)}
            className="flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500">
            <Plus className="h-4 w-4" />
            {showProjectForm ? "Collapse" : "New project"}
          </button>
        </header>

        {showProjectForm ? <ProjectForm onSubmit={handleAddProject} /> : null}

        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <div className="space-y-4">
            <ProjectList
              projects={projects}
              selectedId={selectedProjectId}
              onSelect={setSelectedProjectId}
            />
            <HealthIndicators
              utilization={metrics?.utilization ?? 0}
              paidRatio={metrics?.paidRatio ?? 0}
              daysRemaining={metrics?.daysRemaining ?? 0}
              totalDuration={metrics?.totalDuration ?? 0}
            />
          </div>
          <div className="space-y-5">
            {metrics ? <SummaryCards cards={projectSummaryCards} /> : null}
            <ExpenseFiltersBar
              categories={categories}
              filters={filters}
              onChange={setFilters}
            />
            <ExpenseForm onSubmit={handleAddExpense} isProjectSelected={Boolean(selectedProject)} />
            <ExpenseTable
              expenses={filteredExpenses}
              onChangeStatus={handleChangeStatus}
              onDelete={handleDeleteExpense}
              emptyState={selectedProject ? "No expenses match your filters." : "Select a project to review expenses."}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
