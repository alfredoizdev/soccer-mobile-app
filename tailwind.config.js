/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto-Regular', 'sans-serif'],
        'roboto-light': ['Roboto-Light', 'sans-serif'],
        'roboto-medium': ['Roboto-Medium', 'sans-serif'],
        'roboto-bold': ['Roboto-Bold', 'sans-serif'],
        'roboto-black': ['Roboto-Black', 'sans-serif'],
        'roboto-condensed': ['Roboto_Condensed-Regular', 'sans-serif'],
        'roboto-condensed-bold': ['Roboto_Condensed-Bold', 'sans-serif'],
        'roboto-semicondensed': ['Roboto_SemiCondensed-Regular', 'sans-serif'],
        'roboto-semicondensed-bold': [
          'Roboto_SemiCondensed-Bold',
          'sans-serif',
        ],
      },
      red: {
        100: '#FF0000',
      },
      green: {
        100: '#00FF00',
      },
    },
  },
  plugins: [],
}
