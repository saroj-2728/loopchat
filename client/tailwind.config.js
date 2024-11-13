/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom': `3px 3px 40px rgba(0, 0, 0, 0.9)`,
        'small': `3px 3px 20px rgba(0, 0, 0, 0.9)`,
      },
      animation: {
        'spin-slow': 'spin 1.5s linear infinite',
      },
      backgroundColor: {
        'accent': "rgba(38, 38, 38, 1)",
        "button-primary": 'rgba(0, 149, 246, 1)',
        "button-secondary": 'rgba(54, 54, 54, 0.7)',
        "inputField": 'rgba(18, 18, 18, 1)',
      },
    },
  },
  plugins: [],
};
