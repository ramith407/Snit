import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Copy, Download, GitCompareArrows, Plus, Save } from "lucide-react";
import { motion } from "framer-motion";
import { CodeEditorWrapper } from "../components/CodeEditorWrapper";
import { LanguagePill, Tag } from "../components/Card";
import { Modal } from "../components/Modal";
import { Timeline } from "../components/Timeline";
import { useToast } from "../components/Toast";
import { snippets } from "../data/snippets";
import { pageTransition } from "../animations/transitions";

export function SnippetDetailsPage() {
  const { id } = useParams();
  const snippet = useMemo(
    () => snippets.find((item) => item.id === id) ?? snippets[0],
    [id],
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("Patch token extraction edge cases");
  const { pushToast } = useToast();

  function handleCopy() {
    navigator.clipboard?.writeText(snippet.code);
    pushToast({ title: "Code copied", message: `${snippet.fileName} is ready on your clipboard.` });
  }

  function handleDownload() {
    pushToast({ title: "Download queued", message: "Frontend-only mock action completed." });
  }

  function handleVersionCreate() {
    setModalOpen(false);
    pushToast({ title: "Version drafted", message: message || "New static version created." });
  }

  return (
    <motion.div {...pageTransition} className="space-y-8">
      <header className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl">
          <div className="mb-4">
            <LanguagePill language={snippet.language} />
          </div>
          <h1 className="text-4xl font-extrabold leading-tight text-text md:text-5xl">
            {snippet.title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">{snippet.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {snippet.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="ghost-button" onClick={handleDownload}>
            <Download size={18} />
            Download
          </button>
          <button className="ghost-button" onClick={handleCopy}>
            <Copy size={18} />
            Copy Code
          </button>
          <Link to={`/snippets/${snippet.id}/compare`} className="ghost-button">
            <GitCompareArrows size={18} />
            Compare
          </Link>
          <button className="gradient-button" onClick={() => setModalOpen(true)}>
            <Plus size={18} />
            New Version
          </button>
        </div>
      </header>

      <section className="grid gap-7 xl:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <Timeline versions={snippet.versions ?? snippets[0].versions} />
          <div className="dev-card grid grid-cols-2 gap-4 p-5">
            <div>
              <p className="text-sm font-semibold uppercase text-muted">Views</p>
              <p className="mt-2 text-3xl font-extrabold text-text">{snippet.views ?? "842"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase text-muted">Forks</p>
              <p className="mt-2 text-3xl font-extrabold text-text">{snippet.forks ?? "18"}</p>
            </div>
          </div>
        </aside>

        <CodeEditorWrapper
          value={snippet.code}
          language={snippet.language}
          fileName={snippet.fileName}
          height="690px"
          readOnly
        />
      </section>

      <Modal open={modalOpen} title="Create New Version" onClose={() => setModalOpen(false)}>
        <label className="block">
          <span className="mb-3 block font-semibold text-slate-200">Version message</span>
          <textarea
            className="input-shell min-h-28 resize-none"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </label>
        <div className="mt-5 flex justify-end gap-3">
          <button className="ghost-button" onClick={() => setModalOpen(false)}>
            Cancel
          </button>
          <button className="gradient-button" onClick={handleVersionCreate}>
            <Save size={18} />
            Save Version
          </button>
        </div>
      </Modal>
    </motion.div>
  );
}
