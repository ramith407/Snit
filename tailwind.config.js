/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#090c13",
        ink: "#0d111a",
        panel: "#151922",
        panelSoft: "#1a1f2b",
        panelMuted: "#222733",
        borderSoft: "#2b3240",
        text: "#f2f5ff",
        muted: "#99a2b5",
        dim: "#5f687a",
        blue: "#5a92ff",
        periwinkle: "#aac0ff",
        violet: "#7a22d8",
        lavender: "#d9adff",
        amber: "#ffad72",
        green: "#6ee7b7",
        danger: "#ff6b6b"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Consolas", "monospace"],
      },
      boxShadow: {
        glow: "0 18px 60px rgba(90, 146, 255, 0.18)",
        panel: "0 24px 80px rgba(0, 0, 0, 0.32)",
        button: "0 14px 34px rgba(90, 146, 255, 0.25)",
      },
      backgroundImage: {
        "app-noise":
          "linear-gradient(180deg, rgba(22,27,38,0.72), rgba(9,12,19,0.96))",
        "brand-gradient": "linear-gradient(135deg, #5a92ff 0%, #7a22d8 54%, #d9adff 100%)",
        "soft-gradient": "linear-gradient(135deg, rgba(90,146,255,0.18), rgba(217,173,255,0.12))",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
      },
      animation: {
        shimmer: "shimmer 1.8s infinite linear",
      },
    },
  },
  plugins: [],
};
