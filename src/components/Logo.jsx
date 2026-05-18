import { Code2 } from "lucide-react";

export function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-brand-gradient shadow-glow">
        <Code2 size={19} className="text-ink" strokeWidth={2.4} />
      </div>
      {!compact && (
        <span className="text-2xl font-extrabold leading-none text-text drop-shadow">
          Snit
        </span>
      )}
    </div>
  );
}
