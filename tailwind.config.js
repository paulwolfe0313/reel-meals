/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        oldschool: ['"Special Elite"', 'monospace'],
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-out forwards",
        projector: "projector 2s ease-in-out infinite alternate",
        slideInUp: "slideInUp 0.4s ease-out forwards",
        slideOutDown: "slideOutDown 0.3s ease-in forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        projector: {
          "0%": { opacity: 0.3, transform: "scale(1)" },
          "100%": { opacity: 0.6, transform: "scale(1.05)" },
        },
        slideInUp: {
          "0%": { transform: "translateY(100%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        slideOutDown: {
          "0%": { transform: "translateY(0)", opacity: 1 },
          "100%": { transform: "translateY(100%)", opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
