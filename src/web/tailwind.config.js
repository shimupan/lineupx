const defaultTheme = require('tailwindcss/defaultTheme');
const scrollbar = require('tailwind-scrollbar');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      scale: {
        '25': '.25',
      },
      scrollbar: {
        width: '8px', 
        track: 'rgba(0, 0, 0, 0.1)', 
        thumb: 'rgba(0, 0, 0, 0.4)', 
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
      },
    ],
  },
  variants: {
    extend: {
      scrollbar: ['rounded']
    }
  },
  plugins: [
    scrollbar
  ],
};
