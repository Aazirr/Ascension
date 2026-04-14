import type { ExperienceItem } from "@/types";

interface ExperiencePanelProps {
  item: ExperienceItem;
}

export default function ExperiencePanel({ item }: ExperiencePanelProps) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-slate-300/70">Experience</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">{item.role}</h3>
        <p className="mt-2 text-sm text-slate-300/85">{item.company} · {item.location}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{item.dates}</p>
      </div>

      <ul className="space-y-2 text-sm leading-6 text-slate-200/85">
        {item.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d85a30]" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
