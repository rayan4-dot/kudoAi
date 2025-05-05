/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#6100FF', // Bold purple
        'secondary': '#FF009C', // Vibrant pink
        'tertiary': '#00FFCA', // Neon teal
        'background': '#111827', // Dark blue-gray
        'surface': '#1F2937', // Lighter blue-gray
        'elevated': '#374151', // Even lighter blue-gray
        'error': '#FF4F4F', // Vibrant red
        'success': '#00FF85', // Vibrant green
        'on-primary': '#ffffff',
        'on-secondary': '#ffffff',
        'on-tertiary': '#000000',
        'on-background': '#F3F4F6',
        'on-surface': '#F9FAFB',
        'on-error': '#000000',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(97, 0, 255, 0.5)',
        'neon': '0 0 10px rgba(0, 255, 202, 0.7)',
        'pink': '0 0 10px rgba(255, 0, 156, 0.7)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}