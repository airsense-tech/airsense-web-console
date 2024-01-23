/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#EDE7F6',
        accent: '#B388FF',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
