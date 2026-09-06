import { injectContent, injectContentFiles, MarkdownComponent } from '@analogjs/content';
import { AsyncPipe } from '@angular/common';
import { afterNextRender, Component, ElementRef, viewChild } from '@angular/core';

import { RouteMeta } from '@analogjs/router';
import { RouterLink } from '@angular/router';
import PostAttributes from '../../post-attributes';

const SITE_URL = 'https://eduardkrivanek.com';

export const routeMeta: RouteMeta = {
  title: route => {
    const file = injectContentFiles<PostAttributes>().find(
      contentFile => contentFile.slug === route.params['slug']
    );
    return file?.attributes.title ?? 'Blog Post';
  },
  meta: route => {
    const file = injectContentFiles<PostAttributes>().find(
      contentFile => contentFile.slug === route.params['slug']
    )!;
    const url = `${SITE_URL}/blog/${file.attributes.slug}`;

    return [
      { name: 'description', content: file.attributes.seoDescription },
      { name: 'author', content: 'Eduard Krivanek' },
      { property: 'og:title', content: file.attributes.title },
      { property: 'og:description', content: file.attributes.seoDescription },
      { property: 'og:type', content: 'article' },
      { property: 'og:image', content: file.attributes.coverImage },
      { property: 'og:url', content: url },
      { property: 'article:published_time', content: file.attributes.datePublished },
    ];
  },
};

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [AsyncPipe, MarkdownComponent, RouterLink],
  template: `
    <div class="relative isolate min-h-screen bg-pitch">
      <!-- subtle grid backdrop -->
      <div class="hero-grid fixed inset-0 -z-10 opacity-50" aria-hidden="true"></div>

      <!-- reading progress -->
      <div
        #progress
        class="fixed inset-x-0 top-0 z-50 h-[3px] origin-left scale-x-0 bg-signal"
        aria-hidden="true"></div>

      <section class="mx-auto max-w-[1240px] px-4 pt-28 lg:px-6">
        @if (post$ | async; as post) {
          <div
            aria-hidden="true"
            class="pointer-events-none fixed right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-signal font-mono text-sm font-bold text-pitch shadow-lg shadow-signal/25 sm:right-6 sm:top-6 sm:h-14 sm:w-14 sm:text-base">
            {{ post.attributes.order }}#
          </div>

          <article
            class="prose prose-invert mx-auto flex w-full flex-col px-4 py-8 md:max-w-4xl">
            <a
              routerLink="/blog"
              class="mb-10 inline-flex max-w-[300px] items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-sm text-chalk transition-colors hover:border-signal/50 hover:text-signal">
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
              back to blog
            </a>

            <img class="z-10 max-h-[400px] rounded-2xl object-contain" [src]="post.attributes.coverImage" />

            <analog-markdown class="z-10 text-chalk" [content]="post.content" />
          </article>
        }
      </section>
    </div>
  `,
  styles: `
    .post__image {
      max-height: 40vh;
    }
  `,
})
export default class BlogPostComponent {
  readonly post$ = injectContent<PostAttributes>({
    param: 'slug',
    subdirectory: 'posts',
  });

  private readonly progress = viewChild<ElementRef<HTMLElement>>('progress');

  constructor() {
    afterNextRender(() => {
      const bar = this.progress()?.nativeElement;
      if (!bar || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const update = () => {
        // Distance the page can actually scroll = full document height minus viewport.
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const top = window.scrollY || document.documentElement.scrollTop;
        const ratio = scrollable > 0 ? Math.min(1, Math.max(0, top / scrollable)) : 0;
        // Tailwind v4 compiles `scale-x-0` to the native `scale` property, so
        // write to `scale` (not `transform`) to actually override it.
        bar.style.scale = `${ratio} 1`;
      };

      update();
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
    });
  }
}
