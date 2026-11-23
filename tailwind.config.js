/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#0A0910',
        surface: '#12101A',
        panel: '#17141F',
        panel2: '#1F1B29',
        line: 'rgba(255,255,255,0.08)',
        gold: {
          300: '#F8D47E',
          400: '#F2C14E',
          500: '#E5A93C',
          600: '#C8871E',
        },
      },
      boxShadow: {
        glow: '0 0 50px rgba(242,193,78,0.18)',
        card: '0 20px 50px rgba(0,0,0,0.45)',
      },
    },
  },
  plugins: [],
}
