import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock3,
  Code2,
  Search,
  SquareTerminal,
  UsersRound,
} from "lucide-react";
import { Logo } from "../components/Logo";
import { fadeUp, staggerContainer } from "../animations/transitions";

const codeLines = [
  {
    indent: "",
    parts: [
      ["import", "code-token-purple"],
      [" { NextAuthOptions } from ", ""],
      ["'next-auth'", "code-token-blue"],
      [";", ""],
    ],
  },
  {
    indent: "",
    parts: [
      ["import", "code-token-purple"],
      [" GithubProvider from ", ""],
      ["'next-auth/providers/github'", "code-token-blue"],
      [";", ""],
    ],
  },
  { indent: "", parts: [["", ""]] },
  {
    indent: "",
    parts: [
      ["export const", "code-token-purple"],
      [" authOptions: NextAuthOptions = {", ""],
    ],
  },
  { indent: "  ", parts: [["providers: [", ""]] },
  { indent: "    ", parts: [["GithubProvider({", ""]] },
  {
    indent: "      ",
    parts: [
      ["clientId:", ""],
      [" process.env.", ""],
      ["GITHUB_ID", "code-token-amber"],
      ["!,", ""],
    ],
  },
  {
    indent: "      ",
    parts: [
      ["clientSecret:", ""],
      [" process.env.", ""],
      ["GITHUB_SECRET", "code-token-amber"],
      ["!,", ""],
    ],
  },
  { indent: "    ", parts: [["}),", ""]] },
  { indent: "  ", parts: [["],", ""]] },
  { indent: "  ", parts: [["session: {", ""]] },
  {
    indent: "    ",
    parts: [
      ["strategy:", ""],
      [" 'jwt'", "code-token-blue"],
      [",", ""],
    ],
  },
  { indent: "  ", parts: [["},", ""]] },
  {
    indent: "  ",
    parts: [["// Automatically versioned by Snit CLI", "code-token-muted"]],
  },
  {
    indent: "  ",
    parts: [["// Last updated: 2 mins ago (v1.2.4)", "code-token-muted"]],
  },
  { indent: "", parts: [["};", ""]] },
];

