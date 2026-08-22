import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import PostAttributes from '../../../post-attributes';
import { DateAgoPipe } from '../../utils/date.pipe';
import { CardGeneralComponent } from '../card-general/card-general.component';

@Component({
  selector: 'app-card-blog',
  imports: [CardGeneralComponent, RouterLink, DateAgoPipe, SlicePipe],
  template: `
    <app-card-general additionalClasses="h-full" class="h-full">
      <a [routerLink]="['/blog', blogPost().slug]" class="flex h-full flex-col">
        <div class="relative h-44 shrink-0 overflow-hidden rounded-t-2xl">
          <img
            [src]="blogPost().coverImage"
            [alt]="blogPost().title"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-moss/90 via-moss/20 to-transparent"></div>
        </div>

        <div class="flex flex-1 flex-col gap-3 p-6">
          <div class="flex items-center gap-2 font-mono text-[11px] text-sage">
            <span>{{ blogPost().datePublished | dateAgo }}</span>
            <span class="text-signal/50">·</span>
            <span>{{ blogPost().readTime }} min read</span>
          </div>

          <h3
            class="font-display text-xl font-semibold leading-snug text-chalk transition-colors group-hover:text-signal">
            {{ blogPost().title }}
          </h3>

          <p class="text-sm leading-relaxed text-sage">{{ blogPost().seoDescription }}</p>

          <div class="mt-auto flex flex-wrap gap-2 pt-3">
            @for (item of tags | slice: 0 : 3; track item) {
              <span
                class="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-sage">
                {{ item }}
              </span>
            }
          </div>
        </div>
      </a>
    </app-card-general>
  `,
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardBlogComponent {
  readonly blogPost = input.required<PostAttributes>();

  /** Tags are stored as a comma-separated string in frontmatter. */
  get tags(): string[] {
    const post = this.blogPost();
    if (post.tagsArray?.length) {
      return post.tagsArray;
    }
    return (post.tags ?? '')
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);
  }
}
