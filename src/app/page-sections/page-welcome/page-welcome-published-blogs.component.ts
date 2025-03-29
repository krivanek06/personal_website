import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardGeneralComponent } from '../../shared/components';

interface BlogPost {
  title: string;
  description: string;
  date: string;
  readTime: string;
  image: string;
  slug: string;
}

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

      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        @for (post of blogPosts; track post.slug) {
          <app-card-general>
            <a [routerLink]="['/blog', post.slug]" class="group block">
              <div class="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  [src]="post.image"
                  [alt]="post.title"
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute bottom-4 left-4 flex items-center gap-4 text-sm text-white">
                  <span>{{ post.date }}</span>
                  <span>•</span>
                  <span>{{ post.readTime }} min read</span>
                </div>
              </div>
              <div class="p-6">
                <h3 class="mb-3 text-2xl font-bold text-white transition-colors group-hover:text-green-500">
                  {{ post.title }}
                </h3>
                <p class="text-gray-400">{{ post.description }}</p>
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
  protected readonly blogPosts: BlogPost[] = [
    {
      title: 'Building Modern Web Applications with Angular',
      description: 'Learn about the latest features in Angular and how to build scalable, maintainable applications.',
      date: 'March 15, 2024',
      readTime: '8',
      image: 'blog/angular.webp',
      slug: 'building-modern-web-applications-with-angular',
    },
    {
      title: 'The Future of Web Development',
      description: 'Exploring emerging trends and technologies that are shaping the future of web development.',
      date: 'March 10, 2024',
      readTime: '6',
      image: 'blog/future.webp',
      slug: 'future-of-web-development',
    },
    {
      title: 'Best Practices for TypeScript Development',
      description: 'Essential tips and tricks for writing clean, type-safe TypeScript code that scales.',
      date: 'March 5, 2024',
      readTime: '7',
      image: 'blog/typescript.webp',
      slug: 'typescript-best-practices',
    },
  ];
}
