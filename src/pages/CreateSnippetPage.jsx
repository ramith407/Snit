import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, GitBranch, Hash, Plus, Save } from "lucide-react";
import { motion } from "framer-motion";
import { CodeEditorWrapper } from "../components/CodeEditorWrapper";
import { useToast } from "../components/Toast";
import { pageTransition } from "../animations/transitions";

const starterCode = `// Write or paste your code here...

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    // ...
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};`;

const languages = ["TypeScript", "JavaScript", "Python", "YAML", "SCSS", "HTML/CSS"];

export function CreateSnippetPage() {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("TypeScript");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState(starterCode);
  const [commitMessage, setCommitMessage] = useState("Initial commit");
  const [showValidation, setShowValidation] = useState(false);
  const { pushToast } = useToast();

  const hasTitle = title.trim().length > 0;
  const hasCode = code.trim().length > 0;

  function handleSave() {
    setShowValidation(true);
    if (!hasTitle || !hasCode) return;
    pushToast({
      title: "Snippet saved",
      message: "Static UI state updated. Backend persistence comes next.",
    });
  }

  return (
    <motion.div {...pageTransition} className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-text md:text-5xl">Create New Snippet</h1>
          <p className="mt-3 text-lg text-slate-300">
            Save and organize your reusable code blocks.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300">
          <span className="h-2.5 w-2.5 rounded-full bg-periwinkle" />
          Draft
        </span>
      </header>

      <section className="grid gap-7 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-7">
          <div className="dev-card p-5">
            <label className="block">
              <span className="mb-3 block font-semibold text-slate-200">Snippet Title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className={`input-shell ${showValidation && !hasTitle ? "border-danger/70" : ""}`}
                placeholder="e.g., JWT Auth Middleware"
              />
              {showValidation && !hasTitle && (
                <span className="mt-2 block text-sm text-danger">A snippet title is required.</span>
              )}
            </label>

            <label className="mt-6 block">
              <span className="mb-3 block font-semibold text-slate-200">Language</span>
              <span className="relative block">
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="input-shell appearance-none pr-11 font-semibold"
                >
                  {languages.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <ChevronDown
                  size={20}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
                />
              </span>
            </label>

            <label className="mt-6 block">
              <span className="mb-3 block font-semibold text-slate-200">Description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="input-shell min-h-36 resize-none"
                placeholder="Briefly describe what this snippet does..."
              />
            </label>
          </div>

          <div className="dev-card p-5">
            <div className="mb-4 flex items-center gap-3">
              <Hash size={19} className="text-muted" />
              <h2 className="font-semibold text-slate-200">Tags</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {["auth", "middleware"].map((tag) => (
                <span key={tag} className="rounded-full bg-white/[0.06] px-3 py-2 mono text-sm">
                  #{tag}
                </span>
              ))}
              <button className="inline-flex items-center gap-2 rounded-full border border-dashed border-white/15 px-3 py-2 mono text-sm text-slate-200 transition hover:border-periwinkle/40 hover:text-periwinkle">
                <Plus size={16} />
                Add Tag
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-7">
          <CodeEditorWrapper
            value={code}
            onChange={setCode}
            language={language}
            fileName="middleware.ts"
            height="570px"
          />
          {showValidation && !hasCode && (
            <p className="text-sm text-danger">Add code before saving the snippet.</p>
          )}

          <div className="dev-card p-5">
            <div className="mb-4 flex items-center gap-3">
              <GitBranch size={20} className="text-dim" />
              <h2 className="font-semibold text-slate-200">Commit / Version Message</h2>
            </div>
            <input
              value={commitMessage}
              onChange={(event) => setCommitMessage(event.target.value)}
              className="input-shell mono"
              placeholder="Initial commit"
            />
          </div>
        </div>
      </section>

      <footer className="flex flex-col items-stretch justify-end gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
        <Link to="/dashboard" className="ghost-button">
          Cancel
        </Link>
        <button className="gradient-button" onClick={handleSave}>
          <Save size={18} />
          Save Snippet
        </button>
      </footer>
    </motion.div>
  );
}
