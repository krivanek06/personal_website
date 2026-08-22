import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { URL_GITHUB, URL_INSTAGRAM, URL_LINKED_IN } from './page-sections/page-welcome/model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-pitch">
      <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-signal focus:px-5 focus:py-2.5 focus:font-mono focus:text-sm focus:font-bold focus:text-pitch">
        Skip to content
      </a>

      <main id="main-content">
        <router-outlet />
      </main>

      <!-- Footer -->
      <footer class="border-t border-line">
        <div
          class="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 py-14 text-center">
          <a
            routerLink="/"
            class="font-display text-3xl font-bold text-chalk transition-colors hover:text-signal">
            Eduard&nbsp;Krivanek
          </a>

          <p class="max-w-md text-sm text-sage">
            Full-stack developer building fast, dependable web applications with
            Angular, RxJS, NestJS and Firebase.
          </p>

          <nav class="flex items-center gap-6 font-mono text-xs text-sage">
            <a routerLink="/" class="transition-colors hover:text-chalk">home</a>
            <a routerLink="/blog" class="transition-colors hover:text-chalk">blog</a>
            <a routerLink="/toolkit" class="transition-colors hover:text-chalk">toolkit</a>
            <a href="/rss.xml" class="transition-colors hover:text-chalk">rss</a>
          </nav>

          <a
            [href]="URL_LINKED_IN"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-full bg-signal px-6 py-2.5 font-mono text-xs font-bold text-pitch transition-transform hover:-translate-y-0.5">
            LinkedIn
          </a>

          <div class="flex items-center gap-6 font-mono text-xs text-sage">
            <a
              [href]="URL_GITHUB"
              target="_blank"
              rel="noopener noreferrer"
              class="transition-colors hover:text-signal">
              GitHub
            </a>
            <a
              [href]="URL_INSTAGRAM"
              target="_blank"
              rel="noopener noreferrer"
              class="transition-colors hover:text-signal">
              Instagram
            </a>
          </div>

          <p class="font-mono text-xs text-sage/60">
            © {{ currentYear }} Eduard Krivanek · Built with Angular, Analog &amp; GSAP
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: ``,
})
export class AppComponent {
  readonly URL_LINKED_IN = URL_LINKED_IN;
  readonly URL_GITHUB = URL_GITHUB;
  readonly URL_INSTAGRAM = URL_INSTAGRAM;
  readonly currentYear = new Date().getFullYear();
}
