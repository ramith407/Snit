import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Plus, Search, Star, FileCode2, Trash2 } from "lucide-react";
import { useSnippets, formatTimeAgo } from "../context/SnippetContext";
import { useToast } from "../components/Toast";
import { fadeUp, pageTransition, staggerContainer } from "../animations/transitions";

const languageClasses = {
  TypeScript: "border-periwinkle/30 bg-periwinkle/10 text-periwinkle",
  SCSS: "border-lavender/30 bg-lavender/10 text-lavender",
  YAML: "border-amber/30 bg-amber/10 text-amber",
  Python: "border-amber/30 bg-amber/10 text-amber",
  RegEx: "border-periwinkle/30 bg-periwinkle/10 text-periwinkle",
  "HTML/CSS": "border-lavender/30 bg-lavender/10 text-lavender",
};

export function SnippetsPage() {
  const { snippets, toggleFavorite, deleteSnippet } = useSnippets();
  const { pushToast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");

  // Extract unique languages
  const languages = useMemo(() => {
    const langs = new Set(snippets.map((s) => s.language).filter(Boolean));
    return ["All", ...Array.from(langs)];
  }, [snippets]);

  // Filtered list
  const filteredSnippets = useMemo(() => {
    return snippets.filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesLanguage = selectedLanguage === "All" || s.language === selectedLanguage;
      return matchesSearch && matchesLanguage;
    });
  }, [snippets, search, selectedLanguage]);

  const handleCopy = (e, snippet) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard?.writeText(snippet.code);
    pushToast({
      title: "Code copied",
      message: `${snippet.fileName} is ready on your clipboard.`,
    });
  };

  const handleToggleStar = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  const handleDelete = async (e, snippet) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(`Delete "${snippet.title}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await deleteSnippet(snippet.id);
      pushToast({
        title: "Snippet deleted",
        message: `${snippet.title} was removed.`,
      });
    } catch (error) {
      pushToast({
        title: "Delete failed",
        message: error.message || "Could not delete this snippet.",
        type: "info",
      });
    }
  };

  return (
    <motion.div {...pageTransition} className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-text md:text-5xl">My Snippets</h1>
          <p className="mt-2 text-lg text-slate-300">
            Manage, search, and reuse your codebase snippets.
          </p>
        </div>
        <Link to="/snippets/new" className="gradient-button shrink-0 self-start sm:self-center">
          <Plus size={18} />
          New Snippet
        </Link>
      </header>

      {/* Search & Filter Bar */}
      <section className="flex flex-col gap-5 md:flex-row md:items-center">
        <label className="relative flex-1">
          <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-shell h-12 pl-12 mono text-sm"
            placeholder="Search snippets, descriptions, or tags..."
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                selectedLanguage === lang
                  ? "bg-periwinkle text-void"
                  : "bg-panel border border-white/10 text-slate-300 hover:bg-panelSoft hover:text-text"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </section>

      {/* Snippet Grid */}
      <AnimatePresence mode="wait">
        {filteredSnippets.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid gap-5 md:grid-cols-2"
          >
            {filteredSnippets.map((snippet) => (
              <motion.div
                key={snippet.id}
                variants={fadeUp}
                layout
                className="group relative flex flex-col justify-between rounded-lg border border-white/10 bg-panel/90 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-periwinkle/35 hover:bg-panelSoft"
              >
                <Link to={`/snippets/${snippet.id}`} className="absolute inset-0 z-0" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-panelMuted mono text-xs font-bold text-periwinkle">
                      {snippet.languageShort || "TX"}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => handleToggleStar(e, snippet.id)}
                        className={`icon-button h-9 w-9 rounded-md transition ${
                          snippet.favorite ? "text-amber" : "text-muted hover:text-text"
                        }`}
                        aria-label="Favorite"
                      >
                        <Star size={18} fill={snippet.favorite ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={(e) => handleCopy(e, snippet)}
                        className="icon-button h-9 w-9 rounded-md text-muted hover:text-text transition"
                        aria-label="Copy code"
                      >
                        <Copy size={18} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, snippet)}
                        className="icon-button h-9 w-9 rounded-md text-muted transition hover:text-danger"
                        aria-label="Delete snippet"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-text group-hover:text-periwinkle transition">
                      {snippet.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 mono text-sm leading-6 text-dim">
                      {snippet.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {snippet.tags.map((tag) => (
                      <span key={tag} className="rounded bg-white/[0.05] px-2 py-0.5 mono text-xs text-slate-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 mt-5 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-muted">
                  <span
                    className={`rounded-md border px-2 py-1 mono ${
                      languageClasses[snippet.language] ?? languageClasses.TypeScript
                    }`}
                  >
                    {snippet.language}
                  </span>
                  <span>Updated {formatTimeAgo(snippet.updatedAt)}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="dev-card py-16 text-center text-slate-300"
          >
            <FileCode2 className="mx-auto mb-4 text-muted" size={48} />
            <p className="text-lg font-medium">No snippets found</p>
            <p className="mt-1 text-sm text-muted">
              Try modifying your search filter or add a new snippet.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
