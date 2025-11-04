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
          50: "#f2f8ff",
          100: "#e5f0ff",
          200: "#c2dbff",
          300: "#99c1ff",
          400: "#6ea3ff",
          500: "#3e79f7",
          600: "#2f5dd4",
          700: "#2549a8",
          800: "#1e3c85",
          900: "#1b336c"
        }
      }
    }
  },
  plugins: []
};

export default config;
