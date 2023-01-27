/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    fontFamily: {
      sans: ['sans-serif', 'Poppins'],
      serif: ['sans-serif', 'Poppins'],
    },
    extend: {
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
  },
}
