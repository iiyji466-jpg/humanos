import type { Config } from "tailwindcss"
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        arabic: ["IBM Plex Sans Arabic", "sans-serif"],
        display: ["Syne", "sans-serif"],
      },
      colors: {
        bg: "#050810",
        surf: "#090d18",
        card: "#0f1623",
        card2: "#141d2e",
        primary: "#6366f1",
        green: "#10b981",
        amber: "#f59e0b",
        red: "#ef4444",
        pink: "#ec4899",
        cyan: "#06b6d4",
        violet: "#8b5cf6",
      },
      animation: {
        "float": "float 4s ease-in-out infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "gradient": "gradient 4s ease infinite",
        "orb": "orbPulse 3s ease-in-out infinite",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        gradient: { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        orbPulse: { "0%,100%": { transform: "scale(1)", opacity: "0.7" }, "50%": { transform: "scale(1.12)", opacity: "1" } },
      },
    },
  },
  plugins: [],
}
export default config
