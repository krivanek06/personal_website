import { injectContentFiles } from '@analogjs/content';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import PostAttributes from '../../post-attributes';
import { SvgTwoComponent } from '../../shared/components';
import { CardBlogComponent } from './../../shared/components';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CardBlogComponent, SvgTwoComponent, RouterLink],
  template: `
    <!-- svg background -->
    <app-svg-two addClass="fixed right-0 top-0" />
    <app-svg-two addClass="fixed left-0 bottom-0 rotate-180" />

    <section class="relative mx-auto max-w-[1520px] px-6">
      <div class="mb-6 flex items-center justify-between gap-10 pt-6">
        <!-- title -->
        <h1 class="text-primary-green text-2xl font-bold sm:text-4xl">Blog Archive</h1>

        <!-- back button -->
        <a
          routerLink="/"
          class="z-10 inline-flex max-w-[300px] cursor-pointer items-center gap-2 rounded-full bg-green-500/10 px-6 py-3 text-green-500 transition-colors hover:bg-green-500/20">
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

          <span class="hidden sm:block">Back to Blog Posts</span>
        </a>
      </div>

      <div class="my-8 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        @for (post of posts; track post.attributes.slug) {
          <app-card-blog [blogPost]="post.attributes" class="h-full" />
        }
      </div>
    </section>
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
