/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#E0F7FA',
        accent: '#B388FF',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
