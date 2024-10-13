/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        'custom': `3px 3px 40px rgba(0, 0, 0, 0.9)`,
        'small': `3px 3px 20px rgba(0, 0, 0, 0.9)`,
      },
    },
  },
  plugins: [],
};
