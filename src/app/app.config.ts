import { provideContent, withMarkdownRenderer } from '@analogjs/content';
import { withShikiHighlighter } from '@analogjs/content/shiki-highlighter';
import { provideFileRouter, requestContextInterceptor } from '@analogjs/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideFileRouter(),
    provideHttpClient(withFetch(), withInterceptors([requestContextInterceptor])),
    // todo - this was causing error when displaying an image , idk why
    //provideClientHydration(),
    provideContent(withMarkdownRenderer(), withShikiHighlighter()),
  ],
};
