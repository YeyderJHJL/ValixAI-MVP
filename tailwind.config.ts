import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // opt-in only; nothing auto-switches
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#ced9fd',
          500: '#6366f1', // Indigo moderno
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81', // Navy profundo para confianza
        },
        accent: {
          500: '#10b981', // Esmeralda para éxito/viabilidad
          600: '#059669',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))',
      }
    },
  },
  plugins: [],
};
export default config;
