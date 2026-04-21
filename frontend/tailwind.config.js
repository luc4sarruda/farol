/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'azul-noturno': '#0B1120', // Azul profundo do oceano
        'dourado-farol': '#FACC15', // Amarelo vibrante do feixe de luz
        'cinza-suave': '#94A3B8',
      },
      boxShadow: {
        'glow': '0 0 15px -3px rgba(250, 204, 21, 0.4)', // Brilho dourado sutil
      }
    },
  },
  plugins: [],
}