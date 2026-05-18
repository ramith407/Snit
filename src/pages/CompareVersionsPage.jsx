import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeftRight, ChevronDown, GitCompareArrows, Merge, RotateCcw } from "lucide-react";
import { DiffViewer } from "../components/DiffViewer";
import { useToast } from "../components/Toast";
import { compareData } from "../data/snippets";
import { pageTransition } from "../animations/transitions";

function VersionSelect({ label, value }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold uppercase text-slate-300">{label}</span>
      <span className="relative block">
        <select className="input-shell h-[52px] appearance-none pr-12 mono" defaultValue={value}>
          <option>{value}</option>
          <option>v1.1.0</option>
          <option>v1.0.0</option>
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
          size={20}
        />
      </span>
    </label>
  );
}

export function CompareVersionsPage() {
  const { pushToast } = useToast();

  return (
    <motion.div {...pageTransition} className="space-y-8">
      <div className="flex flex-wrap items-center gap-3 text-lg text-slate-300">
        <Link to="/snippets/jwt-auth-middleware" className="hover:text-text">
          Snippets
        </Link>
        <span>&gt;</span>
        <span className="text-text">{compareData.snippetTitle}</span>
      </div>

      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-text md:text-5xl">Compare Versions</h1>
          <p className="mt-3 flex items-center gap-3 text-lg text-slate-300">
            <GitCompareArrows size={22} className="text-muted" />
            Viewing differences for <strong className="text-text">{compareData.snippetTitle}</strong>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="ghost-button"
            onClick={() =>
              pushToast({
                title: "Revert simulated",
                message: "Static comparison state remains unchanged.",
                type: "info",
              })
            }
          >
            <RotateCcw size={18} />
            Revert to Base
          </button>
          <button
            className="ghost-button border-periwinkle/30 text-periwinkle"
            onClick={() =>
              pushToast({
                title: "Merge simulated",
                message: "No repository changes were made.",
                type: "info",
              })
            }
          >
            <Merge size={18} />
            Merge Changes
          </button>
        </div>
      </header>

      <section className="dev-card p-5">
        <div className="grid gap-5 xl:grid-cols-[1fr_auto_1fr_auto] xl:items-end">
          <VersionSelect label="Base Version" value={compareData.baseVersion} />
          <span className="hidden h-11 w-11 items-center justify-center rounded-full bg-panelMuted text-muted xl:flex">
            <ArrowLeftRight size={20} />
          </span>
          <VersionSelect label="Compare Version" value={compareData.compareVersion} />
          <div className="flex flex-wrap gap-3">
            <span className="rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 font-semibold text-rose-200">
              - {compareData.removals} Removals
            </span>
            <span className="rounded-lg border border-blue/20 bg-blue/10 px-4 py-3 font-semibold text-periwinkle">
              + {compareData.additions} Additions
            </span>
          </div>
        </div>
      </section>

      <DiffViewer data={compareData} />
    </motion.div>
  );
}
