/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#FAF9F6',
          dark: '#09080D',
        },
        card: {
          light: '#FFFFFF',
          dark: '#131217',
        },
        brand: {
          primary: '#C5A059',
          accent: '#D9A752',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
        }
      },
      borderRadius: {
        'premium': '16px',
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.03)',
        'premium-hover': '0 10px 30px -4px rgba(0, 0, 0, 0.07)',
        'glass-light': '0 8px 32px 0 rgba(197, 160, 89, 0.02)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
