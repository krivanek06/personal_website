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
        'pw-primary': 'var(--primary)',
        'pw-secondary': 'var(--secondary)',
        'pw-gray': 'var(--gray)',
      },
    },
  },
  plugins: [],
}
