import Editor from "@monaco-editor/react";
import { Copy, FileCode2, List, PanelRight } from "lucide-react";

const languageMap = {
  TypeScript: "typescript",
  JavaScript: "javascript",
  SCSS: "scss",
  YAML: "yaml",
  Python: "python",
  RegEx: "plaintext",
  "HTML/CSS": "css",
};

function defineSnitTheme(monaco) {
  monaco.editor.defineTheme("snit-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "697386", fontStyle: "italic" },
      { token: "keyword", foreground: "D9ADFF" },
      { token: "string", foreground: "FFAD72" },
      { token: "number", foreground: "A3BEFF" },
      { token: "type", foreground: "AAC0FF" },
    ],
    colors: {
      "editor.background": "#070A0F",
      "editor.foreground": "#E8ECF8",
      "editorLineNumber.foreground": "#4F586A",
      "editorLineNumber.activeForeground": "#AAC0FF",
      "editor.selectionBackground": "#24324E",
      "editor.lineHighlightBackground": "#0C111B",
      "editorCursor.foreground": "#AAC0FF",
      "editorIndentGuide.background1": "#202634",
      "editorWidget.background": "#151922",
    },
  });
}

export function CodeEditorWrapper({
  value,
  onChange,
  language = "TypeScript",
  fileName = "snippet.ts",
  height = "540px",
  readOnly = false,
  compact = false,
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-ink shadow-panel">
      <div className="flex h-12 items-center justify-between border-b border-white/10 bg-panel/85 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <FileCode2 size={18} className="shrink-0 text-muted" />
          <span className="truncate mono text-sm text-slate-200">{fileName}</span>
        </div>
        <div className="flex items-center gap-2 text-muted">
          <List size={17} />
          <Copy size={17} />
          {!compact && <PanelRight size={17} className="hidden sm:block" />}
        </div>
      </div>
      <Editor
        height={height}
        language={languageMap[language] ?? language.toLowerCase()}
        theme="snit-dark"
        value={value}
        beforeMount={defineSnitTheme}
        loading={<div className="skeleton m-4 h-[calc(100%-2rem)]" />}
        onChange={(nextValue) => onChange?.(nextValue ?? "")}
        options={{
          readOnly,
          fontSize: 15,
          lineHeight: 26,
          fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace",
          minimap: { enabled: false },
          wordWrap: "on",
          scrollBeyondLastLine: false,
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          renderLineHighlight: readOnly ? "none" : "line",
          padding: { top: 20, bottom: 20 },
          smoothScrolling: true,
          cursorBlinking: "phase",
          folding: false,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
      />
    </div>
  );
}
