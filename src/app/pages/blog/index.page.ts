import { injectContentFiles } from '@analogjs/content';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import PostAttributes from '../../post-attributes';
import { CardBlogComponent } from './../../shared/components';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CardBlogComponent, RouterLink],
  template: `
    <div class="relative isolate min-h-screen bg-pitch">
      <!-- subtle grid backdrop -->
      <div class="hero-grid fixed inset-0 -z-10 opacity-60" aria-hidden="true"></div>

      <section class="relative mx-auto max-w-7xl px-6 pb-24 pt-28">
        <div class="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div class="flex flex-col gap-3">
            <p class="font-mono text-xs tracking-[0.25em] text-signal">BLOG ARCHIVE</p>
            <h1 class="font-display text-4xl font-bold tracking-tight text-chalk sm:text-5xl">
              Writing
            </h1>
            <p class="max-w-xl text-lg text-sage">
              Tutorials, deep dives and honest notes on web development.
            </p>
          </div>

          <a
            routerLink="/"
            class="inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-sm text-chalk transition-colors hover:border-signal/50 hover:text-signal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-4 w-4">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            back to home
          </a>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          @for (post of posts; track post.attributes.slug) {
            <app-card-blog [blogPost]="post.attributes" class="h-full" />
          }
        </div>
      </section>
    </div>
  `,
})
export default class BlogComponent {
  readonly posts = injectContentFiles<PostAttributes>(contentFiles =>
    contentFiles.filename.includes('/src/content/blog')
  )
    .sort((a, b) => b.attributes.order - a.attributes.order)
    .map(post => ({
      ...post,
      attributes: {
        ...post.attributes,
        tagsArray: post.attributes.tags.split(',').map(tag => tag.trim()),
      },
    }));
}
