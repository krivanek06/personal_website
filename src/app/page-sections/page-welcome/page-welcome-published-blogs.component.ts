import { injectContentFiles } from '@analogjs/content';
import { SlicePipe } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PostAttributes from '../../post-attributes';
import { CardBlogComponent } from '../../shared/components';

@Component({
  selector: 'app-page-welcome-published-blogs',
  standalone: true,
  imports: [CardBlogComponent, RouterLink, SlicePipe],
  template: `
    <section class="relative z-10 mx-auto w-full p-10 xl:w-[1480px]">
      <div class="mb-20 text-center">
        <h2 class="text-primary-green mb-4 text-4xl lg:text-5xl">Latest Blog Posts</h2>
        <p class="mx-auto max-w-2xl text-xl text-gray-400">
          Insights, tutorials, and thoughts about web development, technology, and
          software engineering
        </p>
      </div>

      <div #blogPostContainer class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <!-- always show first 3 posts -->
        @for (post of blogPosts | slice: 0 : 3; track post.slug) {
          <app-card-blog [blogPost]="post.attributes" class="h-full" />
        }

        <!-- hide on mobile -->
        @for (post of blogPosts | slice: 3 : 6; track post.slug) {
          <span class="max-md:hidden">
            <app-card-blog [blogPost]="post.attributes" class="h-full" />
          </span>
        }
      </div>

      <div class="mt-12 text-center">
        <a
          routerLink="/blog"
          class="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-6 py-3 text-green-500 transition-colors hover:bg-green-500/20">
          View All Posts
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip-rule="evenodd" />
          </svg>
        </a>
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
  private readonly blogPostContainer = viewChild<ElementRef>('blogPostContainer');

  readonly blogPosts = injectContentFiles<PostAttributes>(contentFiles =>
    contentFiles.filename.includes('/src/content/blog')
  )
    .sort((a, b) => b.attributes.order - a.attributes.order)
    .slice(0, 6);

  constructor() {
    afterNextRender(() => {
      gsap.registerPlugin(ScrollTrigger);

      const blogPostElements = Array.from(
        this.blogPostContainer()?.nativeElement.children || []
      ) as HTMLElement[];
      if (!blogPostElements.length) return;

      // Create a timeline for the technology grid
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: this.blogPostContainer()?.nativeElement,
          start: 'top 75%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
          once: true,
          markers: false,
        },
      });

      blogPostElements.forEach((element, index) => {
        gsap.set(element, {
          opacity: 0,
          y: 50,
        });

        const overlay = index === 0 ? 0 : -0.1;

        tl.to(
          element,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.3,
          },
          overlay
        );
      });
    });
  }
}
