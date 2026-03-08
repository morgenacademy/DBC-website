import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          coral: "var(--color-coral)",
          peach: "var(--color-peach)",
          sand: "var(--color-sand)",
          aqua: "var(--color-aqua)",
          teal: "var(--color-teal)"
        }
      },
      borderRadius: {
        editorial: "var(--radius-editorial)"
      },
      boxShadow: {
        card: "0 10px 30px -18px rgb(0 0 0 / 0.32)"
      }
    }
  },
  plugins: []
};

export default config;
