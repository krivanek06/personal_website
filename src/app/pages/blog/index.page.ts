import { injectContentFiles } from '@analogjs/content';
import { SlicePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import PostAttributes from '../../post-attributes';
import { CardGeneralComponent, SvgTwoComponent } from '../../shared/components';
import { DateAgoPipe } from '../../shared/utils/date.pipe';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CardGeneralComponent, SlicePipe, DateAgoPipe, RouterLink, SvgTwoComponent],
  template: `
    <!-- svg background -->
    <app-svg-two addClass="fixed right-0 top-0" />
    <app-svg-two addClass="fixed left-0 bottom-0 rotate-180" />

    <section class="relative mx-auto max-w-[1520px] md:px-6">
      <h1 class="text-primary-green mb-8 pt-6 text-4xl font-bold">Blog Archive</h1>
      <div class="my-8 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        @for (post of posts; track post.attributes.slug) {
          <app-card-general additionalClasses="h-full group z-10">
            <a [routerLink]="['/blog', post.slug]" class="block h-full">
              <div class="relative h-48 overflow-hidden rounded-lg">
                <img
                  [src]="'article-cover/' + post.attributes.coverImage"
                  [alt]="post.attributes.title"
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <!-- overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div class="grid gap-4 p-6">
                <!-- title -->
                <h3
                  class="flex flex-wrap items-center gap-3 text-2xl font-bold text-white transition-colors group-hover:text-green-500">
                  {{ post.attributes.order }}.) {{ post.attributes.title }}
                </h3>

                <!-- meta info -->
                <div class="flex items-center gap-4 text-sm text-white">
                  <span>{{ post.attributes.datePublished }}</span>
                  <span>•</span>
                  <span>{{ post.attributes.datePublished | dateAgo }}</span>
                  <span>•</span>
                  <span>{{ post.attributes.readTime }} min read</span>
                </div>

                <!-- description -->
                <p class="text-gray-400">{{ post.attributes.seoDescription }}</p>

                <!-- tags -->
                <div class="flex flex-wrap items-center gap-2">
                  @for (item of post.attributes.tagsArray | slice: 0 : 4; track item) {
                    <div class="rounded-lg border border-green-700 bg-[#00b01a1e] p-2">{{ item }}</div>
                  }
                </div>
              </div>
            </a>
          </app-card-general>
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
