import { provideContent, withMarkdownRenderer } from '@analogjs/content';
import { withPrismHighlighter } from '@analogjs/content/prism-highlighter';
import { provideFileRouter, requestContextInterceptor } from '@analogjs/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { withInMemoryScrolling, withViewTransitions } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideFileRouter(
      // scroll to top on navigation and honour in-page `#anchor` links
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
      // add transition animations
      withViewTransitions()
    ),
    provideHttpClient(withFetch(), withInterceptors([requestContextInterceptor])),
    // Reuse the server-rendered HTML on the client instead of re-rendering from
    // scratch. Without this, the app shell (footer) renders immediately while the
    // lazy-loaded route content is still loading, causing a "footer-only" flash.
    provideClientHydration(),
    provideContent(withMarkdownRenderer(), withPrismHighlighter()),
  ],
};
