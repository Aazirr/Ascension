import type { AboutData } from "@/types";

interface AboutPanelProps {
  about: AboutData;
}

export default function AboutPanel({ about }: AboutPanelProps) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-slate-300/70">About</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Background</h3>
        <p className="mt-2 text-sm leading-6 text-slate-200/85">{about.intro}</p>
      </div>

      <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <h4 className="text-sm font-semibold text-white">Gaming / Community</h4>
        <p className="mt-2 text-sm leading-6 text-slate-300/85">{about.gamingCommunity}</p>
      </article>

      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
        <div className="flex items-center gap-2 font-medium">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          {about.availability}
        </div>
      </div>

      <div className="space-y-2 text-sm text-slate-300/85">
        <a className="block break-all hover:text-white" href={`mailto:${about.contact.email}`}>
          {about.contact.email}
        </a>
        <a className="block break-all hover:text-white" href={about.contact.github} target="_blank" rel="noreferrer">
          {about.contact.github}
        </a>
        <a className="block break-all hover:text-white" href={about.contact.linkedin} target="_blank" rel="noreferrer">
          {about.contact.linkedin}
        </a>
      </div>

      <a
        href="/resume.pdf"
        download
        className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200"
      >
        Download Resume
      </a>
    </section>
  );
}
