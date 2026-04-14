"use client";

import Link from "next/link";
import about from "../../../data/about.json";
import certifications from "../../../data/certifications.json";
import experience from "../../../data/experience.json";
import projects from "../../../data/projects.json";
import skills from "../../../data/skills.json";

export default function DesktopShell() {
  return (
    <main className="min-h-screen px-6 py-8 text-white lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-300/70">
                Desktop preview mode
              </p>
              <h1 className="mt-3 text-5xl font-bold leading-tight text-white xl:text-6xl">
                Franz Jason Dolores
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-200/85">
                {about.intro}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              <div className="flex items-center gap-2 font-medium">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                {about.availability}
              </div>
              <p className="mt-1 text-emerald-100/80">
                Immersive graph arrives in Phase 4.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/resume.pdf"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Download Resume
            </Link>
            <a
              href={about.contact.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              GitHub
            </a>
            <a
              href={about.contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              LinkedIn
            </a>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <section className="rounded-[2rem] border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-300/70">
                  Projects
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Selected work
                </h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                {projects.length} projects
              </span>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm italic text-slate-300/80">
                    {project.tagline}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-200/85">
                    {project.bullets.slice(0, 2).map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7f77dd]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-300/70">
                Skills
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Technical toolkit
              </h2>
              <div className="mt-5 space-y-4">
                {skills.map((group) => (
                  <div key={group.id} className="space-y-3">
                    <h3 className="text-base font-semibold text-white">
                      {group.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <span
                          key={skill.name}
                          className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-100"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-300/70">
                Experience
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Work history
              </h2>
              <div className="mt-5 space-y-4 border-l border-white/10 pl-4">
                {experience.map((item) => (
                  <article key={item.id} className="relative">
                    <span className="absolute -left-[1.3rem] top-1 h-3 w-3 rounded-full border-2 border-[#7f77dd] bg-[#050510]" />
                    <h3 className="text-base font-semibold text-white">
                      {item.role}
                    </h3>
                    <p className="text-sm text-slate-300/80">
                      {item.company} · {item.location}
                    </p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {item.dates}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-300/70">
                Certifications
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Credentials
              </h2>
              <div className="mt-5 space-y-3">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <h3 className="text-sm font-semibold text-white">
                      {cert.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-300/80">
                      {cert.issuer} · {cert.date}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
