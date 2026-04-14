import type { Project } from "@/types";

interface ProjectPanelProps {
  project: Project;
}

export default function ProjectPanel({ project }: ProjectPanelProps) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-slate-300/70">Project</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">{project.title}</h3>
        <p className="mt-2 text-sm italic text-slate-300/80">{project.tagline}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-100"
          >
            {tech}
          </span>
        ))}
      </div>

      <ul className="space-y-2 text-sm leading-6 text-slate-200/85">
        {project.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7f77dd]" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-3 pt-1">
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-[#7f77dd] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
        >
          Live Demo
        </a>
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          GitHub
        </a>
      </div>
    </section>
  );
}
