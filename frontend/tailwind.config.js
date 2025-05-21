/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        myGreen: "#39DB4A",
        myRed: "#FF6868",
        secondary: "#555",
        primaryBG: "#FCFCFC",
      },
    },
  },
  plugins: [require("daisyui")],
};
