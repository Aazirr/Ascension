"use client";

import Link from "next/link";
import about from "../../../data/about.json";
import certifications from "../../../data/certifications.json";
import experience from "../../../data/experience.json";
import projects from "../../../data/projects.json";
import skills from "../../../data/skills.json";
import Scene from "../canvas/Scene";
import { useNodeGraph } from "@/hooks/useNodeGraph";

const branchLabels: Record<string, string> = {
  projects: "Projects",
  skills: "Skills",
  experience: "Experience",
  certifications: "Certifications",
  about: "About",
};

export default function DesktopShell() {
  const graph = useNodeGraph();
  const activeNode = graph.activeNode ?? graph.nodes[0];

  return (
    <main className="min-h-screen px-6 py-8 text-white lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-300/70">
                Desktop graph mode
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
                Phase 4 introduces the graph skeleton.
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

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.42fr)_minmax(320px,0.58fr)]">
          <section className="space-y-4 rounded-[2rem] border border-white/10 bg-black/20 p-4 backdrop-blur-sm sm:p-6">
            <div className="flex items-center justify-between gap-4 px-1 pt-1">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-300/70">
                  Graph skeleton
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Central node, branches, and leaves
                </h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                {graph.nodes.length} nodes
              </span>
            </div>

            <Scene graph={graph} />
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-300/70">
                Active node
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {activeNode.label}
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-200/85">
                <p>{activeNode.description ?? "No node description available."}</p>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-slate-300/85">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Section
                  </p>
                  <p className="mt-1 font-medium text-white">
                    {branchLabels[activeNode.section] ?? activeNode.section}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">
                    Node type
                  </p>
                  <p className="mt-1 font-medium text-white">
                    {activeNode.kind}
                  </p>
                </div>
                <p className="text-slate-300/80">
                  Click a node to move the camera and update this summary.
                </p>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-300/70">
                Legend
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Branches
              </h2>
              <div className="mt-5 space-y-3 text-sm text-slate-200/85">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>Projects</span>
                  <span className="h-3 w-3 rounded-full bg-[#1d9e75]" />
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>Skills</span>
                  <span className="h-3 w-3 rounded-full bg-[#378add]" />
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>Experience</span>
                  <span className="h-3 w-3 rounded-full bg-[#d85a30]" />
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>Certifications</span>
                  <span className="h-3 w-3 rounded-full bg-[#c8a85d]" />
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>About</span>
                  <span className="h-3 w-3 rounded-full bg-[#888780]" />
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-300/70">
                Content map
              </p>
              <div className="mt-5 space-y-3 text-sm text-slate-300/85">
                <p>{projects.length} project leaves</p>
                <p>{skills.reduce((total, group) => total + group.skills.length, 0)} skill leaves</p>
                <p>{experience.length} experience nodes</p>
                <p>{certifications.length} certification nodes</p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
