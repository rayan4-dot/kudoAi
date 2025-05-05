/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1e1e2e',
        'secondary': '#2e2e3e',
        'accent': '#4e4e5e',
        'background': '#121212',
        'surface': '#1e1e2e',
        'error': '#cf6679',
        'on-primary': '#ffffff',
        'on-secondary': '#ffffff',
        'on-accent': '#000000',
        'on-background': '#e0e0e0',
        'on-surface': '#e0e0e0',
        'on-error': '#000000',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        '3xl': '0 10px 30px -5px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ...any other existing plugins...
  ],
}