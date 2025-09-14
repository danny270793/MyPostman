/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Postman signature colors
        'postman-orange': '#ff6c37',
        'postman-orange-hover': '#e55a2b',
        'postman-orange-light': '#ff8c5a',
        'postman-orange-dark': '#d6441a',
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
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-subtle': 'bounceSubtle 0.6s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          'from': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        slideIn: {
          'from': {
            opacity: '0',
            transform: 'translateX(-20px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        bounceSubtle: {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-5px)'
          }
        },
        glow: {
          'from': {
            boxShadow: '0 0 5px rgba(255, 108, 55, 0.2), 0 0 10px rgba(255, 108, 55, 0.2)'
          },
          'to': {
            boxShadow: '0 0 10px rgba(255, 108, 55, 0.4), 0 0 20px rgba(255, 108, 55, 0.4)'
          }
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          }
        }
      }
    },
  },
  plugins: [],
}
