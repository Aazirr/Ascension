import type { CertificationItem } from "@/types";

interface CertificationPanelProps {
  item: CertificationItem;
}

export default function CertificationPanel({ item }: CertificationPanelProps) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-slate-300/70">Certification</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">{item.name}</h3>
        <p className="mt-2 text-sm text-slate-300/85">{item.issuer}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{item.date}</p>
      </div>

      {item.credentialUrl ? (
        <a
          href={item.credentialUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          View credential
        </a>
      ) : (
        <p className="text-sm text-slate-400">Credential URL not added yet.</p>
      )}
    </section>
  );
}
