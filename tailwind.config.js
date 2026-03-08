/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.html",
    "./**/*.{tsx,ts,jsx,js}",
  ],
  theme: {
    extend: {
      colors: {
        p3blue: '#1269CC',
        p3dark: '#0D1B2A',
        p3cyan: '#0FB1F5',
        p3mid: '#6D9AC7',
        p3white: '#F0F0F0',
        p3red: '#F40220',
        p3black: '#070100',
      },
      fontFamily: {
        display: ['Anton', 'Noto Sans SC', 'sans-serif'],
        body: ['Roboto Condensed', 'Noto Sans SC', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
        'marquee': 'marquee 40s linear infinite',
        'marquee-reverse': 'marqueeReverse 40s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
