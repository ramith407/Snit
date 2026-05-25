import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Copy, Search } from "lucide-react";
import { useSnippets, formatTimeAgo } from "../context/SnippetContext";
import { useToast } from "../components/Toast";
import { pageTransition, staggerContainer } from "../animations/transitions";

export function FavoritesPage() {
  const { snippets, toggleFavorite } = useSnippets();
  const { pushToast } = useToast();
  const [search, setSearch] = useState("");

  const favorites = useMemo(() => {
    return snippets.filter((s) => {
      const isFav = s.favorite;
      const matchesSearch =
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return isFav && matchesSearch;
    });
  }, [snippets, search]);

  const handleCopy = (e, snippet) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard?.writeText(snippet.code);
    pushToast({
      title: "Code copied",
      message: `${snippet.fileName} is ready on your clipboard.`,
    });
  };

  const handleUnfavorite = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
    pushToast({
      title: "Removed favorite",
      message: "Snippet has been removed from favorites.",
      type: "info",
    });
  };

  return (
    <motion.div {...pageTransition} className="space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold text-text md:text-5xl">Favorite Snippets</h1>
        <p className="mt-2 text-lg text-slate-300">
          Your bookmarked and starred codebase snippets for quick access.
        </p>
      </header>

      {/* Search Bar */}
      <section className="flex flex-col gap-5 md:flex-row md:items-center">
        <label className="relative flex-1">
          <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-shell h-12 pl-12 mono text-sm"
            placeholder="Search favorites..."
          />
        </label>
      </section>

      {/* Snippet Grid with Framer Motion Layout animations */}
      <AnimatePresence mode="popLayout">
        {favorites.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid gap-5 sm:grid-cols-2"
          >
            {favorites.map((snippet) => (
              <motion.div
                key={snippet.id}
                layout
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="group relative flex min-h-[180px] flex-col justify-between rounded-lg border border-white/10 bg-panel/90 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-periwinkle/35 hover:bg-panelSoft"
              >
                <Link to={`/snippets/${snippet.id}`} className="absolute inset-0 z-0" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-semibold leading-snug text-text group-hover:text-periwinkle transition">
                      {snippet.title}
                    </h3>
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={(e) => handleUnfavorite(e, snippet.id)}
                        className="icon-button h-9 w-9 rounded-md text-amber transition hover:scale-105"
                        aria-label="Remove Favorite"
                      >
                        <Star size={18} fill="currentColor" />
                      </button>
                      <button
                        onClick={(e) => handleCopy(e, snippet)}
                        className="icon-button h-9 w-9 rounded-md text-muted hover:text-text transition"
                        aria-label="Copy Code"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-3 mono text-sm leading-6 text-dim">
                    {snippet.description}
                  </p>
                </div>

                <div className="relative z-10 mt-5 flex items-end justify-between border-t border-white/5 pt-4">
                  <span className="mono text-sm font-semibold text-periwinkle">
                    {snippet.language}
                  </span>
                  <span className="text-xs text-muted">Updated {formatTimeAgo(snippet.updatedAt)}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="dev-card py-16 text-center text-slate-300"
          >
            <Star className="mx-auto mb-4 text-muted opacity-55" size={48} />
            <p className="text-lg font-medium">No favorites found</p>
            <p className="mt-1 text-sm text-muted">
              {search.trim() ? "Try modifying your search criteria." : "Star snippets to see them in this collection."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
