import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        code: ["Sf mono", "monospace"],
      }
    },
  },
  plugins: [],
} satisfies Config;
