"use client";

interface BreadcrumbProps {
  path: Array<{ id: string; label: string }>;
  onNavigate: (nodeId: string) => void;
}

export default function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  if (path.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-400/70">
      {path.map((item, index) => (
        <div key={item.id} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate(item.id)}
            className="hover:text-slate-200/85 transition-colors"
          >
            {item.label}
          </button>
          {index < path.length - 1 && <span className="text-slate-500/50">/</span>}
        </div>
      ))}
    </nav>
  );
}
