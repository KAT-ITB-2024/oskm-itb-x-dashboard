import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        rem: "var(--font-rem)",
        mogula: "var(--font-mogula)",
      },
    },
  },
  plugins: [],
} satisfies Config;
