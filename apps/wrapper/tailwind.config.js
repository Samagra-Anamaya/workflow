/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      regular: ['Mulish-Regular'],
      medium: ['Mulish-medium'],
      bold: ['Mulish-bold']
    },
    extend: {
      colors: {
        primary: '#F8913D',
        secondary: '#494A9E',
        tertiary: '#FFF2E3'
      },
    },
  },
  plugins: [],
}
