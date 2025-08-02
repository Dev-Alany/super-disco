/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2d3748', // Dark gray for text
        secondary: '#38a169', // Green for finance theme
        accent: '#dae6f3ff', // Light gray for backgrounds
      },
    },
  },
  plugins: [],
}