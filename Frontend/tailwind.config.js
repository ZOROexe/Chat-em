import daisyui from "daisyui";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    noti: "#991C97",
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark"],
  },
};
