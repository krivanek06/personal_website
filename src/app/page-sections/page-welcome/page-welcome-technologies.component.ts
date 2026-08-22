import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/components';

@Component({
  selector: 'app-page-welcome-technologies',
  imports: [RevealDirective],
  template: `
    <section class="mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
      <div appReveal class="mb-12 flex flex-col gap-4 sm:mb-16">
        <p class="font-mono text-xs tracking-[0.25em] text-signal">02 · TOOLKIT</p>
        <h2 class="font-display text-4xl font-bold tracking-tight text-chalk sm:text-5xl">
          Technologies I work with
        </h2>
        <p class="max-w-2xl text-lg text-sage">
          The tools that make up my daily stack, from the editor to production.
        </p>
      </div>

      <div appReveal class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        @for (tech of technologies; track tech.name) {
          <div
            class="group flex items-center gap-4 rounded-xl border border-line bg-moss/60 px-5 py-4 transition-colors hover:border-signal/40 hover:bg-moss">
            <img
              [src]="tech.icon"
              [alt]="tech.name"
              class="h-8 w-8 shrink-0 object-contain"
              width="32"
              height="32" />
            <span
              class="font-mono text-xs tracking-wide text-sage transition-colors group-hover:text-chalk">
              {{ tech.name }}
            </span>
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
export class PageWelcomeTechnologiesComponent {
  protected readonly technologies = [
    { name: 'Angular', icon: 'tech/angular.png' },
    { name: 'RxJS', icon: 'tech/rxjs.png' },
    { name: 'TypeScript', icon: 'tech/typescript.png' },
    { name: 'Tailwind', icon: 'tech/tailwind.png' },
    { name: 'Node.js', icon: 'tech/nodejs.png' },
    { name: 'NestJS', icon: 'tech/nestjs.png' },
    { name: 'GraphQL', icon: 'tech/graphql.png' },
    { name: 'Firebase', icon: 'tech/firebase.png' },
    { name: 'MongoDB', icon: 'tech/mongodb.webp' },
    { name: 'Cloudflare', icon: 'tech/cloudflare.png' },
    { name: 'NX', icon: 'tech/nx.png' },
    { name: 'Jest', icon: 'tech/jest.png' },
  ] as const;
}
