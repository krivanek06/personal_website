import { injectContentFiles } from '@analogjs/content';
import { Component } from '@angular/core';
import PostAttributes from '../../post-attributes';
import { SvgTwoComponent } from '../../shared/components';
import { CardBlogComponent } from './../../shared/components';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CardBlogComponent, SvgTwoComponent],
  template: `
    <!-- svg background -->
    <app-svg-two addClass="fixed right-0 top-0" />
    <app-svg-two addClass="fixed left-0 bottom-0 rotate-180" />

    <section class="relative mx-auto max-w-[1520px] md:px-6">
      <h1 class="text-primary-green mb-8 pt-6 text-4xl font-bold">Blog Archive</h1>
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
