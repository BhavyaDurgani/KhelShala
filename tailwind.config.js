/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          dark: '#0B0F17',
          surface: '#0F172A',
          card: '#1E293B',
          border: '#334155'
        },
        brand: {
          primary: '#2563EB',
          secondary: '#F59E0B',
          accent: '#3B82F6',
          success: '#14B8A6',
          warning: '#D97706',
          navy: '#1E3A8A'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 4s ease-in-out infinite',
        'shine': 'shine 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(37, 99, 235, 0.2), 0 0 20px rgba(245, 158, 11, 0.1)' },
          '100%': { boxShadow: '0 0 25px rgba(37, 99, 235, 0.5), 0 0 35px rgba(245, 158, 11, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shine: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        }
      }
    },
  },
  plugins: [],
}
