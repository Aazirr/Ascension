"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
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
import Breadcrumb from "./Breadcrumb";
import SearchModal from "./SearchModal";
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

const branchColors = {
  projects: "#1d9e75",
  skills: "#378add",
  experience: "#d85a30",
  certifications: "#c8a85d",
  about: "#888780",
} as const;

type BranchColor = keyof typeof branchColors;

export default function DesktopShell() {
  const graph = useNodeGraph();
  const activeNode = graph.activeNode;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const introTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    // Tier 2 category overviews
    if (activeNode.id === "branch-projects") {
      return {
        key: activeNode.id,
        title: "Projects",
        content: (
          <section className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-2xl font-bold text-[#1d9e75]">{(projects as Project[]).length}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-300/70">
                Total Projects
              </p>
            </div>
            <p className="leading-6 text-slate-200/85">
              Click on any project node to explore case studies, tech stacks, and live demos.
            </p>
            <ul className="space-y-2">
              {(projects as Project[]).slice(0, 5).map((project) => (
                <li key={project.id} className="text-sm text-slate-300/80">
                  • {project.title}
                </li>
              ))}
              {(projects as Project[]).length > 5 && (
                <li className="text-sm text-slate-400/60">
                  + {(projects as Project[]).length - 5} more
                </li>
              )}
            </ul>
          </section>
        ),
      };
    }

    if (activeNode.id === "branch-skills") {
      return {
        key: activeNode.id,
        title: "Skills",
        content: (
          <section className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-2xl font-bold text-[#378add]">{(skills as SkillCategory[]).length}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-300/70">
                Skill Categories
              </p>
            </div>
            <p className="leading-6 text-slate-200/85">
              Explore technical and professional skills organized by domain.
            </p>
            <ul className="space-y-2">
              {(skills as SkillCategory[]).slice(0, 5).map((category) => (
                <li key={category.id} className="text-sm text-slate-300/80">
                  • {category.category}
                </li>
              ))}
              {(skills as SkillCategory[]).length > 5 && (
                <li className="text-sm text-slate-400/60">
                  + {(skills as SkillCategory[]).length - 5} more
                </li>
              )}
            </ul>
          </section>
        ),
      };
    }

    if (activeNode.id === "branch-experience") {
      return {
        key: activeNode.id,
        title: "Experience",
        content: (
          <section className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-2xl font-bold text-[#d85a30]">{(experience as ExperienceItem[]).length}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-300/70">
                Professional Roles
              </p>
            </div>
            <p className="leading-6 text-slate-200/85">
              View career history and professional achievements across different companies.
            </p>
            <ul className="space-y-2">
              {(experience as ExperienceItem[]).slice(0, 5).map((item) => (
                <li key={item.id} className="text-sm text-slate-300/80">
                  • {item.role} at {item.company}
                </li>
              ))}
              {(experience as ExperienceItem[]).length > 5 && (
                <li className="text-sm text-slate-400/60">
                  + {(experience as ExperienceItem[]).length - 5} more
                </li>
              )}
            </ul>
          </section>
        ),
      };
    }

    if (activeNode.id === "branch-certifications") {
      return {
        key: activeNode.id,
        title: "Certifications",
        content: (
          <section className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-2xl font-bold text-[#c8a85d]">{(certifications as CertificationItem[]).length}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-300/70">
                Credentials
              </p>
            </div>
            <p className="leading-6 text-slate-200/85">
              Industry certifications and professional credentials earned over time.
            </p>
            <ul className="space-y-2">
              {(certifications as CertificationItem[]).slice(0, 5).map((item) => (
                <li key={item.id} className="text-sm text-slate-300/80">
                  • {item.name}
                </li>
              ))}
              {(certifications as CertificationItem[]).length > 5 && (
                <li className="text-sm text-slate-400/60">
                  + {(certifications as CertificationItem[]).length - 5} more
                </li>
              )}
            </ul>
          </section>
        ),
      };
    }

    if (activeNode.id === "branch-about") {
      return {
        key: activeNode.id,
        title: "About",
        content: <AboutPanel about={about as AboutData} />,
      };
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
      const isMeta = event.metaKey || event.ctrlKey;

      if (event.key === "Escape") {
        if (isSearchOpen) {
          setIsSearchOpen(false);
        } else {
          const movedBack = graph.goBack();
          if (!movedBack) {
            graph.setActiveNodeId(null);
          }
        }
      }

      // Ctrl+K or Cmd+K: Open search
      if (isMeta && event.key === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
      }

      // ?: Show help (would open a help modal in future)
      if (event.key === "?") {
        event.preventDefault();
        alert(
          "Keyboard Shortcuts:\n" +
            "Arrow Keys / WASD - Navigate siblings\n" +
            "1-5 - Jump to category\n" +
            "Ctrl+K / Cmd+K - Search\n" +
            "? - Show help\n" +
            "Esc - Go back or close panel",
        );
      }

      // Arrow Keys or WASD: Navigate siblings
      const siblings = graph.getSiblingNodes();
      if (siblings.length > 0 && graph.activeNode && graph.activeNode.kind !== "central") {
        const currentIndex = siblings.findIndex((n) => n.id === graph.activeNode!.id);

        if (
          event.key === "ArrowRight" ||
          event.key === "ArrowDown" ||
          event.key === "d" ||
          event.key === "s"
        ) {
          event.preventDefault();
          const nextIndex = (currentIndex + 1) % siblings.length;
          graph.selectNode(siblings[nextIndex].id);
        }

        if (
          event.key === "ArrowLeft" ||
          event.key === "ArrowUp" ||
          event.key === "a" ||
          event.key === "w"
        ) {
          event.preventDefault();
          const prevIndex = currentIndex === 0 ? siblings.length - 1 : currentIndex - 1;
          graph.selectNode(siblings[prevIndex].id);
        }
      }

      // Number keys 1-5: Jump to categories
      const categoryMap: Record<string, BranchColor> = {
        "1": "projects",
        "2": "skills",
        "3": "experience",
        "4": "certifications",
        "5": "about",
      };

      if (categoryMap[event.key]) {
        event.preventDefault();
        graph.jumpToCategory(categoryMap[event.key]);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [graph, isSearchOpen]);

  // Intro animation on first load
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasSeenIntroLocal = localStorage.getItem("ascension-seen-intro");
    if (!hasSeenIntroLocal) {
      setHasSeenIntro(true);
      localStorage.setItem("ascension-seen-intro", "true");

      // Auto-hide intro message after 4 seconds
      introTimeoutRef.current = setTimeout(() => {
        setHasSeenIntro(false);
      }, 4000);
    }

    return () => {
      if (introTimeoutRef.current) {
        clearTimeout(introTimeoutRef.current);
      }
    };
  }, []);

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
          <div className="mb-3">
            <Breadcrumb
              path={graph.getBreadcrumbPath()}
              onNavigate={(nodeId) => graph.setActiveNodeId(nodeId)}
            />
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-300/70">
            Cosmic Neural Network
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">Franz Jason Dolores</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300/85">
            Click nodes to explore projects, skills, experience, and certifications.
            Press Escape or click empty space to close panels.
          </p>
        </div>

        <AnimatePresence>
          {hasSeenIntro && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-3 rounded-2xl border border-green-400/30 bg-green-900/20 p-3 text-xs text-green-100/90"
            >
              🎮 Press <kbd className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[0.75em]">Ctrl+K</kbd> to search,{" "}
              <kbd className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[0.75em]">?</kbd> for shortcuts
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className="pointer-events-none absolute bottom-6 left-6 z-20">
        <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-xs text-slate-300/85 backdrop-blur-md">
          <p className="uppercase tracking-[0.2em]">Nodes</p>
          <p className="mt-1">{graph.nodes.length} total · {graph.edges.length} links</p>
        </div>
      </section>

      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-[min(520px,44vw)] bg-gradient-to-l from-[rgba(5,5,16,0.82)] via-[rgba(5,5,16,0.58)] to-transparent" />

      <aside className="pointer-events-none absolute right-4 top-4 z-30 h-[calc(100vh-2rem)] w-[min(420px,35vw)] min-w-[320px]">
        <AnimatePresence mode="wait">
          {selectedPanel ? (
            <motion.section
              key={selectedPanel.key}
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="pointer-events-auto h-full overflow-y-auto rounded-3xl border border-white/10 bg-[rgba(5,5,16,0.97)] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl"
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
              className="pointer-events-auto rounded-3xl border border-white/10 bg-[rgba(5,5,16,0.95)] p-6 backdrop-blur-xl"
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

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(nodeId) => {
          graph.selectNode(nodeId);
          setIsSearchOpen(false);
        }}
        searchableNodes={graph.getSearchableNodes()}
      />
    </main>
  );
}
