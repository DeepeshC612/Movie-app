/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['var(--font-montserrat)', 'sans-serif'],
      },
      colors: {
        primary: '#2BD17E',
        error: '#EB5757',
        background: '#093545',
        input: '#224957',
        card: '#092C39',
      },
    },
  },
  plugins: [],
}
