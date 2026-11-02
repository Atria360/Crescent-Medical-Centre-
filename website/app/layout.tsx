import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Fonts are self-hosted (files in ./fonts) rather than pulled from Google at
// build time. `next/font/google` fetches fonts.googleapis.com during the build,
// and a throttled or failed request there fails the whole deployment with
// "An error occurred in next/font". Serving the files from the repo removes
// that build-time network dependency, and removes the runtime request to
// Google for visitors too.
//
// Montserrat and EB Garamond are variable fonts, so one file covers every
// weight in the declared range. Poppins has no variable release, so its four
// weights are separate files.

const montserrat = localFont({
  src: [{ path: "./fonts/Montserrat-100-900-normal.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-montserrat",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});

const poppins = localFont({
  src: [
    { path: "./fonts/Poppins-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Poppins-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Poppins-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Poppins-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});

// Serif display face — a free stand-in for the brand's ITC Garamond Light.
const garamond = localFont({
  src: [
    { path: "./fonts/EBGaramond-400-800-normal.woff2", weight: "400 800", style: "normal" },
    { path: "./fonts/EBGaramond-400-800-italic.woff2", weight: "400 800", style: "italic" },
  ],
  variable: "--font-garamond",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const metadata: Metadata = {
  title: "Crescent Medical Centre",
  description:
    "Family practice and walk-in medical clinic in SW Calgary — your well-being is our priority.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${poppins.variable} ${garamond.variable} font-sans tracking-brand text-brand-dark antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
