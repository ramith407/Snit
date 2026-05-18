import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, FileCode2 } from "lucide-react";
import { DashboardSkeleton } from "../components/Skeleton";
import { StatCard } from "../components/Card";
import { useFakeLoading } from "../hooks/useFakeLoading";
import { snippets, stats } from "../data/snippets";
import { fadeUp, pageTransition, staggerContainer } from "../animations/transitions";

const languageClasses = {
  TypeScript: "border-periwinkle/30 bg-periwinkle/10 text-periwinkle",
  SCSS: "border-lavender/30 bg-lavender/10 text-lavender",
  YAML: "border-amber/30 bg-amber/10 text-amber",
  Python: "border-amber/30 bg-amber/10 text-amber",
  RegEx: "border-periwinkle/30 bg-periwinkle/10 text-periwinkle",
  "HTML/CSS": "border-lavender/30 bg-lavender/10 text-lavender",
};

function RecentSnippetRow({ snippet }) {
  return (
    <Link
      to={`/snippets/${snippet.id}`}
      className="group flex items-center gap-4 rounded-lg border border-white/10 bg-panel/90 p-3 transition duration-200 hover:-translate-y-0.5 hover:border-periwinkle/35 hover:bg-panelSoft"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-panelMuted mono text-xs font-bold text-periwinkle">
        {snippet.languageShort}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-xl font-semibold text-text">{snippet.title}</h3>
        <p className="truncate mono text-sm text-dim">{snippet.description}</p>
      </div>
      <span
        className={`hidden rounded-md border px-3 py-2 mono text-sm sm:inline-flex ${
          languageClasses[snippet.language] ?? languageClasses.TypeScript
        }`}
      >
        {snippet.language}
      </span>
      <span className="hidden w-24 text-right text-sm text-muted sm:block">{snippet.updatedAt}</span>
    </Link>
  );
}

function FavoriteSnippetCard({ snippet }) {
  return (
    <Link
      id={snippet.id}
      to={`/snippets/${snippet.id}`}
      className="group flex min-h-[170px] flex-col rounded-lg border border-white/10 bg-panel/90 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-periwinkle/35 hover:bg-panelSoft"
    >
      <h3 className="max-w-[12rem] text-2xl font-medium leading-snug text-text">{snippet.title}</h3>
      <p className="mt-3 line-clamp-3 mono text-sm leading-6 text-dim">{snippet.description}</p>
      <div className="mt-auto flex items-end justify-between border-t border-white/5 pt-4">
        <span className="mono text-sm font-semibold text-periwinkle">{snippet.language}</span>
        <Copy size={19} className="text-dim transition group-hover:text-periwinkle" />
      </div>
    </Link>
  );
}

export function DashboardPage() {
  const loading = useFakeLoading(450);
  const recent = snippets.slice(1, 4);
  const favorites = snippets.filter((snippet) => snippet.favorite);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div {...pageTransition} className="space-y-12">
      <motion.section
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="grid gap-6 md:grid-cols-3"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={fadeUp}>
            <StatCard stat={stat} />
          </motion.div>
        ))}
      </motion.section>

      <section className="grid gap-8 xl:grid-cols-[1.3fr_0.92fr]">
        <div>
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-3xl font-extrabold text-text">Recent Snippets</h2>
            <Link to="/snippets/jwt-auth-middleware" className="font-semibold text-periwinkle">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recent.map((snippet) => (
              <RecentSnippetRow key={snippet.id} snippet={snippet} />
            ))}
          </div>
        </div>

        <div id="favorites">
          <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-4">
            <FileCode2 className="text-periwinkle" size={27} />
            <h2 className="text-3xl font-extrabold text-text">Favorite Snippets</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {favorites.map((snippet) => (
              <FavoriteSnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
