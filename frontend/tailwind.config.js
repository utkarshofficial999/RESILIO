/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rzp: {
          navy: '#072654',
          'navy-light': '#0B3A7A',
          blue: '#2B84EA',
          'blue-light': '#528FF0',
          'blue-pale': '#E8F1FD',
          green: '#1CA672',
          'green-light': '#E6F7F0',
          red: '#CB3837',
          'red-light': '#FDEAEA',
          amber: '#E5A100',
          'amber-light': '#FFF8E6',
          purple: '#6C5CE7',
          'purple-light': '#F0EEFF',
          bg: '#F5F7FA',
          surface: '#FFFFFF',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Mulish', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Mulish', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