const features = [
  {
    title: "Version Control",
    body: "Every edit creates a new iteration. Roll back to previous versions of a snippet effortlessly.",
    icon: Clock3,
    preview: (
      <div className="mt-5 overflow-hidden rounded-md border border-white/10 bg-ink mono text-sm">
        {["v2.1.0", "v2.0.1", "v1.0.0"].map((version, index) => (
          <div
            key={version}
            className="flex items-center justify-between border-b border-white/5 px-3 py-2 last:border-b-0"
          >
            <span className="text-slate-200">{version}</span>
            <span className="text-dim">{index === 0 ? "Just now" : index === 1 ? "2 days ago" : "Jan 12"}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Fast Search",
    body: "Find the exact snippet you need in milliseconds with fuzzy search and language filters.",
    icon: Search,
    preview: (
      <div className="mt-5 flex items-center gap-3 rounded-md border border-white/10 bg-ink px-3 py-3 mono text-sm text-dim">
        <Search size={16} />
        <span>&gt; auth provider</span>
        <kbd className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-xs text-muted">Ctrl K</kbd>
      </div>
    ),
  },
  {
    title: "Language Aware",
    body: "Syntax highlighting and categorization are automatically applied based on your code context.",
    icon: Code2,
    preview: (
      <div className="mt-6 flex flex-wrap gap-2 mono text-xs">
        {["TypeScript", "Python", "Rust"].map((language) => (
          <span key={language} className="rounded bg-ink px-2 py-1 text-slate-200">
            {language}
          </span>
        ))}
      </div>
    ),
  },
  {
    title: "Team Collaboration",
    body: "Share snippet collections across your organization and maintain a single source of truth.",
    icon: UsersRound,
    preview: (
      <div className="mt-6 flex items-center gap-2">
        {["JD", "AS", "MK"].map((initials) => (
          <span
            key={initials}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-panelMuted text-xs text-slate-200"
          >
            {initials}
          </span>
        ))}
        <span className="mono text-sm text-slate-300">+ Shared workspace "Frontend Core"</span>
      </div>
    ),
  },
];

function CodeShowcase() {
  return (
    <motion.div variants={fadeUp} className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-lg border border-white/10 bg-ink shadow-panel">
      <div className="flex h-10 items-center gap-2 border-b border-white/10 bg-[#0d1118] px-4">
        <span className="h-3 w-3 rounded-full bg-[#e6765f]" />
        <span className="h-3 w-3 rounded-full bg-[#dd9c46]" />
        <span className="h-3 w-3 rounded-full bg-[#7e9ed8]" />
        <span className="ml-3 mono text-xs text-muted">utils/auth.ts - Snit v1.0.4</span>
      </div>
      <pre className="overflow-x-auto p-6 text-sm leading-7 text-slate-100 sm:p-7">
        {codeLines.map((line, index) => (
          <div key={index}>
            <span>{line.indent}</span>
            {line.parts.map(([text, className], partIndex) => (
              <span key={`${index}-${partIndex}`} className={className}>
                {text}
              </span>
            ))}
          </div>
        ))}
      </pre>
    </motion.div>
  );
}

function FeatureCard({ feature, wide }) {
  const Icon = feature.icon;
  return (
    <motion.article
      variants={fadeUp}
      className={`dev-card p-6 ${wide ? "lg:col-span-2" : ""}`}
    >
      <div className="flex items-center gap-4">
        <span className="rounded-lg border border-periwinkle/20 bg-periwinkle/10 p-3 text-periwinkle">
          <Icon size={23} />
        </span>
        <h3 className="text-2xl font-bold text-text">{feature.title}</h3>
      </div>
      <p className="mt-5 max-w-2xl leading-7 text-slate-300">{feature.body}</p>
      {feature.preview}
    </motion.article>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-void text-text">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-void/90 backdrop-blur-xl">
        <nav className="section-shell flex h-16 items-center justify-between">
          <Link to="/" aria-label="Snit home">
            <Logo />
          </Link>
          <div className="hidden items-center gap-9 text-sm font-medium text-slate-200 md:flex">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#docs">Docs</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="hidden text-sm font-medium text-slate-200 sm:inline">
              Log in
            </Link>
            <Link to="/snippets/new" className="gradient-button h-10 px-4 py-0 text-sm">
              <SquareTerminal size={16} />
              Create Snippet
            </Link>
          </div>
        </nav>
      </header>

      <main className="page-grid">
        <section className="section-shell py-20 text-center sm:py-28">
          <motion.div initial="initial" animate="animate" variants={staggerContainer}>
            <motion.h1
              variants={fadeUp}
              className="mx-auto max-w-5xl text-5xl font-extrabold leading-tight text-text drop-shadow md:text-7xl"
            >
              Version Your Code Snippets <span className="text-gradient">Smarter</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-300"
            >
              The high-performance workspace for developers to store, version, and share code
              snippets. Treat your snippets like micro-repositories with built-in version control
              and deep language awareness.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/auth" className="gradient-button">
                Get Started
                <ArrowRight size={18} />
              </Link>
              <a href="#features" className="ghost-button">
                Explore Features
              </a>
            </motion.div>
            <CodeShowcase />
          </motion.div>
        </section>

        <section id="features" className="section-shell pb-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold text-text">Engineered for Focus</h2>
            <p className="mt-4 leading-7 text-slate-300">
              Stop digging through old Slack messages or cluttered notes apps. Access your
              precise, versioned code instantly.
            </p>
          </div>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="mt-10 grid gap-5 lg:grid-cols-3"
          >
            <FeatureCard feature={features[0]} wide />
            <FeatureCard feature={features[1]} />
            <FeatureCard feature={features[2]} />
            <FeatureCard feature={features[3]} wide />
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-void">
        <div className="section-shell flex flex-col gap-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Snit Inc.</p>
          <div className="flex gap-6 text-slate-200">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#twitter">Twitter</a>
            <a href="#github">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
