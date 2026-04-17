"use client";

import { motion, type Transition } from "framer-motion";
import { useEffect } from "react";
import TechIcon from "./TechIcon";
import { track, trackOncePerSession } from "@/app/lib/analytics";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import projects from "../../../data/projects.json";
import skills from "../../../data/skills.json";
import experience from "../../../data/experience.json";
import certifications from "../../../data/certifications.json";
import about from "../../../data/about.json";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export default function MobileLayout() {
  const reducedMotion = useReducedMotion();

  const sectionTransition: Transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.16, 1, 0.3, 1] };

  useEffect(() => {
    trackOncePerSession("session-started", "session_started");
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(127,119,221,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(29,158,117,0.12),transparent_30%),radial-gradient(circle_at_bottom,rgba(216,90,48,0.08),transparent_30%)]" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <motion.section
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-8"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={sectionTransition}
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-300/70">
                Full Stack Developer
              </p>
              <h1 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl">
                Franz Jason Dolores
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-200/85 sm:text-lg">
                {about.intro}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              <div className="flex items-center gap-2 font-medium">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                {about.availability}
              </div>
              <p className="mt-1 text-emerald-100/80">
                Available for focused product and web work.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/resume.pdf"
              download
              onClick={() => track("resume_clicked", { location: "mobile-layout" })}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Download Resume
            </a>
            <a
              href={about.contact.github}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("github_profile_clicked", { location: "mobile-layout" })}
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              GitHub
            </a>
            <a
              href={about.contact.linkedin}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("linkedin_clicked", { location: "mobile-layout" })}
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              LinkedIn
            </a>
          </div>
        </motion.section>

        <motion.section
          className="rounded-[2rem] border border-white/10 bg-black/20 p-6 backdrop-blur-sm sm:p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          transition={sectionTransition}
        >
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
              5 projects
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {projects.map((project, index) => {
              const hasLiveUrl = project.liveUrl.trim().length > 0;
              const hasGithubUrl = project.githubUrl.trim().length > 0;

              return (
                <motion.article
                  key={project.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                  variants={itemVariants}
                  transition={{
                    ...(reducedMotion ? { duration: 0 } : { duration: 0.35 }),
                    delay: reducedMotion ? 0 : index * 0.06,
                  }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(127,119,221,0.28),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(29,158,117,0.18),transparent_36%),linear-gradient(135deg,rgba(8,8,24,0.98),rgba(18,17,39,0.96))]">
                    <div className="absolute inset-0 flex flex-col justify-end p-5">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-300/70">
                        Project preview
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-white">
                        {project.title}
                      </h3>
                      <p className="mt-1 max-w-[18ch] text-sm text-slate-200/80">
                        Screenshot placeholder until the final asset is added.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4 p-5">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-sm italic text-slate-300/80">
                        {project.tagline}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-100"
                        >
                          <TechIcon name={tag} size={14} className="h-3.5 w-3.5" />
                          {tag}
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

                    <div className="flex flex-wrap gap-3">
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
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          transition={sectionTransition}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-300/70">
              Skills
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Technical toolkit
            </h2>
          </div>

          <div className="mt-6 space-y-6">
            {skills.map((group) => (
              <div key={group.id} className="space-y-3">
                <h3 className="text-lg font-semibold text-white">
                  {group.category}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {group.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-white">
                          {skill.name}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-300/85">
                        {skill.context}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="rounded-[2rem] border border-white/10 bg-black/20 p-6 backdrop-blur-sm sm:p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          transition={sectionTransition}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-300/70">
              Experience
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Work history
            </h2>
          </div>

          <div className="mt-6 space-y-4 border-l border-white/10 pl-5">
            {experience.map((item) => (
              <motion.article
                key={item.id}
                className="relative"
                variants={itemVariants}
                transition={sectionTransition}
              >
                <span className="absolute -left-[1.45rem] top-1 h-3 w-3 rounded-full border-2 border-[#7f77dd] bg-[#050510]" />
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {item.role}
                      </h3>
                      <p className="text-sm text-slate-300/80">
                        {item.company} · {item.location}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                      {item.dates}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-200/85">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d85a30]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          transition={sectionTransition}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-300/70">
              Certifications
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Credentials
            </h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <h3 className="text-base font-semibold text-white">
                  {cert.name}
                </h3>
                <p className="mt-1 text-sm text-slate-300/80">{cert.issuer}</p>
                <p className="mt-3 text-sm text-slate-200/85">{cert.date}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="rounded-[2rem] border border-white/10 bg-black/20 p-6 backdrop-blur-sm sm:p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          transition={sectionTransition}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-300/70">
              About
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Background and contact
            </h2>
          </div>

          <div className="mt-5 grid gap-6 md:grid-cols-[1.3fr_0.9fr]">
            <div className="space-y-4 text-slate-200/85">
              <p className="leading-7">{about.gamingCommunity}</p>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300/90">
                Competitive work benefits from the same habits as game prep:
                pattern recognition, iteration, and calm execution.
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-lg font-semibold text-white">Contact</h3>
              <div className="mt-3 space-y-3 text-sm text-slate-300/85">
                <a
                  className="block break-all hover:text-white"
                  href={`mailto:${about.contact.email}`}
                  onClick={() => track("email_clicked", { location: "mobile-layout" })}
                >
                  {about.contact.email}
                </a>
                <a
                  className="block break-all hover:text-white"
                  href={about.contact.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track("github_profile_clicked", { location: "mobile-layout" })}
                >
                  GitHub profile
                </a>
                <a
                  className="block break-all hover:text-white"
                  href={about.contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track("linkedin_clicked", { location: "mobile-layout" })}
                >
                  LinkedIn profile
                </a>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
