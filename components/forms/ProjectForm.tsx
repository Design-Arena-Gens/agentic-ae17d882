"use client";

import { FormEvent, useState } from "react";
import { ProjectStatus } from "@/types";

interface ProjectFormProps {
  onSubmit: (values: ProjectFormValues) => void;
}

export interface ProjectFormValues {
  name: string;
  client: string;
  manager: string;
  location: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  budget: number;
  contingency: number;
}

const statuses: ProjectStatus[] = [
  "Planning",
  "In Progress",
  "On Hold",
  "Completed"
];

const defaultValues: ProjectFormValues = {
  name: "",
  client: "",
  manager: "",
  location: "",
  status: "Planning",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  budget: 0,
  contingency: 0
};

export function ProjectForm({ onSubmit }: ProjectFormProps) {
  const [values, setValues] = useState<ProjectFormValues>(defaultValues);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
    setValues({ ...defaultValues, endDate: values.endDate });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-dashed border-brand-200 bg-white/70 p-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-slate-700">New project</h2>
        <p className="text-xs text-slate-500">
          Capture a high-level summary for each construction project you manage.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Project name
          </span>
          <input
            required
            value={values.name}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder="e.g. Skyline Tower"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Client
          </span>
          <input
            required
            value={values.client}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, client: event.target.value }))
            }
            placeholder="Client or owner"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Project manager
          </span>
          <input
            required
            value={values.manager}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, manager: event.target.value }))
            }
            placeholder="Person responsible"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Location
          </span>
          <input
            required
            value={values.location}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, location: event.target.value }))
            }
            placeholder="City, state"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Status
          </span>
          <select
            value={values.status}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                status: event.target.value as ProjectStatus
              }))
            }>
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Start date
          </span>
          <input
            type="date"
            value={values.startDate}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, startDate: event.target.value }))
            }
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Target completion
          </span>
          <input
            type="date"
            value={values.endDate}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, endDate: event.target.value }))
            }
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Budget (USD)
          </span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={values.budget === 0 ? "" : values.budget}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                budget: Number(event.target.value)
              }))
            }
            placeholder="0.00"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Contingency (USD)
          </span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={values.contingency === 0 ? "" : values.contingency}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                contingency: Number(event.target.value)
              }))
            }
            placeholder="0.00"
          />
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-white text-brand-600 ring-1 ring-inset ring-brand-400 hover:bg-brand-50">
          Add project
        </button>
      </div>
    </form>
  );
}
