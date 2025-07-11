/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ هذا ضروري لتفعيل dark: في Tailwind

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
