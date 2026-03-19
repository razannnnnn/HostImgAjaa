/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  darkMode: "media",
  theme: {
    fontFamily: {
      sans: ["Geist", "Inter", ...defaultTheme.fontFamily.sans],
      mono: ["GeistMono", "fira-code", ...defaultTheme.fontFamily.mono],
    },
    extend: {
      transitionDuration: {
        400: "400ms",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      colors: ({ colors }) => ({
        primary: colors.blue,
        danger: colors.rose,
        warning: colors.yellow,
        success: colors.lime,
        info: colors.blue,
        gray: colors.zinc,
      }),
    },
  },
  plugins: [],
  safelist: [
    "translate-y-16",
    "translate-y-0",
    "scale-95",
    "scale-100",
    "opacity-0",
    "opacity-100",
    "backdrop-blur-md",
    "backdrop-blur-none",
    "bg-gray-950/60",
    "bg-transparent",
  ],
};
