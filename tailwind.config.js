/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./index.js",
    "./loading.js",
    "./js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        pink:   { DEFAULT: '#E3184D', dark: '#c21542' },
        nav:    { bg: '#ffffff', dark: '#1A1A1A' },
        union:  { DEFAULT: '#ffffff', dark: '#2A2A2A' },
        border: { DEFAULT: '#BCBDBF' },
        dark:   { DEFAULT: '#1A1A1A', deep: '#0A0A0A' },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        glitch:   ['SdGlitchRobot', 'monospace'],
      },
      screens: {
        'xs':  '400px',
        'sm':  '480px',
        'md':  '550px',
        'lg':  '950px',
        'xl':  '1000px',
        '2xl': '1050px',
        '3xl': '1100px',
        '4xl': '1200px',
        '5xl': '1250px',
      },
    }
  },
  plugins: [],
}
