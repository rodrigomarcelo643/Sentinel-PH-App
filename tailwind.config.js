/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        light: ['Inter-Light'],
        medium: ['Inter-Medium'],
        semibold: ['Inter-SemiBold'],
      },
    },
  },
  plugins: [],
};
