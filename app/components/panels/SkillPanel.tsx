import TechIcon from "../ui/TechIcon";
import type { SkillCategory } from "@/types";

interface SkillPanelProps {
  category: SkillCategory;
}

export default function SkillPanel({ category }: SkillPanelProps) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-slate-300/70">Skills</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">{category.category}</h3>
      </div>

      <div className="grid gap-3">
        {category.skills.map((skill) => (
          <article key={skill.name} className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center gap-2">
              <TechIcon name={skill.name} size={16} className="h-4 w-4" />
              <h4 className="text-sm font-semibold text-white">{skill.name}</h4>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300/85">{skill.context}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
