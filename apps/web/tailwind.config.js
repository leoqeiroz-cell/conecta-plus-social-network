/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,ts}"],
  theme: {
    extend: {
      colors: {
        ink: "#132238",
        brand: "#0F766E",
        coral: "#F97316",
        grape: "#7C3AED"
      },
      boxShadow: {
        soft: "0 14px 40px rgba(15, 23, 42, 0.10)"
      }
    }
  },
  plugins: []
};
