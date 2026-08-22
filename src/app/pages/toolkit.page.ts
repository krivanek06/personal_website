import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../shared/components';

export const routeMeta: RouteMeta = {
  title: 'Toolkit — Eduard Krivanek',
  meta: [
    {
      name: 'description',
      content:
        'The tools and technologies Eduard Krivanek uses to build web applications.',
    },
  ],
};

@Component({
  selector: 'app-toolkit',
  imports: [RouterLink, RevealDirective],
  template: `
    <div class="relative isolate min-h-screen bg-pitch">
      <div class="hero-grid fixed inset-0 -z-10 opacity-50" aria-hidden="true"></div>

      <section class="mx-auto max-w-3xl px-6 pb-24 pt-28">
        <a
          routerLink="/"
          class="mb-10 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-sm text-chalk transition-colors hover:border-signal/50 hover:text-signal">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-4 w-4">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          back to home
        </a>

        <p appReveal class="font-mono text-xs tracking-[0.25em] text-signal">TOOLKIT</p>
        <h1
          appReveal
          class="mt-4 font-display text-4xl font-bold tracking-tight text-chalk sm:text-5xl">
          Toolkit
        </h1>
        <p appReveal class="mt-5 max-w-xl text-lg text-sage">
          The stack I reach for every day — from the editor to production.
        </p>

        <div class="mt-12 space-y-8">
          @for (group of groups; track group.title) {
            <section appReveal class="rounded-2xl border border-line bg-moss p-7">
              <h2 class="mb-4 font-mono text-xs tracking-[0.2em] text-signal">
                {{ group.title }}
              </h2>
              <ul class="flex flex-wrap gap-2">
                @for (item of group.items; track item) {
                  <li
                    class="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-sage">
                    {{ item }}
                  </li>
                }
              </ul>
            </section>
          }
        </div>
      </section>
    </div>
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
export default class ToolkitComponent {
  readonly groups = [
    { title: 'Editor & terminal', items: ['VS Code'] },
    {
      title: 'Frontend',
      items: [
        'Angular',
        'RxJS',
        'TypeScript',
        'Tailwind CSS',
        'Angular Material',
        'NgRx',
        'Apollo Client',
      ],
    },
    {
      title: 'Backend & data',
      items: [
        'NestJS',
        'Node.js',
        'Firebase',
        'MongoDB',
        'GraphQL',
        'Prisma',
        'Cloudflare',
        'Google Cloud Platform',
      ],
    },
    {
      title: 'Tooling & quality',
      items: [
        'Nx',
        'Jest',
        'Postman',
        'ESLint',
        'Prettier',
        'Husky',
        'lint-staged',
        'Sentry',
        'Kibana',
        'Grafana',
      ],
    },
  ];
}
