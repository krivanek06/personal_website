import { provideContent, withMarkdownRenderer } from '@analogjs/content';
import { withPrismHighlighter } from '@analogjs/content/prism-highlighter';
import { provideFileRouter, requestContextInterceptor } from '@analogjs/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { withInMemoryScrolling, withViewTransitions } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideFileRouter(
      // this is in place of scrollPositionRestoration: 'disabled',
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
      // add transition animations
      withViewTransitions()
    ),
    provideHttpClient(withFetch(), withInterceptors([requestContextInterceptor])),
    // todo - this was causing error when displaying an image , idk why
    //provideClientHydration(),
    provideContent(withMarkdownRenderer(), withPrismHighlighter()),
  ],
};
