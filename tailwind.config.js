/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'white': '#ffffff',
        'black': '#000000',
        'sky': "#54c0ff",
        'darksky': "#3394cc",
        'blue1': "#4678f4",
        'blue2': "#5e8bff",
        'blue3': "#4c8cf4",
        'silver': '#a6a6a6',
        'darksilver': '#808080',
        'bermuda': '#0DD9B5',
        'darkbermuda': '#0BB99A',
        'scarlet': '#fc3535',
        'darkscarlet': '#db2e2e',
        'malibu': '#62cdfd',
        'darkmalibu': '#4c9dc2'
      },
      fontFamily: {
        'sans':['poppins','serif']
      },
    }
  },
  plugins: []
}
