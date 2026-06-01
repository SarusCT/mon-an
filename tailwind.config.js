/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F2E9D8",
        paper: "#FBF5E8",
        ink: "#43382B",
        muted: "#8A7B66",
        line: "#E2D5BC",
        terracotta: "#B5654B",
        sage: "#8C9A7A",
        mustard: "#C2974A",
        dusty: "#C08A86",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "spin-pop": {
          "0%": { transform: "translateY(6px)", opacity: "0.35" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.92)", opacity: "0" },
          "60%": { transform: "scale(1.02)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fade: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "spin-pop": "spin-pop 0.14s ease-out",
        "pop-in": "pop-in 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        fade: "fade 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
