import { provideContent, withMarkdownRenderer } from '@analogjs/content';
import { withShikiHighlighter } from '@analogjs/content/shiki-highlighter';
import { provideFileRouter, requestContextInterceptor } from '@analogjs/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { withViewTransitions } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideFileRouter(
      // add transition animations
      withViewTransitions()
    ),
    provideHttpClient(withFetch(), withInterceptors([requestContextInterceptor])),
    // todo - this was causing error when displaying an image , idk why
    //provideClientHydration(),
    provideContent(withMarkdownRenderer(), withShikiHighlighter()),
  ],
};
