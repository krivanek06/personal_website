import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/components';

@Component({
  selector: 'app-page-welcome-full-stack',
  imports: [RevealDirective],
  template: `
    <section id="stack" class="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-20 lg:py-28">
      <div appReveal class="mb-12 flex flex-col gap-4 sm:mb-16">
        <p class="font-mono text-xs tracking-[0.25em] text-signal">01 · STACK</p>
        <h2 class="font-display text-4xl font-bold tracking-tight text-chalk sm:text-5xl">
          Full stack, end to end
        </h2>
        <p class="max-w-2xl text-lg text-sage">
          One engineer across the whole system — from the first component to the last
          deploy.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Frontend -->
        <article
          appReveal
          [appRevealDelay]="0.05"
          class="flex flex-col rounded-2xl border border-line bg-moss p-8 transition-colors hover:border-signal/30">
          <div class="mb-6 flex items-center justify-between">
            <span class="font-mono text-xs text-sage">01 — FRONTEND</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-7 w-7 text-signal"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h3 class="font-display text-2xl font-bold text-chalk">Frontend</h3>
          <p class="mt-1 font-mono text-sm text-signal">Angular · RxJS · TypeScript</p>
          <p class="mt-5 leading-relaxed text-sage">
            I build Angular applications — client- and server-side rendered — that stay
            fast and maintainable as they grow. I work closely with product owners and
            keep quality high with unit tests.
          </p>

          <ul class="mt-6 space-y-3 border-t border-line pt-6">
            <li class="flex gap-3 text-sm text-sage">
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal"></span>
              <span><strong class="font-medium text-chalk">Performance</strong> — lazy routing, tree shaking, defer blocks, change-detection tuning.</span>
            </li>
            <li class="flex gap-3 text-sm text-sage">
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal"></span>
              <span><strong class="font-medium text-chalk">Architecture</strong> — clean boundaries in Nx monorepos with NgRx or Apollo Client.</span>
            </li>
            <li class="flex gap-3 text-sm text-sage">
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal"></span>
              <span><strong class="font-medium text-chalk">Responsive</strong> — Angular Material and Tailwind, from desktop to mobile.</span>
            </li>
          </ul>
        </article>

        <!-- Backend -->
        <article
          appReveal
          [appRevealDelay]="0.15"
          class="flex flex-col rounded-2xl border border-line bg-moss p-8 transition-colors hover:border-signal/30">
          <div class="mb-6 flex items-center justify-between">
            <span class="font-mono text-xs text-sage">02 — BACKEND</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-7 w-7 text-signal"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </div>

          <h3 class="font-display text-2xl font-bold text-chalk">Backend</h3>
          <p class="mt-1 font-mono text-sm text-signal">NestJS · Firebase · MongoDB</p>
          <p class="mt-5 leading-relaxed text-sage">
            I design REST and GraphQL APIs with NestJS and lean on Firebase for realtime
            data. I deploy to Google Cloud Platform, serve through Cloudflare, and monitor
            with Sentry, Kibana and Grafana.
          </p>

          <ul class="mt-6 space-y-3 border-t border-line pt-6">
            <li class="flex gap-3 text-sm text-sage">
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal"></span>
              <span><strong class="font-medium text-chalk">APIs</strong> — REST and GraphQL with NestJS or Firebase.</span>
            </li>
            <li class="flex gap-3 text-sm text-sage">
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal"></span>
              <span><strong class="font-medium text-chalk">Data</strong> — MongoDB and Firebase, with Prisma as the ORM.</span>
            </li>
            <li class="flex gap-3 text-sm text-sage">
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal"></span>
              <span><strong class="font-medium text-chalk">Quality</strong> — Jest and Postman for tests, ESLint and Prettier for clean code.</span>
            </li>
          </ul>
        </article>
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
export class PageWelcomeFullStackComponent {}
