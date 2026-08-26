/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#07090E',
          900: '#0C0F17',
          850: '#111622',
          800: '#171E2E',
          750: '#1E273B',
          700: '#28334D',
          600: '#3B4A6B',
          500: '#586A91',
          400: '#8596B8',
          300: '#B2C1DE',
          200: '#D5DFEF',
          100: '#EDF3FC',
        },
        accent: {
          cyan: '#00F0FF',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          gold: '#F59E0B',
          amber: '#FBBF24',
          emerald: '#10B981',
          rose: '#F43F5E',
        },
        status: {
          safe: '#10B981',
          safeBg: 'rgba(16, 185, 129, 0.12)',
          safeBorder: 'rgba(16, 185, 129, 0.35)',
          warn: '#F59E0B',
          warnBg: 'rgba(245, 158, 11, 0.12)',
          warnBorder: 'rgba(245, 158, 11, 0.35)',
          crit: '#EF4444',
          critBg: 'rgba(239, 68, 68, 0.15)',
          critBorder: 'rgba(239, 68, 68, 0.4)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.25)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.25)',
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.25)',
        'glow-card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'card-dark': '0 4px 20px 0 rgba(0, 0, 0, 0.35)',
      }
    },
  },
  plugins: [],
}
