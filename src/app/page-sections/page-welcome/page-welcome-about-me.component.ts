import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/components';

@Component({
  selector: 'app-page-welcome-about-me',
  imports: [RevealDirective],
  template: `
    <section id="about" class="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-20 lg:py-28">
      <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <!-- Portrait -->
        <div appReveal class="relative isolate mx-auto w-full max-w-md lg:max-w-none">
          <div class="portrait-glow absolute inset-0 -z-10" aria-hidden="true"></div>
          <div class="relative overflow-hidden rounded-3xl border border-line">
            <img
              src="me/me-black-white.webp"
              alt="Eduard Krivanek"
              class="h-[440px] w-full object-cover sm:h-[540px]" />
            <div
              class="absolute inset-0 bg-gradient-to-t from-pitch/70 via-transparent to-transparent"></div>
            <div
              class="absolute bottom-4 left-4 font-mono text-[11px] tracking-[0.15em] text-sage">
              about — the person behind the code
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="flex flex-col justify-center">
          <div appReveal class="mb-8 flex flex-col gap-4">
            <p class="font-mono text-xs tracking-[0.25em] text-signal">04 · ABOUT</p>
            <h2 class="font-display text-4xl font-bold tracking-tight text-chalk sm:text-5xl">
              About me
            </h2>
          </div>

          <div appReveal class="space-y-5 text-lg leading-relaxed text-sage">
            <p>
              I'm Eduard Krivanek, a Full Stack Developer focused on Angular, RxJS,
              Firebase and NestJS — building web applications that are as dependable as
              they are pleasant to use.
            </p>
            <p>
              Over the last few years I've built financial dashboards that generate
              trading statistics, a YAML-driven UI generator, a ticket tracker for a bank,
              and a range of SaaS applications.
            </p>
            <p>
              I love sharing what I learn — through blogging, conference talks and
              mentoring other developers. Away from the keyboard, I'm usually cycling or
              playing chess.
            </p>
          </div>

          <ul appReveal class="mt-8 space-y-4 border-t border-line pt-8">
            <li class="flex items-start gap-4">
              <span
                class="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-signal/10 text-signal">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <div>
                <h3 class="font-medium text-chalk">5+ years of Angular</h3>
                <p class="text-sm text-sage">From version 8 to today, keeping pace with every release.</p>
              </div>
            </li>

            <li class="flex items-start gap-4">
              <span
                class="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-signal/10 text-signal">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              <div>
                <h3 class="font-medium text-chalk">Fast &amp; efficient</h3>
                <p class="text-sm text-sage">Performance-minded code and clean, maintainable practices.</p>
              </div>
            </li>

            <li class="flex items-start gap-4">
              <span
                class="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-signal/10 text-signal">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-4.41 0-8-1.79-8-4V8c0-2.21 3.59-4 8-4s8 1.79 8 4v6c0 2.21-3.59 4-8 4z" />
                </svg>
              </span>
              <div>
                <h3 class="font-medium text-chalk">Writer &amp; speaker</h3>
                <p class="text-sm text-sage">Sharing insights through blog posts and tech talks.</p>
              </div>
            </li>
          </ul>
        </div>
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
export class PageWelcomeAboutMeComponent {}
