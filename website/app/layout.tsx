import type { Metadata } from "next";
import { Montserrat, Poppins, EB_Garamond } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

// Serif display face — a free stand-in for the brand's ITC Garamond Light.
const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
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
