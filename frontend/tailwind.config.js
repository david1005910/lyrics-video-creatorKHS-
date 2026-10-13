/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7EC8FF',
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7EC8FF',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
        },
        secondary: {
          DEFAULT: '#B8A4F0',
          light: '#D4C4FF',
        },
        accent: {
          DEFAULT: '#8CE8D0',
          light: '#B8F0E0',
        },
        pink: {
          soft: '#FFB8D4',
          light: '#FFD4E5',
        },
        peach: {
          DEFAULT: '#FFE4D4',
          light: '#FFC6A0',
        },
        surface: {
          DEFAULT: 'rgba(255, 255, 255, 0.85)',
          light: 'rgba(255, 255, 255, 0.95)',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'Noto Sans JP', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      borderRadius: {
        'soft': '16px',
        'softer': '20px',
        'softest': '24px',
      },
      boxShadow: {
        'soft': '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 16px 48px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06)',
        'glow-primary': '0 0 8px #7EC8FF, 0 0 16px rgba(126, 200, 255, 0.3)',
        'glow-secondary': '0 0 8px #B8A4F0, 0 0 16px rgba(184, 164, 240, 0.3)',
        'glow-accent': '0 0 8px #8CE8D0, 0 0 16px rgba(140, 232, 208, 0.3)',
        'button': '0 4px 16px rgba(126, 200, 255, 0.35)',
      },
      backgroundImage: {
        'gradient-soft': 'linear-gradient(135deg, #FFD4E5 0%, #D4E4FF 30%, #FFE4D4 60%, #E4D4FF 100%)',
        'gradient-button': 'linear-gradient(135deg, #7EC8FF 0%, #B8A4F0 50%, #8CE8D0 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
