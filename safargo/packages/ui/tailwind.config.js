/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Couleurs du drapeau algérien
        'algeria-green': '#006233',
        'algeria-red': '#D21034',
        // Palette principale
        primary: {
          50: '#e6f3ec',
          100: '#b3dac5',
          200: '#80c19e',
          300: '#4da877',
          400: '#268f56',
          500: '#006233', // Vert principal
          600: '#005429',
          700: '#00451f',
          800: '#003716',
          900: '#00290c',
        },
        secondary: {
          50: '#fce8eb',
          100: '#f6bac3',
          200: '#f08c9b',
          300: '#ea5e73',
          400: '#e4304b',
          500: '#D21034', // Rouge principal
          600: '#b10d2a',
          700: '#900a21',
          800: '#6f0718',
          900: '#4e040f',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'IBM Plex Arabic', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require('tailwindcss-rtl')],
}