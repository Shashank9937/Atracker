/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        dusk: '#07111f',
        brand: {
          50: '#eef9ff',
          100: '#d9f1ff',
          200: '#bce6ff',
          300: '#8fd6ff',
          400: '#58c0ff',
          500: '#249fe8',
          600: '#177ebd',
          700: '#15659a',
          800: '#15557f',
          900: '#164768',
        },
        mint: '#5de0c0',
        sunrise: '#f4a640',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 45px -25px rgba(15, 23, 42, 0.3)',
        glow: '0 0 0 1px rgba(36, 159, 232, 0.16), 0 25px 80px -35px rgba(36, 159, 232, 0.5)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
