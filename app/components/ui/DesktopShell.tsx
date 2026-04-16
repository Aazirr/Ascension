"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import about from "../../../data/about.json";
import certifications from "../../../data/certifications.json";
import experience from "../../../data/experience.json";
import projects from "../../../data/projects.json";
import skills from "../../../data/skills.json";
import Scene, { type CosmicBackgroundPreset } from "../canvas/Scene";
import AboutPanel from "../panels/AboutPanel";
import CertificationPanel from "../panels/CertificationPanel";
import ExperiencePanel from "../panels/ExperiencePanel";
import ProjectPanel from "../panels/ProjectPanel";
import SkillPanel from "../panels/SkillPanel";
import Breadcrumb from "./Breadcrumb";
import HireMeModal from "./HireMeModal";
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

interface DesktopShellProps {
  isCompact?: boolean;
}

const INTRO_SEEN_STORAGE_KEY = "ascension-seen-intro";
const INTRO_GREETING_DURATION_MS = 2200;

export default function DesktopShell({ isCompact = false }: DesktopShellProps) {
  const graph = useNodeGraph();
  const activeNode = graph.activeNode;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHireMeOpen, setIsHireMeOpen] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [introStep, setIntroStep] = useState<"greeting" | "guide">("greeting");
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [backgroundPreset, setBackgroundPreset] =
    useState<CosmicBackgroundPreset>("cinematic");
  const introTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const introStepTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
              {isCompact
                ? "Tap any project node to open the project sheet and review screenshots, stack, and links."
                : "Click on any project node to explore case studies, tech stacks, and live demos."}
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
  }, [activeNode, certificationMap, experienceMap, isCompact, projectMap, skillMap]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isMeta = event.metaKey || event.ctrlKey;

      if (event.key === "Escape") {
        if (isHireMeOpen) {
          setIsHireMeOpen(false);
        } else if (isSearchOpen) {
          setIsSearchOpen(false);
        } else {
          const movedBack = graph.goBack();
          if (!movedBack) {
            graph.setActiveNodeId(null);
          }
        }
      }

      if (isMeta && event.key === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
      }

      if (!isCompact && event.key === "?") {
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

      const categoryMap: Record<string, BranchColor> = {
        "1": "projects",
        "2": "skills",
        "3": "experience",
        "4": "certifications",
        "5": "about",
      };

      if (!isCompact && categoryMap[event.key]) {
        event.preventDefault();
        graph.jumpToCategory(categoryMap[event.key]);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [graph, isCompact, isHireMeOpen, isSearchOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const clearIntroTimers = () => {
      if (introStepTimeoutRef.current) {
        clearTimeout(introStepTimeoutRef.current);
        introStepTimeoutRef.current = null;
      }
      if (introTimeoutRef.current) {
        clearTimeout(introTimeoutRef.current);
        introTimeoutRef.current = null;
      }
    };

    const hasSeenIntroLocal = localStorage.getItem(INTRO_SEEN_STORAGE_KEY) === "true";
    if (hasSeenIntroLocal) {
      setHasSeenIntro(false);
      return clearIntroTimers;
    }

    setHasSeenIntro(true);
    setIntroStep("greeting");
    localStorage.setItem(INTRO_SEEN_STORAGE_KEY, "true");

    const introGuideDurationMs = isCompact ? 6000 : 6400;

    introStepTimeoutRef.current = setTimeout(() => {
      setIntroStep("guide");
    }, INTRO_GREETING_DURATION_MS);

    introTimeoutRef.current = setTimeout(() => {
      setHasSeenIntro(false);
    }, INTRO_GREETING_DURATION_MS + introGuideDurationMs);

    return () => {
      clearIntroTimers();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedPreset = localStorage.getItem(
      "ascension-cosmic-preset",
    ) as CosmicBackgroundPreset | null;
    if (
      storedPreset === "cinematic" ||
      storedPreset === "clean" ||
      storedPreset === "bright"
    ) {
      setBackgroundPreset(storedPreset);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem("ascension-cosmic-preset", backgroundPreset);
  }, [backgroundPreset]);

  const showHeaderHint = isCompact || isHeaderHovered;
  const panelTransition = { duration: 0.28, ease: "easeOut" as const };
  const isPanelOpen = Boolean(selectedPanel);

  const dismissIntro = () => {
    if (introStepTimeoutRef.current) {
      clearTimeout(introStepTimeoutRef.current);
      introStepTimeoutRef.current = null;
    }
    if (introTimeoutRef.current) {
      clearTimeout(introTimeoutRef.current);
      introTimeoutRef.current = null;
    }
    setHasSeenIntro(false);
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden text-white">
      <Scene
        graph={graph}
        backgroundPreset={backgroundPreset}
        isCompact={isCompact}
        onCentralPitchRequest={() => setIsHireMeOpen(true)}
        onBackgroundClick={() => {
          setIsHireMeOpen(false);
          graph.setActiveNodeId(null);
          graph.setHoveredNodeId(null);
        }}
      />

      <AnimatePresence>
        {hasSeenIntro && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/22 px-6 backdrop-blur-md"
          >
            <button
              type="button"
              aria-label="Skip intro"
              onClick={dismissIntro}
              className="absolute right-5 top-5 rounded-full border border-white/30 bg-black/30 px-3 py-1 text-lg font-semibold leading-none text-white transition hover:bg-black/45"
            >
              X
            </button>

            <div className="mx-auto w-full max-w-3xl">
              <div className="relative min-h-[200px]">
                <motion.div
                  initial={false}
                  animate={{
                    opacity: introStep === "greeting" ? 1 : 0,
                    y: introStep === "greeting" ? 0 : -8,
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="absolute inset-0 flex items-center justify-center text-center"
                >
                  <p className={`${isCompact ? "text-4xl" : "text-6xl"} font-bold text-white`}>
                    Hi!
                  </p>
                </motion.div>

                <motion.div
                  initial={false}
                  animate={{
                    opacity: introStep === "guide" ? 1 : 0,
                    y: introStep === "guide" ? 0 : 8,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0 flex items-center justify-center text-center"
                >
                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-300/70">
                      Welcome
                    </p>
                    <h2 className={`${isCompact ? "text-3xl leading-tight" : "text-5xl"} font-semibold text-white`}>
                      This is an interactive portfolio.
                    </h2>
                    <p className="mx-auto max-w-2xl text-base leading-8 text-slate-200/88 sm:text-lg">
                      {isCompact
                        ? "Tap nodes to explore projects, skills, experience, and certifications. Use Search to jump faster, and tap HIRE ME for a recruiter-friendly summary."
                        : "Click nodes to explore projects, skills, experience, and certifications. Use Search to jump faster, and open HIRE ME for a recruiter-friendly summary."}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <section
        className={`pointer-events-none absolute z-20 ${
          isCompact ? "left-3 right-3 top-3" : "left-6 top-6 max-w-2xl"
        }`}
      >
        <div
          className={`pointer-events-auto rounded-2xl border border-white/10 bg-black/35 backdrop-blur-md ${
            isCompact ? "p-4" : "p-5"
          }`}
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
        style={isCompact ? { paddingTop: "max(1rem, env(safe-area-inset-top))" } : undefined}
      >
          <div className="mb-3">
            <Breadcrumb
              path={graph.getBreadcrumbPath()}
              onNavigate={(nodeId) => graph.setActiveNodeId(nodeId)}
            />
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-300/70">
            Cosmic Neural Network
          </p>
          <div className={`mt-2 ${isCompact ? "space-y-3" : "flex items-start justify-between gap-4"}`}>
            <h1 className={`${isCompact ? "text-2xl" : "text-3xl"} font-bold text-white`}>
              Franz Jason Dolores
            </h1>
            <div className="pointer-events-auto flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="min-h-10 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/10"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsHireMeOpen(false);
                  graph.setActiveNodeId(null);
                  graph.setHoveredNodeId(null);
                  if (typeof window !== "undefined") {
                    localStorage.removeItem(INTRO_SEEN_STORAGE_KEY);
                  }
                }}
                className="min-h-10 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/10"
              >
                Reset
              </button>
            </div>
          </div>
          <AnimatePresence>
            {showHeaderHint && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="mt-2 text-sm leading-6 text-slate-300/85"
              >
                {isCompact
                  ? "Tap nodes to explore projects, skills, experience, and certifications. Drag to pan the graph, pinch to zoom, and use Search for faster jumps."
                  : "Click nodes to explore projects, skills, experience, and certifications. Press Ctrl+K to search nodes, and press Escape or click empty space to close panels."}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

      </section>

      {(!isCompact || !isPanelOpen) && (
        <section
          className={`pointer-events-none absolute z-20 ${
            isCompact ? "bottom-4 left-3" : "bottom-6 left-6"
          }`}
          style={isCompact ? { paddingBottom: "max(0rem, env(safe-area-inset-bottom))" } : undefined}
        >
          <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-xs text-slate-300/85 backdrop-blur-md">
            <p className="uppercase tracking-[0.2em]">Nodes</p>
            <p className="mt-1">{graph.nodes.length} total - {graph.edges.length} links</p>
          </div>
        </section>
      )}

      {(!isCompact || !isPanelOpen) && (
        <section
          className={`absolute z-20 pointer-events-auto ${
            isCompact ? "bottom-4 right-3" : "bottom-6 left-44"
          }`}
          style={isCompact ? { paddingBottom: "max(0rem, env(safe-area-inset-bottom))" } : undefined}
        >
          <div className="rounded-2xl border border-white/10 bg-black/35 px-3 py-2 backdrop-blur-md">
            <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-slate-300/70">
              Background
            </p>
            <div className="flex items-center gap-1.5">
              {([
                { id: "cinematic", label: "Cinematic" },
                { id: "clean", label: "Clean" },
                { id: "bright", label: "Bright" },
              ] as const).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setBackgroundPreset(preset.id)}
                  className={`min-h-9 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    backgroundPreset === preset.id
                      ? "border-white/35 bg-white/15 text-white"
                      : "border-white/10 bg-black/20 text-slate-300/80 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <div
        className={`pointer-events-none absolute z-20 ${
          isCompact
            ? "inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[rgba(5,5,16,0.9)] via-[rgba(5,5,16,0.58)] to-transparent"
            : "inset-y-0 right-0 w-[min(520px,44vw)] bg-gradient-to-l from-[rgba(5,5,16,0.82)] via-[rgba(5,5,16,0.58)] to-transparent"
        }`}
      />

      <aside
        className={`pointer-events-none absolute z-30 ${
          isCompact
            ? "inset-x-0 bottom-0 px-3 pb-3"
            : "right-4 top-4 h-[calc(100vh-2rem)] w-[min(420px,35vw)] min-w-[320px]"
        }`}
      >
        <AnimatePresence mode="wait">
          {selectedPanel ? (
            <motion.section
              key={selectedPanel.key}
              initial={isCompact ? { opacity: 0, y: 28 } : { opacity: 0, x: 36 }}
              animate={isCompact ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }}
              exit={isCompact ? { opacity: 0, y: 20 } : { opacity: 0, x: 24 }}
              transition={panelTransition}
              className={`pointer-events-auto overflow-y-auto rounded-3xl border border-white/10 bg-[rgba(5,5,16,0.97)] shadow-2xl shadow-black/40 backdrop-blur-xl ${
                isCompact ? "max-h-[64vh] rounded-b-[2rem] p-5 pb-8" : "h-full p-6"
              }`}
              style={isCompact ? { paddingBottom: "max(2rem, env(safe-area-inset-bottom))" } : undefined}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {isCompact && <div className="h-1.5 w-12 rounded-full bg-white/15" />}
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-300/70">
                    Detail panel
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => graph.setActiveNodeId(null)}
                  className="min-h-10 rounded-full border border-white/15 px-4 py-2 text-xs text-white hover:bg-white/10"
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
              initial={isCompact ? { opacity: 0, y: 14 } : { opacity: 0, x: 18 }}
              animate={isCompact ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }}
              exit={isCompact ? { opacity: 0, y: 10 } : { opacity: 0, x: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`pointer-events-auto rounded-3xl border border-white/10 bg-[rgba(5,5,16,0.95)] backdrop-blur-xl ${
                isCompact ? "p-4" : "p-6"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.24em] text-slate-300/70">
                Detail panel
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {isCompact ? "Tap a node" : "Select a node"}
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-300/85">
                {isCompact
                  ? "The graph is fully interactive here too. Tap any non-central node to open a detail sheet."
                  : "The graph is now the full desktop surface. Click any non-central node to open details."}
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

      <HireMeModal
        about={about as AboutData}
        isOpen={isHireMeOpen}
        onClose={() => setIsHireMeOpen(false)}
      />
    </main>
  );
}
