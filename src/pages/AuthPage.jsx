import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Chrome, Github, LockKeyhole, Mail, SquareTerminal } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "../components/Toast";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    email: "dev@snit.io",
    password: "password",
    name: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const errors = useMemo(() => {
    const nextErrors = {};
    if (!validateEmail(form.email)) nextErrors.email = "Use a valid email address.";
    if (form.password.length < 8) nextErrors.password = "Password needs at least 8 characters.";
    if (mode === "signup" && form.name.trim().length < 2) {
      nextErrors.name = "Display name is required.";
    }
    return nextErrors;
  }, [form, mode]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    pushToast({
      title: mode === "login" ? "Welcome back" : "Workspace created",
      message: "Snit is running with static frontend data for now.",
    });
    navigate("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-4 py-12 text-text">
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "linear-gradient(rgba(90,146,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(217,173,255,0.1) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          transform: "perspective(900px) rotateX(62deg) scale(1.6)",
          transformOrigin: "center",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,12,19,0.5),#090c13_82%)]" />

      <motion.section
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="glass-panel relative z-10 w-full max-w-[440px] overflow-hidden rounded-lg"
      >
        <div className="px-8 pt-8 text-center">
          <Link
            to="/"
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg border border-white/10 bg-panelMuted shadow-glow"
            aria-label="Back to Snit"
          >
            <SquareTerminal className="text-periwinkle" size={28} />
          </Link>
          <h1 className="mt-6 text-3xl font-extrabold text-text">
            Snit
          </h1>
          <p className="mt-2 text-lg text-slate-300">Welcome back to the console</p>
        </div>

        <div className="mt-7 grid grid-cols-2 border-b border-white/10 px-8">
          {["login", "signup"].map((tab) => (
            <button
              key={tab}
              className={`border-b-2 px-4 py-4 font-semibold transition ${
                mode === tab
                  ? "border-periwinkle text-periwinkle"
                  : "border-transparent text-slate-300 hover:text-text"
              }`}
              onClick={() => {
                setMode(tab);
                setSubmitted(false);
              }}
            >
              {tab === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        <form className="space-y-5 px-8 py-8" onSubmit={handleSubmit} noValidate>
          {mode === "signup" && (
            <label className="block">
              <span className="mb-2 block font-medium text-slate-200">Display name</span>
              <input
                className={`input-shell ${submitted && errors.name ? "border-danger/70" : ""}`}
                value={form.name}
                placeholder="Alex Mercer"
                onChange={(event) => updateField("name", event.target.value)}
              />
              {submitted && errors.name && (
                <span className="mt-2 block text-sm text-danger">{errors.name}</span>
              )}
            </label>
          )}

          <label className="block">
            <span className="mb-2 block font-medium text-slate-200">Email</span>
            <span className="relative block">
              <Mail
                size={20}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                className={`input-shell pl-12 mono ${submitted && errors.email ? "border-danger/70" : ""}`}
                value={form.email}
                placeholder="dev@snit.io"
                type="email"
                onChange={(event) => updateField("email", event.target.value)}
              />
            </span>
            {submitted && errors.email && (
              <span className="mt-2 block text-sm text-danger">{errors.email}</span>
            )}
          </label>

          <label className="block">
            <span className="mb-2 flex items-center justify-between font-medium text-slate-200">
              Password
              <a href="#forgot" className="text-periwinkle">
                Forgot?
              </a>
            </span>
            <span className="relative block">
              <LockKeyhole
                size={20}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                className={`input-shell pl-12 mono ${submitted && errors.password ? "border-danger/70" : ""}`}
                value={form.password}
                placeholder="********"
                type="password"
                onChange={(event) => updateField("password", event.target.value)}
              />
            </span>
            {submitted && errors.password && (
              <span className="mt-2 block text-sm text-danger">{errors.password}</span>
            )}
          </label>

          <button className="gradient-button h-14 w-full text-base" type="submit">
            Authenticate
            <ArrowRight size={21} />
          </button>

          <div className="flex items-center gap-4 py-3 text-sm text-slate-300">
            <span className="h-px flex-1 bg-white/10" />
            <span>or continue with</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="ghost-button h-11 px-3 py-0" type="button">
              <Github size={19} />
              GitHub
            </button>
            <button className="ghost-button h-11 px-3 py-0" type="button">
              <Chrome size={19} className="text-amber" />
              Google
            </button>
          </div>
        </form>

        <p className="border-t border-white/10 px-8 py-4 text-center text-sm text-slate-300">
          By authenticating, you agree to the{" "}
          <a href="#terms" className="text-periwinkle">
            Terms of Service
          </a>
          .
        </p>
      </motion.section>
    </main>
  );
}
