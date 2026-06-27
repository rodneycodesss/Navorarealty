/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deepblue: {
          DEFAULT: '#0B1B3D',
          light: '#172C54',
          dark: '#061026',
        },
        gold: {
          DEFAULT: '#C5A880',
          light: '#D9C1A0',
          dark: '#9E825D',
        },
        charcoal: {
          DEFAULT: '#1A1A1A',
          light: '#2A2A2A',
          dark: '#0D0D0D',
        },
        offwhite: '#F5F7FA',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
