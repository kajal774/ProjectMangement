/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // A small, deliberate palette instead of default Tailwind blue.
        // "ink" = near-black text, "canvas" = warm off-white background,
        // "brand" = the one accent color used for primary actions.
        ink: "#1C1F26",
        canvas: "#FAF9F6",
        brand: {
          DEFAULT: "#2F5D62",
          light: "#EAF1F1",
          dark: "#1F4245",
        },
        line: "#E4E1D8",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
