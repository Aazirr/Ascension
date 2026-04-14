"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import about from "../../../data/about.json";
import certifications from "../../../data/certifications.json";
import experience from "../../../data/experience.json";
import projects from "../../../data/projects.json";
import skills from "../../../data/skills.json";
import Scene from "../canvas/Scene";
import AboutPanel from "../panels/AboutPanel";
import CertificationPanel from "../panels/CertificationPanel";
import ExperiencePanel from "../panels/ExperiencePanel";
import ProjectPanel from "../panels/ProjectPanel";
import SkillPanel from "../panels/SkillPanel";
import { useNodeGraph } from "@/hooks/useNodeGraph";
import type {
  AboutData,
  CertificationItem,
  ExperienceItem,
  Project,
  SkillCategory,
} from "@/types";

const branchLabels: Record<string, string> = {
  projects: "Projects",
  skills: "Skills",
  experience: "Experience",
  certifications: "Certifications",
  about: "About",
};

export default function DesktopShell() {
  const graph = useNodeGraph();
  const activeNode = graph.activeNode;

  const projectMap = useMemo(
    () => new Map((projects as Project[]).map((project) => [project.id, project])),
    [],
  );
  const skillMap = useMemo(
    () => new Map((skills as SkillCategory[]).map((skill) => [skill.id, skill])),
    [],
  );
  const experienceMap = useMemo(
    () => new Map((experience as ExperienceItem[]).map((item) => [item.id, item])),
    [],
  );
  const certificationMap = useMemo(
    () =>
      new Map(
        (certifications as CertificationItem[]).map((item) => [item.id, item]),
      ),
    [],
  );

  const selectedPanel = useMemo(() => {
    if (!activeNode || activeNode.id === "central-you") {
      return null;
    }

    if (activeNode.id.startsWith("project-")) {
      const projectId = activeNode.id.replace("project-", "");
      const project = projectMap.get(projectId);
      if (project) {
        return {
          key: activeNode.id,
          title: activeNode.label,
          content: <ProjectPanel project={project} />,
        };
      }
    }

    if (activeNode.id.startsWith("skill-group-")) {
      const categoryId = activeNode.id.replace("skill-group-", "");
      const category = skillMap.get(categoryId);
      if (category) {
        return {
          key: activeNode.id,
          title: activeNode.label,
          content: <SkillPanel category={category} />,
        };
      }
    }

    if (activeNode.id.startsWith("skill-")) {
      const allCategories = skills as SkillCategory[];
      for (const category of allCategories) {
        const selectedSkill = category.skills.find(
          (skill) => activeNode.label === skill.name,
        );
        if (selectedSkill) {
          return {
            key: activeNode.id,
            title: `${category.category} · ${selectedSkill.name}`,
            content: <SkillPanel category={category} />,
          };
        }
      }
    }

    if (activeNode.id.startsWith("experience-")) {
      const itemId = activeNode.id.replace("experience-", "");
      const item = experienceMap.get(itemId);
      if (item) {
        return {
          key: activeNode.id,
          title: activeNode.label,
          content: <ExperiencePanel item={item} />,
        };
      }
    }

    if (activeNode.id.startsWith("certification-")) {
      const itemId = activeNode.id.replace("certification-", "");
      const item = certificationMap.get(itemId);
      if (item) {
        return {
          key: activeNode.id,
          title: activeNode.label,
          content: <CertificationPanel item={item} />,
        };
      }
    }

    if (activeNode.section === "about") {
      return {
        key: activeNode.id,
        title: activeNode.label,
        content: <AboutPanel about={about as AboutData} />,
      };
    }

    return {
      key: activeNode.id,
      title: activeNode.label,
      content: (
        <section className="space-y-3 text-sm text-slate-200/85">
          <p>{activeNode.description ?? "No details available yet."}</p>
          <p className="text-slate-300/70">
            Section: {branchLabels[activeNode.section] ?? activeNode.section}
          </p>
        </section>
      ),
    };
  }, [activeNode, certificationMap, experienceMap, projectMap, skillMap]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        graph.setActiveNodeId(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [graph]);

  return (
    <main className="relative h-screen w-screen overflow-hidden text-white">
      <Scene
        graph={graph}
        onBackgroundClick={() => {
          graph.setActiveNodeId(null);
          graph.setHoveredNodeId(null);
        }}
      />

      <section className="pointer-events-none absolute left-6 top-6 z-20 max-w-2xl">
        <div className="rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-300/70">
            Cosmic Neural Network
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">Franz Jason Dolores</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300/85">
            Click nodes to explore projects, skills, experience, and certifications.
            Press Escape or click empty space to close panels.
          </p>
        </div>
      </section>

      <section className="pointer-events-none absolute bottom-6 left-6 z-20">
        <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-xs text-slate-300/85 backdrop-blur-md">
          <p className="uppercase tracking-[0.2em]">Nodes</p>
          <p className="mt-1">{graph.nodes.length} total · {graph.edges.length} links</p>
        </div>
      </section>

      <aside className="pointer-events-none absolute right-4 top-4 z-30 h-[calc(100vh-2rem)] w-[min(420px,35vw)] min-w-[320px]">
        <AnimatePresence mode="wait">
          {selectedPanel ? (
            <motion.section
              key={selectedPanel.key}
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="pointer-events-auto h-full overflow-y-auto rounded-3xl border border-white/10 bg-[rgba(5,5,16,0.92)] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-300/70">
                  Detail panel
                </p>
                <button
                  type="button"
                  onClick={() => graph.setActiveNodeId(null)}
                  className="rounded-full border border-white/15 px-3 py-1 text-xs text-white hover:bg-white/10"
                >
                  Close
                </button>
              </div>
              <h2 className="text-xl font-semibold text-white">{selectedPanel.title}</h2>
              <div className="mt-4">{selectedPanel.content}</div>
            </motion.section>
          ) : (
            <motion.section
              key="panel-hint"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="pointer-events-auto rounded-3xl border border-white/10 bg-[rgba(5,5,16,0.88)] p-6 backdrop-blur-xl"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-slate-300/70">
                Detail panel
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Select a node</h2>
              <p className="mt-4 text-sm leading-6 text-slate-300/85">
                The graph is now the full desktop surface. Click any non-central
                node to open details.
              </p>
            </motion.section>
          )}
        </AnimatePresence>
      </aside>
    </main>
  );
}
