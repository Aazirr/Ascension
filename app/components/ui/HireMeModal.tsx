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
  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl rounded-[2rem] border border-white/15 bg-[rgba(5,5,16,0.96)] p-6 shadow-2xl shadow-black/50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hire-me-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-300/70">
              Recruiter Summary
            </p>
            <h2 id="hire-me-title" className="mt-2 text-3xl font-semibold text-white">
              Why hire me
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

        <div className="mt-6 space-y-5 text-sm leading-7 text-slate-200/88">
          <p>
            I am the kind of developer you hire when you want someone who can turn a
            messy real-world problem into something usable, reliable, and easy to work
            with. I care a lot about making software feel intentional, not overbuilt.
          </p>
          <p>
            My strongest work sits between product thinking and implementation. I can
            build the frontend experience, handle backend logic, wire up integrations,
            and ship the whole thing without losing focus on what the user actually
            needs.
          </p>
          <p>
            I work with React, Next.js, TypeScript, Node.js, Express, PostgreSQL, and
            automation tools, but what matters more is how I use them: to build systems
            that solve practical problems, iterate quickly, and stay maintainable as they
            grow.
          </p>
          <p>
            I am still early in my career, which means I bring hunger, adaptability, and
            a real willingness to learn fast. What you get from me is strong ownership,
            clear communication, and someone who genuinely wants to be useful from day
            one.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400/70">Strength</p>
            <p className="mt-2 text-sm text-white">Turning practical needs into shipped software</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400/70">Best Fit</p>
            <p className="mt-2 text-sm text-white">Junior full-stack, frontend, or automation-focused roles</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400/70">Status</p>
            <p className="mt-2 text-sm text-white">{about.availability}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/resume.pdf"
            download
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Download Resume
          </a>
          <a
            href={`mailto:${about.contact.email}`}
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Email Me
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
      </div>
    </div>
  );
}
