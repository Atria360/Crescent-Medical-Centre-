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
        teal: {
          DEFAULT: "#3BC4BD",
          dark: "#2FA8A2",
          light: "#5EEAD4",
        },
        brand: {
          red: "#E22004",
          reddark: "#C51C03",
          dark: "#252525",
          body: "#7A7A7A",
          gray: "#7F8995",
          light: "#F7F7F7",
        },
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
        button: ["var(--font-poppins)", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #3BC4BD 30%, #E22004 100%)",
        "brand-gradient-soft": "linear-gradient(145deg, #3BC4BDD4 29%, #E2200485 99%)",
      },
      letterSpacing: {
        brand: "1px",
      },
    },
  },
  plugins: [],
};

export default config;
