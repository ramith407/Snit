import {
  Braces,
  Code2,
  History,
  Languages,
  SquareTerminal,
  UsersRound,
} from "lucide-react";

const iconMap = {
  Braces,
  Code2,
  History,
  Languages,
  SquareTerminal,
  UsersRound,
};

const toneClasses = {
  blue: "text-periwinkle bg-blue/10 border-blue/25",
  purple: "text-lavender bg-lavender/10 border-lavender/20",
  amber: "text-amber bg-amber/10 border-amber/25",
  green: "text-green bg-green/10 border-green/25",
};

export function Panel({ children, className = "" }) {
  return <section className={`dev-card ${className}`}>{children}</section>;
}

export function StatCard({ stat }) {
  const Icon = iconMap[stat.icon] ?? Braces;
  const tone = toneClasses[stat.tone] ?? toneClasses.blue;

  return (
    <Panel className="relative min-h-[220px] p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-semibold uppercase text-slate-300">{stat.label}</p>
        <span className={`rounded-md border p-2 ${tone}`}>
          <Icon size={22} />
        </span>
      </div>
      <div className="mt-6">
        <p className="text-5xl font-extrabold leading-none text-text drop-shadow md:text-6xl">
          {stat.value}
        </p>
        <p
          className={`mt-4 text-base ${
            stat.tone === "amber" ? "text-amber" : stat.tone === "purple" ? "text-dim" : "text-periwinkle"
          }`}
        >
          {stat.detail}
        </p>
      </div>
    </Panel>
  );
}

export function LanguagePill({ language, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md border border-periwinkle/25 bg-periwinkle/10 px-3 py-1.5 mono text-sm font-semibold uppercase text-periwinkle ${className}`}
    >
      <span className="h-2 w-2 rounded-full bg-periwinkle" />
      {language}
    </span>
  );
}

export function Tag({ children }) {
  return (
    <span className="inline-flex rounded-md border border-white/10 bg-white/[0.08] px-3 py-1.5 mono text-sm text-slate-200">
      #{children}
    </span>
  );
}
