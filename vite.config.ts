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
          additionalLangs: ['yaml', 'sql', 'graphql', 'bash'],
        },
      },
      prerender: {
        routes: [
          '/',
          '/blog',
          '/blog/1_developer_preview_of_standalone_support_in_angular_elements',
          '/blog/2_how_to_get_started_with_pinia_in_vue',
          '/blog/3_creating-a-graphql-server-with-nestjs',
          '/blog/4_angular-apollo-client-getting-started-with-graphql-in-angular',
          '/blog/5_angular-v15-directive-composition-api',
          '/blog/6_angular-apollo-client-apollo-cache-configuration',
          '/blog/7_graphql-everything-you-need-to-know',
          '/blog/8_5-tips-to-improve-angular-performance',
          '/blog/9_new-in-vuejs-33-two-way-binding-with-definemodel-macro',
          '/blog/10_vuejs-reactivity-system-ref-reactive-shallowref-shallowreactive',
          '/blog/11_how_shareReplay_saved_my_angular_project',
          '/blog/12_collection-of-vue-macros-in-vuejs',
          '/blog/13_vuejs-watcheffect-vs-watch',
          '/blog/14_sharing-types-between-angular-and-firebase-functions-in-nx-monorepo',
          '/blog/15_angular-injectiontoken-in-nx',
          '/blog/16_why-am-i-switching-to-signals-in-angular',
          '/blog/17_angular-infinite-scrolling',
          '/blog/18_angular-interview-what-is-higher-order-observable',
          '/blog/19_angular-matpaginator-custom-styling',
          '/blog/20_angular-ssr-cannot-read-properties-of-undefined-reading-corechartchartjs',
          '/blog/21_deploy-angular-universal-to-firebase-cloud-functions',
          '/blog/22_angular-default-image-placeholder',
          '/blog/23_angular-rxjs-catcherror-position-matter',
          '/blog/24_angular-interview-implement-data-reload',
          '/blog/25_deploy-frontend-firebase-app-to-google-play',
          '/blog/26_angular-clickable-component',
          '/blog/27_from-chaos-to-clarity-simplify-your-angular-code-with-declarative-programming',
          '/blog/28_advanced-rxjs-operators-you-know-but-not-well-enough',
          '/blog/29_angular-state-management-how-to-keep-your-sanity',
          '/blog/30_angular-generic-in-memory-cache-service',
          '/blog/31_deep_dive_into_angular_pipes_implementation',
          '/blog/32_create-a-custom-rxresouce-function',
          '/blog/33_advanced-rxjs-operators-you-know-but-not-well-enough-pt2',
          '/blog/34_dynamic-service-injection-in-angular',
          '/blog/35_custom-rxjs-operators',
          '/blog/36_simple-user-event-tracker-in-angular',
          '/blog/37_my-personal-take-on-signal-types-in-angular',
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
