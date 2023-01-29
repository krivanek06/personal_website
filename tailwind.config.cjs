const plugin = require('tailwindcss/plugin')

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
        moveInRight: 'moveInRight 5s ease-in ',
        moveInLeft: 'moveInLeft 5s ease-in ',
        moveInTop: 'moveInTop 4.5s ease-in ',
        reveal: 'reveal 1.5s ease-in-out ',
        reveal2: 'reveal2 2.5s ease-in-out',
        reveal3: 'reveal3 5s ease-in',
        moveFromTopToBottom: 'moveFromTopToBottom 3.5s',
      },
      keyframes: {
        moveFromTopToBottom: {
          '0%': {
            opacity: 0.2,
            filter: 'blur(5px)',
            transform: 'translateY(-200px) scale(1.8)',
          },
          '100%': {
            opacity: 1,
            filter: 'blur(0)',
            transform: 'translateY(0) scale(1)',
          },
        },
        moveInTop: {
          '0%': {
            opacity: 0,
            filter: 'blur(5px)',
            transform: 'translateY(-100%)',
          },
          '100%': {
            opacity: 1,
            filter: 'blur(0)',
            transform: 'translateY(0)',
          },
        },
        moveInRight: {
          '0%': {
            opacity: 0,
            filter: 'blur(5px)',
            transform: 'translateX(-100%)',
          },
          '20%': {
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
          '20%': {
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
        reveal2: {
          '0%': {
            opacity: 0,
            filter: 'blur(5px)',
          },
          '40%': {
            opacity: 0,
            filter: 'blur(5px)',
          },
          '100%': {
            opacity: 1,
            filter: 'blur(0)',
          },
        },
        reveal3: {
          '0%': {
            opacity: 0,
            filter: 'blur(5px)',
          },
          '20%': {
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
        'g-primary-transparent-dark': 'var(--primary-transparent-dark)',
        'g-secondary': 'var(--secondary)',
        'g-gray': 'var(--gray)',
        'g-gray-medium': 'var(--gray-medium)',
        'g-gray-dark': 'var(--gray-dark)',
        'g-overlay-dark': 'var(--overlay-dark)',
        'g-overlay-medium': 'var(--overlay-medium)',
        'g-border': 'var(--border)',
      },
    },
  },
  plugins: [
    // custom animation delay
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'animation-delay': (value) => {
            return {
              'animation-delay': value,
            }
          },
        },
        {
          values: theme('transitionDelay'),
        },
      )
    }),
  ],
  variants: {
    height: ['responsive', 'hover', 'focus'],
    animation: ['motion-safe'],
  },
}
