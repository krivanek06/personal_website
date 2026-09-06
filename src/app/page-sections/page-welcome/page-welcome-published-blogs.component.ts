import { injectContentFiles } from '@analogjs/content';
import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import PostAttributes from '../../post-attributes';
import { CardBlogComponent, RevealDirective } from '../../shared/components';

@Component({
  selector: 'app-page-welcome-published-blogs',
  standalone: true,
  imports: [CardBlogComponent, RouterLink, SlicePipe, RevealDirective],
  template: `
    <section id="blog" class="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-20 lg:py-28">
      <div
        appReveal
        class="mb-12 flex flex-col items-start justify-between gap-6 sm:mb-16 sm:flex-row sm:items-end">
        <div class="flex flex-col gap-4">
          <p class="font-mono text-xs tracking-[0.25em] text-signal">05 · WRITING</p>
          <h2 class="font-display text-4xl font-bold tracking-tight text-chalk sm:text-5xl">
            Latest from the blog
          </h2>
          <p class="max-w-2xl text-lg text-sage">
            Tutorials, deep dives and honest notes on web development.
          </p>
        </div>

        <a
          routerLink="/blog"
          class="inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-6 py-3 font-mono text-sm text-chalk transition-colors hover:border-signal/50 hover:text-signal">
          view all posts
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip-rule="evenodd" />
          </svg>
        </a>
      </div>

      <div appReveal class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        @for (post of blogPosts | slice: 0 : 3; track post.slug) {
          <app-card-blog [blogPost]="post.attributes" class="h-full" />
        }
        @for (post of blogPosts | slice: 3 : 6; track post.slug) {
          <span class="max-md:hidden">
            <app-card-blog [blogPost]="post.attributes" class="h-full" />
          </span>
        }
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageWelcomePublishedBlogsComponent {
  readonly blogPosts = injectContentFiles<PostAttributes>(contentFiles =>
    contentFiles.filename.includes('src/content/blog')
  )
    .sort((a, b) => b.attributes.order - a.attributes.order)
    .slice(0, 6);
}
