/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    fontFamily: {
      sans: ['sans-serif', 'Poppins'],
      serif: ['sans-serif', 'Poppins'],
    },
    extend: {
      colors: {
        'g-primary': 'var(--primary)',
        'g-secondary': 'var(--secondary)',
        'g-gray': 'var(--gray)',
      },
    },
  },
  plugins: [],
}
