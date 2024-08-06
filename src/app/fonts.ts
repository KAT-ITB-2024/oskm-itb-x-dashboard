import { REM } from "next/font/google";
import localFont from "next/font/local";

export const mogula = localFont({
  src: "../assets/fonts/mogula.otf",
  variable: "--font-mogula",
  display: "swap",
});

export const rem = REM({
  subsets: ["latin"],
  variable: "--font-rem",
  display: "swap",
});
