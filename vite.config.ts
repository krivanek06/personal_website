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
        highlighter: 'prism',
        prismOptions: {
          additionalLangs: ['yaml', 'sql', 'graphql', 'bash', 'markdown'],
        },
      },
      prerender: {
        routes: async () => [
          '/',
          '/blog',
          '/toolkit',
          {
            contentDir: 'src/content/posts',
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
