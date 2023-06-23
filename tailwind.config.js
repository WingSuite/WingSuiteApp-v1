/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      black: "#000000",
      sky: "#54c0ff",
      darkSky: "#3394cc",
      deepOcean: "#4678f4",
      darkOcean: "#0a50fa",
      silver: "#dbdbdb",
      darkSilver: "#a6a6a6",
      bermuda: "#0DD9B5",
      darkbermuda: "#0BB99A",
      scarlet: "#fc3535",
      darkScarlet: "#db2e2e",
      malibu: "#62cdfd",
      darkMalibu: "#4c9dc2",
    },
    fontFamily: {
      sans: ["poppins", "serif"],
      couture: ["couture", "sans-serif"],
    },
  },
  plugins: [],
};
