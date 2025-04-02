import { injectContentFiles } from '@analogjs/content';
import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PostAttributes from '../../post-attributes';
import { CardGeneralComponent } from '../../shared/components';

@Component({
  selector: 'app-page-welcome-published-blogs',
  standalone: true,
  imports: [RouterLink, CardGeneralComponent],
  template: `
    <section class="relative z-10 mx-auto w-full p-10 xl:w-[1480px]">
      <div class="mb-20 text-center">
        <h2 class="text-primary-green mb-4 text-5xl">Latest Blog Posts</h2>
        <p class="mx-auto max-w-2xl text-xl text-gray-400">
          Insights, tutorials, and thoughts about web development, technology, and software engineering
        </p>
      </div>

      <div #blogPostContainer class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        @for (post of blogPosts; track post.slug) {
          <app-card-general additionalClasses="h-full">
            <a [routerLink]="['/blog', post.slug]" class="group block">
              <div class="relative h-48 overflow-hidden rounded-lg">
                <img
                  [src]="'article-cover/' + post.attributes.coverImage"
                  [alt]="post.attributes.title"
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute bottom-4 left-4 flex items-center gap-4 text-sm text-white">
                  <span>{{ post.attributes.datePublished }}</span>
                  <span>•</span>
                  <span>{{ post.attributes.readTime }} min read</span>
                </div>
              </div>
              <div class="p-6">
                <h3 class="mb-3 text-2xl font-bold text-white transition-colors group-hover:text-green-500">
                  {{ post.attributes.title }}
                </h3>
                <p class="text-gray-400">{{ post.attributes.seoDescription }}</p>
              </div>
            </a>
          </app-card-general>
        }
      </div>

      <div class="mt-12 text-center">
        <a
          routerLink="/blog"
          class="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-6 py-3 text-green-500 transition-colors hover:bg-green-500/20">
          View All Posts
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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

      const blogPostElements = Array.from(this.blogPostContainer()?.nativeElement.children || []) as HTMLElement[];
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
