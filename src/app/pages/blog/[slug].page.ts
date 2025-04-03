import { injectContent, MarkdownComponent } from '@analogjs/content';
import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { SvgTwoComponent } from './../../shared/components';

import { RouterLink } from '@angular/router';
import PostAttributes from '../../post-attributes';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [AsyncPipe, MarkdownComponent, RouterLink, SvgTwoComponent],
  template: `
    <!-- svg background -->
    <app-svg-two addClass="fixed right-0 top-0 opacity-50" />
    <app-svg-two addClass="fixed left-0 bottom-0 rotate-180 opacity-50" />

    <section class="mx-auto max-w-[1240px] px-4 lg:px-6">
      @if (post$ | async; as post) {
        <article
          class="prose prose-slate dark:prose-invert mx-auto flex w-full flex-col px-4 py-16 md:max-w-4xl">
          <!-- back button -->
          <a
            routerLink="/blog"
            class="z-10 inline-flex max-w-[300px] items-center gap-2 rounded-full bg-green-500/10 px-6 py-3 text-green-500 transition-colors hover:bg-green-500/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-8 w-8">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>

            <span>Back to Blog Posts</span>
          </a>

          <img class="z-10 h-[400px] object-contain" [src]="post.attributes.coverImage" />

          <analog-markdown class="z-10" [content]="post.content" />
        </article>
      }
    </section>
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
    subdirectory: 'blog',
  });
}
