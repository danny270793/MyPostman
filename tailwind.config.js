/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Postman signature colors
        'postman-orange': '#ff6c37',
        'postman-orange-hover': '#e55a2b',
        'postman-dark': '#2c2c2c',
        'postman-darker': '#1e1e1e',
        'postman-gray': '#f8f8f8',
        'postman-border': '#e1e1e1',
        'postman-border-dark': '#404040',
      },
      fontFamily: {
        'system': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'mono': ['Monaco', 'Menlo', 'Ubuntu Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
      },
      height: {
        'header': '48px',
      },
      width: {
        'sidebar': '280px',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Enable class-based dark mode
}
