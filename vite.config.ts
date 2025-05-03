/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    analog({
      content: {
        prismOptions: {
          additionalLangs: ['yaml', 'sql', 'graphql', 'bash', 'markdown'],
        },
      },
      prerender: {
        routes: async () => [
          '/',
          '/blog',
          {
            contentDir: 'src/content/blog',
            transform: file => {
              const slug = file.attributes?.['slug'] || file.name;
              return `/blog/${slug}`;
            },
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
