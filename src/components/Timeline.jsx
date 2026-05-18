import { Clock3 } from "lucide-react";

export function Timeline({ versions }) {
  return (
    <div className="dev-card p-5">
      <div className="mb-6 flex items-center gap-3">
        <Clock3 className="text-periwinkle" size={26} />
        <h2 className="text-2xl font-semibold text-text">Version History</h2>
      </div>
      <ol className="relative ml-2 border-l border-white/10 pl-7">
        {versions.map((version) => (
          <li key={version.id} className="relative pb-9 last:pb-0">
            <span
              className={`absolute -left-[34px] top-1 h-3.5 w-3.5 rounded-full border border-panel ${
                version.current ? "bg-periwinkle shadow-glow" : "bg-dim"
              }`}
            />
            <div
              className={
                version.current
                  ? "rounded-lg border border-periwinkle/25 bg-periwinkle/[0.08] p-4"
                  : "p-2"
              }
            >
              <div className="flex items-start justify-between gap-4">
                <p className="font-bold text-text">
                  {version.label}
                  {version.current && <span className="text-periwinkle"> (Current)</span>}
                </p>
                <span className="whitespace-nowrap text-sm text-muted">{version.date}</span>
              </div>
              <p className="mt-2 leading-6 text-slate-200">{version.message}</p>
              <p className="mt-3 mono text-sm text-muted">@{version.author}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
