/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Noir theme colors
        noir: {
          50: '#f5f5f5',
          100: '#e6e6e6',
          200: '#cccccc',
          300: '#b3b3b3',
          400: '#999999',
          500: '#808080',
          600: '#666666',
          700: '#4d4d4d',
          800: '#333333',
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
        glow: {
          primary: '#6366f1',  // Indigo glow
          secondary: '#8b5cf6', // Purple glow
          accent: '#ec4899',   // Pink glow
        },
      },
      boxShadow: {
        'glow-sm': '0 0 5px var(--tw-shadow-color)',
        'glow-md': '0 0 15px var(--tw-shadow-color)',
        'glow-lg': '0 0 25px var(--tw-shadow-color)',
        'glass': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1), 0 50px 100px -20px rgba(0, 0, 0, 0.2)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
    },
  },
  plugins: [],
}