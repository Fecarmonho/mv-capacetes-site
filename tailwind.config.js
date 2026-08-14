/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta tirada da logo oficial (emblema escuro, azul elétrico,
        // detalhes cromados/prata). Ver public/brand/logo-round.png.
        night: "#05070D",
        ink: "#0F1420",
        paper: "#F5F7FA",
        steel: "#B7C1D1",
        chrome: "#E8EDF5",
        blue: "#2B5CE0",
        "blue-light": "#5B8FFF",
        "blue-deep": "#12266E",
        spark: "#4FD6FF",
      },
      fontFamily: {
        // Carregadas via next/font em app/layout.tsx (self-hosted, sem
        // depender de link externo pro Google Fonts).
        display: ["var(--font-display)", "sans-serif"],
        impact: ["var(--font-impact)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(43, 92, 224, 0.45)",
        card: "0 4px 24px rgba(5, 7, 13, 0.10)",
        "card-hover": "0 12px 40px rgba(43, 92, 224, 0.22)",
      },
      animation: {
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.2, 0.6, 0.4, 1) infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "fade-slide": "fade-slide 0.5s ease-out",
        "shrink-x": "shrink-x linear forwards",
        blink: "blink 2s ease-in-out infinite",
        marquee: "marquee 22s linear infinite",
        "badge-3d": "badge-3d 6s ease-in-out infinite",
        "shine-sweep": "shine-sweep 4s ease-in-out infinite",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.6)", opacity: "0.8" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "fade-slide": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "shrink-x": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "badge-3d": {
          "0%, 100%": { transform: "translateY(0) rotateY(-14deg) rotateX(5deg)" },
          "50%": { transform: "translateY(-10px) rotateY(14deg) rotateX(-5deg)" },
        },
        "shine-sweep": {
          "0%, 55%": { transform: "translateX(-120%) skewX(-12deg)" },
          "80%, 100%": { transform: "translateX(220%) skewX(-12deg)" },
        },
      },
    },
  },
  plugins: [],
};
