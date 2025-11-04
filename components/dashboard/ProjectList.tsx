"use client";

import { Building2, CalendarDays, MapPin } from "lucide-react";
import { Project } from "@/types";

interface ProjectListProps {
  projects: Project[];
  selectedId: string | null;
  onSelect: (projectId: string) => void;
}

export function ProjectList({ projects, selectedId, onSelect }: ProjectListProps) {
  return (
    <aside className="space-y-3">
      {projects.map((project) => {
        const isActive = project.id === selectedId;

        return (
          <button
            key={project.id}
            type="button"
            onClick={() => onSelect(project.id)}
            className={`w-full rounded-2xl border bg-white/90 p-4 text-left shadow-sm transition hover:-translate-y-[1px] hover:shadow-md sm:p-5 ${
              isActive
                ? "border-brand-500 ring-2 ring-brand-200"
                : "border-slate-200"
            }`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  {project.status}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  {project.name}
                </h3>
                <p className="text-sm text-slate-600">Client: {project.client}</p>
              </div>
              <Building2 className="mt-1 h-6 w-6 text-brand-500" />
            </div>
            <dl className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>{project.startDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>{project.endDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-600">Manager:</span>
                <span>{project.manager}</span>
              </div>
            </dl>
          </button>
        );
      })}
    </aside>
  );
}
