/** @type {import('tailwindcss').Config} */
/*eslint-env node*/ // require EXPLODES in browser envs, modules only work in node. tell eslint it's node
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
  darkMode: "selector",
};
