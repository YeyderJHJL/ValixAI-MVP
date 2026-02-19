import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#E6F7F7',
          100: '#B3E8E8',
          200: '#80D9D9',
          300: '#4DCACA',
          400: '#1C9B9B', // Turquesa del logo
          500: '#178585',
          600: '#136F6F',
          700: '#0F5959',
          800: '#0A4343',
          900: '#062D2D',
        },
        accent: {
          50: '#E6EBF2',
          100: '#B3C7DB',
          200: '#80A3C4',
          300: '#4D7FAD',
          400: '#1A5B96',
          500: '#0F2C4C', // Azul oscuro del logo
          600: '#0C233D',
          700: '#091A2E',
          800: '#06111F',
          900: '#030810',
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
