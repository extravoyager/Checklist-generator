/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2f7',
          100: '#d8e1ed',
          200: '#b0c2d9',
          300: '#84a0c1',
          400: '#5e83ab',
          500: '#3f6896',
          600: '#2f5179',
          700: '#274363',
          800: '#1f3550',
          900: '#172940'
        },
        slate2: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155'
        },
        success: { 100: '#d1fae5', 600: '#059669', 700: '#047857' },
        warning: { 100: '#fef3c7', 600: '#d97706', 700: '#b45309' },
        danger:  { 100: '#fee2e2', 600: '#dc2626', 700: '#b91c1c' },
        critical: { 100: '#fecaca', 600: '#991b1b', 700: '#7f1d1d' }
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,23,42,0.04), 0 4px 12px rgba(15,23,42,0.06)'
      }
    }
  },
  plugins: []
}
