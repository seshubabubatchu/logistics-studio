import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#07090C",
        foreground: "#F2EFE8",
        cyan: {
          DEFAULT: "#22D3EE",
        },
        amber: {
          DEFAULT: "#F5A524",
        },
        red: {
          DEFAULT: "#EF4444",
        },
        green: {
          DEFAULT: "#22C55E",
        },
        purple: {
          DEFAULT: "#A855F7",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter-tight)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
