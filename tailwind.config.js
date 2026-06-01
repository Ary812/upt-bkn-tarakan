/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e3a8a", // BKN Blue
        "primary-pressed": "#172554",
        accent: "#dc2626", // BKN Red
        "accent-pressed": "#991b1b",
        canvas: "#ffffff",
        "surface-soft": "#fbfbf9",
        "surface-card": "#f6f6f3",
        ink: "#000000",
        "ink-soft": "#211922",
        mute: "#62625b",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      borderRadius: {
        "2rem": "2rem",
        "3rem": "3rem",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
