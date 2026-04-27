import { AnimatePresence, motion } from "framer-motion";
import TechIcon from "./TechIcon";
import { track } from "@/app/lib/analytics";
import type { AboutData } from "@/types";

interface HireMeModalProps {
  about: AboutData;
  isOpen: boolean;
  onClose: () => void;
}

export default function HireMeModal({
  about,
  isOpen,
  onClose,
}: HireMeModalProps) {
  const stack = [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "Vercel",
  ];

  const summaryCards = [
    {
      label: "Role Fit",
      value: "Junior full-stack / frontend developer",
      tone: "from-cyan-400/18 to-transparent",
    },
    {
      label: "Strongest Value",
      value: "Building deployed web apps, API integrations, and automation workflows",
      tone: "from-emerald-400/18 to-transparent",
    },
    {
      label: "Working Style",
      value: "Practical problem solving, clear communication, and quick learning",
      tone: "from-amber-400/18 to-transparent",
    },
    {
      label: "Availability",
      value: about.availability,
      tone: "from-violet-400/18 to-transparent",
    },
  ];

  const rolePills = [
    "Junior full-stack",
    "React / Next.js",
    "Node / Express",
    "PostgreSQL",
    "API integrations",
    "Automation workflows",
  ];

  const highlights = [
    {
      title: "I build around real workflows",
      body: "I like turning real operational problems into usable tools, from apartment billing and SMS reminders to dashboard workflows, bots, and API integrations.",
    },
    {
      title: "I can move across the stack",
      body: "I am comfortable working on UI, backend logic, database structure, integrations, and deployment when a project needs end-to-end momentum.",
    },
    {
      title: "I take ownership while learning fast",
      body: "I ask questions early, communicate progress clearly, and take responsibility for moving work forward instead of waiting for every next step.",
    },
  ];

  const flowSteps = [
    "Understand the problem clearly",
    "Design the simplest useful solution",
    "Build with speed and structure",
    "Ship, test, and improve based on real use",
  ];

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/15 bg-[rgba(5,5,16,0.96)] shadow-2xl shadow-black/50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hire-me-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="max-h-[88vh] overflow-y-auto">
              <div className="sticky top-0 z-10 border-b border-white/10 bg-[rgba(5,5,16,0.94)] px-6 py-5 backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-300/70">
                      Recruiter Summary
                    </p>
                    <h2
                      id="hire-me-title"
                      className="mt-2 text-3xl font-semibold text-white sm:text-4xl"
                    >
                      Recruiter snapshot
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs text-white transition hover:bg-white/10"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="space-y-8 px-6 py-6">
                <section className="rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(127,119,221,0.2),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(29,158,117,0.14),transparent_34%),rgba(255,255,255,0.04)] p-6">
                  <p className="max-w-3xl text-lg leading-8 text-slate-100 sm:text-xl sm:leading-9">
                    I am a junior full-stack developer focused on building
                    practical web applications, automation tools, and
                    API-integrated systems. My projects cover dashboard
                    interfaces, authentication, databases, bots, webhooks, SMS
                    workflows, and deployment.
                  </p>

                  <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300/88 sm:text-lg">
                    My best work happens when I can understand a real problem,
                    choose a practical solution, and turn it into software that
                    is clear enough to use and structured enough to maintain.
                    This interactive portfolio reflects the kind of product
                    experience I enjoy building: useful, visual, and memorable.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {stack.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-sm text-slate-100"
                      >
                        <TechIcon name={item} size={16} className="h-4 w-4" />
                        {item}
                      </span>
                    ))}
                  </div>
                </section>

                <section>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400/70">
                    At A Glance
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {summaryCards.map((card) => (
                      <article
                        key={card.label}
                        className={`rounded-2xl border border-white/10 bg-gradient-to-br ${card.tone} bg-[rgba(255,255,255,0.04)] p-4`}
                      >
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400/75">
                          {card.label}
                        </p>
                        <p className="mt-2 text-base leading-7 text-white sm:text-lg">
                          {card.value}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>

                <section>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400/70">
                    Best Fit
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {rolePills.map((pill) => (
                      <span
                        key={pill}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200/90"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="grid gap-3">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400/70">
                    What I Bring
                  </p>

                  {highlights.map((item, index) => (
                    <article
                      key={item.title}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/20 text-sm font-semibold text-white">
                          0{index + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-base leading-8 text-slate-300/85">
                            {item.body}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </section>

                <section className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400/70">
                    How I Work
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {flowSteps.map((step, index) => (
                      <div
                        key={step}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-400/70">
                          Step {index + 1}
                        </p>
                        <p className="mt-2 text-base leading-7 text-white">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400/70">
                    Recruiter Note
                  </p>
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                    <p className="text-base leading-8 text-slate-200/90 sm:text-lg">
                      I am early in my career, but I already enjoy working on
                      real product problems: understanding the workflow,
                      building the system, integrating services, and improving
                      the experience after testing.
                    </p>
                    <p className="mt-4 text-base leading-8 text-slate-300/85 sm:text-lg">
                      I am looking for a junior developer role where I can
                      contribute to real product work, keep improving through
                      feedback, and grow into a dependable full-stack engineer.
                    </p>
                  </div>
                </section>
              </div>

              <div className="sticky bottom-0 z-10 border-t border-white/10 bg-[rgba(5,5,16,0.94)] px-6 py-4 backdrop-blur-xl">
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/resume.pdf"
                    download
                    onClick={() =>
                      track("resume_clicked", { location: "hire-me-modal" })
                    }
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                  >
                    Download Resume
                  </a>
                  <a
                    href={`mailto:${about.contact.email}`}
                    onClick={() =>
                      track("email_clicked", { location: "hire-me-modal" })
                    }
                    className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Email Me
                  </a>
                  <a
                    href={about.contact.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      track("linkedin_clicked", { location: "hire-me-modal" })
                    }
                    className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}