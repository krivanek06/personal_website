import { injectContent, MarkdownComponent } from '@analogjs/content';
import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';

import { RouterLink } from '@angular/router';
import PostAttributes from '../../post-attributes';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [AsyncPipe, MarkdownComponent, RouterLink],
  template: `
    <section class="mx-auto max-w-[1240px] px-4 lg:px-6">
      @if (post$ | async; as post) {
        <article
          class="prose prose-slate dark:prose-invert flex w-full flex-col px-4 py-16 md:max-w-4xl">
          <!-- back button -->
          <a routerLink="/blog" class="btn mb-8 flex w-64 flex-row items-center"
            ><svg
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
            <span>Back to Blog Posts</span></a
          >

          <img class="post__image" [src]="post.attributes.coverImage" />
          <analog-markdown class="markdown" [content]="post.content" />
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
