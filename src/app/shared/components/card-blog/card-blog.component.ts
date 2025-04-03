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
    <app-card-general additionalClasses="h-full group z-10 " class="h-full">
      <a [routerLink]="['/blog', blogPost().slug]" class="block h-full px-5 py-3">
        <div class="relative h-48 overflow-hidden rounded-lg">
          <img
            [src]="blogPost().coverImage"
            [alt]="blogPost().title"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
          <!-- overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        <div class="grid gap-4 p-6">
          <!-- title -->
          <h3
            class="flex flex-wrap items-center gap-3 text-2xl font-bold text-white transition-colors group-hover:text-green-500">
            {{ blogPost().order }}.) {{ blogPost().title }}
          </h3>

          <!-- meta info -->
          <div class="flex items-center gap-4 text-sm text-white">
            <span>{{ blogPost().datePublished }}</span>
            <span>•</span>
            <span>{{ blogPost().datePublished | dateAgo }}</span>
            <span>•</span>
            <span>{{ blogPost().readTime }} min read</span>
          </div>

          <!-- description -->
          <p class="text-gray-400">{{ blogPost().seoDescription }}</p>

          <!-- tags -->
          <div class="flex flex-wrap items-center gap-2">
            @for (item of blogPost().tagsArray | slice: 0 : 4; track item) {
              <div class="rounded-lg border border-green-700 bg-[#00b01a1e] p-2">
                {{ item }}
              </div>
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
}
