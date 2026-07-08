/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        drg: {
          amber: '#F5A623',
          bg: '#0d0d0d',
        },
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
