/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './stories/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors (Drapeau Algérien)
        'brand-green': {
          50: '#f0f9f4',
          100: '#dcf2e3',
          200: '#bce5cc',
          300: '#8dd1a7',
          400: '#57b37c',
          500: '#006233', // Primary green
          600: '#005129',
          700: '#004023',
          800: '#00331c',
          900: '#002817',
        },
        'brand-red': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#D21034', // Primary red
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#651818',
        },
        'brand-white': '#FFFFFF',
        
        // Tourism colors
        tourism: {
          beach: '#06B6D4',
          waterfall: '#0EA5E9',
          mountain: '#8B5CF6',
          desert: '#F59E0B',
          heritage: '#DC2626',
          museum: '#7C3AED',
          food: '#F97316',
          viewpoint: '#10B981',
          park: '#22C55E',
          oasis: '#84CC16',
          medina: '#EAB308',
          lake: '#3B82F6',
          cave: '#6B7280',
        },
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 16px 64px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
        'brand': '0 4px 14px 0 rgba(0, 98, 51, 0.25)',
        'brand-lg': '0 8px 28px 0 rgba(0, 98, 51, 0.3)',
      },
      
      backgroundImage: {
        'safargo-gradient': 'linear-gradient(135deg, #006233 0%, #D21034 100%)',
        'safargo-gradient-soft': 'linear-gradient(135deg, rgba(0, 98, 51, 0.1) 0%, rgba(210, 16, 52, 0.1) 100%)',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSoft: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0,-8px,0)' },
          '70%': { transform: 'translate3d(0,-4px,0)' },
          '90%': { transform: 'translate3d(0,-2px,0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};