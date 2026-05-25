import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, FileCode2 } from "lucide-react";
import { StatCard } from "../components/Card";
import { useSnippets, formatTimeAgo } from "../context/SnippetContext";
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
      <span className="hidden w-24 text-right text-sm text-muted sm:block">{formatTimeAgo(snippet.updatedAt)}</span>
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
  const { snippets, stats } = useSnippets();

  const statCards = [
    {
      label: "Total Snippets",
      value: stats.totalSnippets.toLocaleString(),
      detail: `${snippets.length} in your library`,
      tone: "blue",
      icon: "Braces",
    },
    {
      label: "Total Versions",
      value: stats.totalVersions.toLocaleString(),
      detail: "Across all snippets",
      tone: "purple",
      icon: "History",
    },
    {
      label: "Most Used Language",
      value: stats.mostUsedLanguage,
      detail: `${stats.mostUsedPercent}% of total repository`,
      tone: "amber",
      icon: "Code2",
    },
  ];

  const recent = [...snippets]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const favorites = snippets.filter((s) => s.favorite);

  return (
    <motion.div {...pageTransition} className="space-y-12">
      <motion.section
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="grid gap-6 md:grid-cols-3"
      >
        {statCards.map((stat) => (
          <motion.div key={stat.label} variants={fadeUp}>
            <StatCard stat={stat} />
          </motion.div>
        ))}
      </motion.section>

      <section className="grid gap-8 xl:grid-cols-[1.3fr_0.92fr]">
        <div>
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-3xl font-extrabold text-text">Recent Snippets</h2>
            <Link to="/snippets" className="font-semibold text-periwinkle">
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
          {favorites.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {favorites.map((snippet) => (
                <FavoriteSnippetCard key={snippet.id} snippet={snippet} />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted">
              No favorite snippets yet. Star a snippet to see it here.
            </p>
          )}
        </div>
      </section>
    </motion.div>
  );
}
