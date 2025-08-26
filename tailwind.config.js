/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        englishHandwritten: ['Fredoka', 'sans-serif'], //
        hebrewRubik: ['Rubik', 'sans-serif'],
      },
    },
  },
  plugins: [],
}