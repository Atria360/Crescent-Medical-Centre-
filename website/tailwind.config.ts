import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // `teal` = per-location primary; `brand.red` = per-location accent.
        // Names are kept for backwards-compat; values resolve to runtime CSS
        // variables so each location themes itself (see lib/locations themeVars).
        teal: {
          DEFAULT: "rgb(var(--brand-primary) / <alpha-value>)",
          dark: "rgb(var(--brand-primary-dark) / <alpha-value>)",
          light: "rgb(var(--brand-primary-light) / <alpha-value>)",
        },
        brand: {
          red: "rgb(var(--brand-accent) / <alpha-value>)",
          reddark: "rgb(var(--brand-accent-dark) / <alpha-value>)",
          gold: "rgb(var(--brand-gold) / <alpha-value>)",
          dark: "#252525",
          body: "#7A7A7A",
          gray: "#7F8995",
          light: "#F7F7F7",
        },
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
        button: ["var(--font-poppins)", "sans-serif"],
        serif: ["var(--font-garamond)", "Georgia", "serif"],
      },
      borderRadius: {
        card: "20px",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, rgb(var(--brand-primary)) 30%, rgb(var(--brand-accent)) 100%)",
        "brand-gradient-soft":
          "linear-gradient(145deg, rgb(var(--brand-primary) / 0.83) 29%, rgb(var(--brand-accent) / 0.52) 99%)",
      },
      letterSpacing: {
        brand: "1px",
      },
    },
  },
  plugins: [],
};

export default config;
