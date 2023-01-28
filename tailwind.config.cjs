/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    fontFamily: {
      sans: ['sans-serif', 'Poppins'],
      serif: ['sans-serif', 'Poppins'],
    },
    extend: {
      animation: {
        fadeIn1: 'fadeIn 1s ease-in forwards',
        fadeIn2: 'fadeIn 2s ease-in forwards',
        fadeIn4: 'fadeIn 4s ease-in forwards',
        moveInRight: 'moveInRight 1.5s ease-in ',
        moveInLeft: 'moveInLeft 1.5s ease-in ',
        reveal: 'reveal 1.5s ease-in-out ',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        moveInRight: {
          '0%': {
            opacity: 0,
            filter: 'blur(5px)',
            transform: 'translateX(-100%)',
          },
          '100%': {
            opacity: 1,
            filter: 'blur(0)',
            transform: 'translateX(0)',
          },
        },
        moveInLeft: {
          '0%': {
            opacity: 0,
            filter: 'blur(5px)',
            transform: 'translateX(100%)',
          },
          '100%': {
            opacity: 1,
            filter: 'blur(0)',
            transform: 'translateX(0)',
          },
        },
        reveal: {
          '0%': {
            opacity: 0,
            filter: 'blur(5px)',
          },
          '100%': {
            opacity: 1,
            filter: 'blur(0)',
          },
        },
      },
      transitionProperty: {
        height: 'height',
      },
      blur: {
        xs: '2px',
      },
      screens: {
        '3xl': '1870px',
      },
      colors: {
        'g-primary': 'var(--primary)',
        'g-primary-transparent-low': 'var(--primary-transparent-low)',
        'g-primary-transparent-medium': 'var(--primary-transparent-medium)',
        'g-secondary': 'var(--secondary)',
        'g-gray': 'var(--gray)',
        'g-overlay-dark': 'var(--overlay-dark)',
        'g-overlay-medium': 'var(--overlay-medium)',
        'g-border': 'var(--border)',
      },
    },
  },
  plugins: [],
  variants: {
    height: ['responsive', 'hover', 'focus'],
    animation: ['motion-safe'],
  },
}
