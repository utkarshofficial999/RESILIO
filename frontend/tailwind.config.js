/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        resilio: {
          dark: '#0B0F17',
          card: '#131B2A',
          border: '#1E293B',
          accent: '#00D2FF',
          blue: '#0C2340',
          emerald: '#00E676',
          amber: '#FFB300',
          purple: '#8A2BE2'
        }
      }
    },
  },
  plugins: [],
}
