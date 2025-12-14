/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index-v2.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src-v2/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
