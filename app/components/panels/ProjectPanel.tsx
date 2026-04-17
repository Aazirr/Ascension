"use client";

import Image from "next/image";
import { useState } from "react";
import TechIcon from "../ui/TechIcon";
import { track } from "@/app/lib/analytics";
import type { Project } from "@/types";

interface ProjectPanelProps {
  project: Project;
}

export default function ProjectPanel({ project }: ProjectPanelProps) {
  const hasLiveUrl = project.liveUrl.trim().length > 0;
  const hasGithubUrl = project.githubUrl.trim().length > 0;
  const hasScreenshot = project.screenshot.trim().length > 0;
  const [imageFailed, setImageFailed] = useState(false);
  const isInProgress = project.status === "in-progress";

  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-slate-300/70">Project</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
          {isInProgress && (
            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-200">
              In Progress
            </span>
          )}
        </div>
        <p className="mt-2 text-sm italic text-slate-300/80">{project.tagline}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-100"
          >
            <TechIcon name={tech} size={14} className="h-3.5 w-3.5" />
            {tech}
          </span>
        ))}
      </div>

      {hasScreenshot && !imageFailed ? (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="relative aspect-[16/10]">
            <Image
              src={project.screenshot}
              alt={`${project.title} screenshot`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 420px"
              onError={() => setImageFailed(true)}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(5,5,16,0.28)] via-transparent to-transparent" />
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-slate-400/80">
          Screenshot not added yet.
        </div>
      )}

      <ul className="space-y-2 text-sm leading-6 text-slate-200/85">
        {project.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7f77dd]" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-3 pt-1">
        {hasLiveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              track("project_live_demo_clicked", {
                projectId: project.id,
                title: project.title,
              })}
            className="rounded-full bg-[#7f77dd] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Live Demo
          </a>
        ) : (
          <span className="cursor-not-allowed rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-500">
            Live Demo
          </span>
        )}
        {hasGithubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              track("project_github_clicked", {
                projectId: project.id,
                title: project.title,
              })}
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            GitHub
          </a>
        ) : (
          <span className="cursor-not-allowed rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-500">
            GitHub
          </span>
        )}
      </div>
    </section>
  );
}
