/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        Licorice: ['Licorice', 'sans-serif'],
      },
      colors: {
        gold: { DEFAULT: '#C9A227', light: '#E8C547', dark: '#A07D1C' },
        navy: { DEFAULT: '#1E3A5F', dark: '#0D1B2A', medium: '#1B2A4A', light: '#2E5182' },
        'cricket-bg': '#0D1B2A',
        'cricket-card': '#1B2A4A',
        'cricket-text': '#F5F7FA',
        'cricket-muted': '#A0B0C8',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #C9A227 0%, #E8C547 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0D1B2A 0%, #1B2A4A 100%)',
      },
      boxShadow: {
        'gold': '0 4px 20px rgba(201, 162, 39, 0.3)',
        'dark-lg': '0 8px 40px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.6s ease forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
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
