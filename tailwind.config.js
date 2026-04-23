/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eff8ff',
          100: '#dbeffe',
          200: '#bde0fd',
          300: '#83c9f9',
          400: '#4aaff4',
          500: '#2281BB', // RAL 5015 Sky Blue
          DEFAULT: '#2281BB',
          600: '#1a6fa3',
          700: '#155c8b',
          800: '#114d75',
          900: '#0f3d5e',
          950: '#082438',
        },
        secondary: {
          50:  '#f0f6fc',
          100: '#c9d1d9',
          200: '#8b949e',
          300: '#6e7681',
          400: '#484f58',
          500: '#30363d',
          600: '#21262d',
          700: '#161b22',
          800: '#0d1117',
          900: '#010409',
        },
        surface: '#161b22',
        'surface-raised': '#21262d',
        'surface-overlay': '#30363d',
        'dark-bg': '#0d1117',
        'on-bg': '#f0f6fc',
        'on-muted': '#8b949e',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft':   '0 2px 15px rgba(0, 0, 0, 0.5)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.6)',
        'glow':   '0 0 20px rgba(34, 129, 187, 0.3)',
        'glow-sm':'0 0 10px rgba(34, 129, 187, 0.2)',
      },
      keyframes: {
        slideIn: {
          '0%':   { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
      },
      animation: {
        slideIn: 'slideIn 0.3s ease-out',
        slideUp: 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
};