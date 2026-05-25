import { computeDiff } from "../context/SnippetContext";

function lineClass(type) {
  if (type === "add") return "bg-blue/15 text-slate-100";
  if (type === "remove") return "bg-danger/15 text-slate-100";
  return "text-slate-300";
}

function gutterClass(type) {
  if (type === "add") return "bg-blue/25 text-periwinkle";
  if (type === "remove") return "bg-danger/25 text-rose-200";
  return "text-dim";
}

function DiffPane({ title, fileName, lines, tone }) {
  return (
    <div className="min-w-0 overflow-hidden border-white/10 bg-ink lg:border-r last:border-r-0">
      <header className="flex h-12 items-center justify-between border-b border-white/10 bg-panel/85 px-5">
        <div className="flex items-center gap-3">
          <span
            className={`h-2 w-2 rounded-full ${
              tone === "remove" ? "bg-danger" : "bg-periwinkle"
            }`}
          />
          <span className="mono font-semibold text-text">{title}</span>
        </div>
        <span className="mono text-sm text-muted">{fileName}</span>
      </header>
      <div className="min-h-[620px] overflow-auto py-2 mono text-sm md:text-base">
        {lines.map((line) => (
          <div key={`${title}-${line.no}-${line.text}`} className={`flex ${lineClass(line.type)}`}>
            <span
              className={`sticky left-0 w-12 shrink-0 select-none px-2 text-right ${gutterClass(
                line.type,
              )}`}
            >
              {line.no}
            </span>
            <pre className="min-w-max flex-1 px-5 py-1.5">{line.text || " "}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DiffViewer({
  data,
  oldCode,
  newCode,
  baseLabel = "Base",
  compareLabel = "Compare",
  fileName = "file",
}) {
  const diffData =
    data || (oldCode !== undefined && newCode !== undefined ? computeDiff(oldCode, newCode) : null);

  if (!diffData) return null;

  const displayFileName = diffData.fileName || fileName;

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 shadow-panel">
      <div className="grid lg:grid-cols-2">
        <DiffPane
          title={data ? "Base: v1.2.0" : baseLabel}
          fileName={displayFileName}
          lines={diffData.left}
          tone="remove"
        />
        <DiffPane
          title={data ? "Compare: v1.3.0-rc1" : compareLabel}
          fileName={displayFileName}
          lines={diffData.right}
          tone="add"
        />
      </div>
    </div>
  );
}
