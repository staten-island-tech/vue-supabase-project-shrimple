/** @type {import('tailwindcss').Config} */
/*eslint-env node*/ // require EXPLODES in browser envs, modules only work in node. tell eslint it's node
const plugin = require("tailwindcss/plugin");
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {},
  plugins: [
    require("@tailwindcss/typography"),
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".dark-shadow-sm": {
          filter: "drop-shadow(0 1px 2px rgb(255 255 255 / 0.85))",
        },
        ".dark-shadow-md": {
          filter: "drop-shadow(0 4px 3px rgb(255 255 255 / 0.85))  drop-shadow(0 2px 2px rgb(255 255 255 / 0.85))",
        },
      };
      addUtilities(newUtilities, {
        variants: ["dark"],
      });
    }),
  ],
  darkMode: "selector",
};
