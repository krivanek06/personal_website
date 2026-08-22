import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild,
} from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-page-welcome-ticker',
  standalone: true,
  template: `
    <section
      class="relative overflow-hidden border-y border-line bg-moss/40 py-4"
      aria-label="Technologies I work with">
      <div #track class="flex w-max items-center">
        @for (copy of [0, 1]; track copy) {
          <div
            class="flex items-center"
            [attr.aria-hidden]="copy === 1 ? 'true' : null">
            @for (tech of technologies; track tech) {
              <span
                class="whitespace-nowrap px-6 font-mono text-sm tracking-[0.2em] text-sage">
                {{ tech }}
              </span>
              <span class="text-signal/50">·</span>
            }
          </div>
        }
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
export class PageWelcomeTickerComponent {
  private readonly track = viewChild<ElementRef<HTMLElement>>('track');

  readonly technologies = [
    'ANGULAR',
    'RXJS',
    'TYPESCRIPT',
    'NESTJS',
    'FIREBASE',
    'MONGODB',
    'GRAPHQL',
    'NODE.JS',
    'NX',
    'TAILWIND',
    'CLOUDFLARE',
    'JEST',
  ];

  constructor() {
    afterNextRender(() => {
      const track = this.track()?.nativeElement;
      if (!track || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      gsap.to(track, {
        xPercent: -50,
        duration: 32,
        ease: 'none',
        repeat: -1,
      });
    });
  }
}
