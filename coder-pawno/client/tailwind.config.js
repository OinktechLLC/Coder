/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        premium: {
          50: '#f8f9ff',
          100: '#f0f2ff',
          200: '#e0e4ff',
          300: '#c7cdff',
          400: '#a6afff',
          500: '#808cff',
          600: '#6b6bff',
          700: '#5a5aff',
          800: '#4d4dff',
          900: '#4545ff',
          950: '#0a0a33',
        },
        dark: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d8ff',
          300: '#a6c0ff',
          400: '#80a0ff',
          500: '#5a7fff',
          600: '#4565ff',
          700: '#334fff',
          800: '#2a40ff',
          900: '#2538ff',
          950: '#0a0f33',
        }
      },
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(128, 140, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(128, 140, 255, 0.6)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
