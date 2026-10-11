/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F5F6F4',
        surface: '#FFFFFF',
        ink: '#1E2227',
        muted: '#5F6B73',
        line: '#E1E5E4',
        accent: { DEFAULT: '#2F6F73', dark: '#245A5E', soft: '#E3EEEE' },
        danger: '#A3402F',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'Cambria', 'serif'],
      },
      borderRadius: { DEFAULT: '6px', lg: '8px' },
      boxShadow: { card: '0 1px 2px rgba(30, 34, 39, 0.05)' },
    },
  },
  plugins: [],
};
