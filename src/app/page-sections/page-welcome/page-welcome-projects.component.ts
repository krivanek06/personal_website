import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/components';

type Project = {
  index: string;
  title: string;
  description: string;
  tags: string[];
  link: string | null;
};

@Component({
  selector: 'app-page-welcome-projects',
  imports: [RevealDirective],
  template: `
    <section class="mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
      <div appReveal class="mb-12 flex flex-col gap-4 sm:mb-16">
        <p class="font-mono text-xs tracking-[0.25em] text-signal">03 · WORK</p>
        <h2 class="font-display text-4xl font-bold tracking-tight text-chalk sm:text-5xl">
          Selected work
        </h2>
        <p class="max-w-2xl text-lg text-sage">
          A few of the things I've designed, built and shipped.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        @for (project of projects; track project.title) {
          <article
            appReveal
            [appRevealDelay]="$index * 0.06"
            class="group flex flex-col rounded-2xl border border-line bg-moss p-8 transition-colors hover:border-signal/30">
            <div class="mb-6 flex items-center justify-between">
              <span class="font-mono text-xs text-sage">{{ project.index }}</span>
              @if (project.link) {
                <a
                  [href]="project.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-mono text-xs text-signal transition-colors hover:text-mint">
                  case study ↗
                </a>
              } @else {
                <span class="font-mono text-[11px] text-sage/60">details on request</span>
              }
            </div>

            <h3
              class="font-display text-2xl font-bold text-chalk transition-colors group-hover:text-signal">
              {{ project.title }}
            </h3>

            <p class="mt-3 leading-relaxed text-sage">{{ project.description }}</p>

            <div class="mt-6 flex flex-wrap gap-2 border-t border-line pt-6">
              @for (tag of project.tags; track tag) {
                <span
                  class="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-sage">
                  {{ tag }}
                </span>
              }
            </div>
          </article>
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
export class PageWelcomeProjectsComponent {
  /**
   * Replace these placeholders with your real projects — a name, one or two
   * sentences, the key technologies, and (optionally) a live/demo link.
   */
  readonly projects: Project[] = [
    {
      index: '01',
      title: 'Trading Statistics Dashboard',
      description:
        'A realtime dashboard generating trading statistics for a finance client — streaming data visualisation with Angular and RxJS on a NestJS API.',
      tags: ['Angular', 'RxJS', 'NestJS', 'Charts'],
      link: null,
    },
    {
      index: '02',
      title: 'YAML-driven UI Generator',
      description:
        'A generator that turns a YAML spec into a rendered Angular UI — forms, tables and validation — without hand-writing each screen.',
      tags: ['Angular', 'TypeScript', 'YAML'],
      link: null,
    },
    {
      index: '03',
      title: 'Bank Ticket Tracker',
      description:
        'An internal ticket tracker for a bank with role-based access, realtime updates and a full audit trail.',
      tags: ['Angular', 'Firebase', 'RxJS'],
      link: null,
    },
    {
      index: '04',
      title: 'SaaS Applications',
      description:
        'A range of SaaS products shipped end to end — auth, billing and dashboards — on Google Cloud Platform with Firebase realtime data.',
      tags: ['Angular', 'Firebase', 'NestJS', 'GCP'],
      link: null,
    },
  ];
}
