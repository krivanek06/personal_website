import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild,
  viewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { SvgOneComponent, SvgTwoComponent } from '../../shared/components';
import { PageWelcomeHeroSocialsComponent } from './components/page-welcome-hero-socials.component';

@Component({
  selector: 'app-page-welcome-hero',
  imports: [
    PageWelcomeHeroSocialsComponent,
    RouterLink,
    SvgOneComponent,
    SvgTwoComponent,
  ],
  template: `
    <section
      class="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-pitch">
      <!-- measurement grid -->
      <div class="hero-grid absolute inset-0 -z-10" aria-hidden="true"></div>

      <!-- reused project SVGs as background texture -->
      <app-svg-two
        addClass="pointer-events-none absolute -right-40 top-0 -z-10 opacity-25" />
      <app-svg-one
        addClass="pointer-events-none absolute bottom-24 left-8 -z-10 h-[120px] w-[120px] rotate-12 opacity-20" />
      <app-svg-one
        addClass="pointer-events-none absolute right-[14%] top-[26%] -z-10 h-[90px] w-[90px] -rotate-6 opacity-15" />

      <!-- breathing centre glow -->
      <div
        class="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true">
        <div #glow class="portrait-glow h-[620px] w-[620px]"></div>
      </div>

      <!-- rotating radar rings -->
      <div
        class="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true">
        <svg
          #radar
          class="h-[720px] w-[720px] text-signal/20"
          viewBox="0 0 720 720"
          fill="none">
          <circle cx="360" cy="360" r="140" stroke="currentColor" stroke-width="1" stroke-dasharray="3 9" />
          <circle cx="360" cy="360" r="240" stroke="currentColor" stroke-width="1" stroke-dasharray="3 9" />
          <circle cx="360" cy="360" r="340" stroke="currentColor" stroke-width="1" stroke-dasharray="3 9" />
          <line x1="360" y1="360" x2="360" y2="20" stroke="currentColor" stroke-width="1" />
          <circle cx="360" cy="120" r="4" fill="currentColor" />
          <circle cx="486" cy="274" r="3" fill="currentColor" />
          <circle cx="360" cy="360" r="5" fill="currentColor" opacity="0.5" />
        </svg>
      </div>

      <!-- signal trace above the name -->
      <svg
        class="pointer-events-none absolute left-1/2 top-[20%] h-16 w-[min(760px,88vw)] -translate-x-1/2 text-signal/50"
        viewBox="0 0 600 120"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true">
        <path
          #signalPath
          d="M0 60 H600"
          pathLength="1"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round" />
        <line #tick x1="48" y1="48" x2="48" y2="72" stroke="currentColor" stroke-width="1.5" />
        <line #tick x1="96" y1="54" x2="96" y2="66" stroke="currentColor" stroke-width="1.5" />
        <line #tick x1="144" y1="42" x2="144" y2="78" stroke="currentColor" stroke-width="1.5" />
        <line #tick x1="216" y1="52" x2="216" y2="68" stroke="currentColor" stroke-width="1.5" />
        <line #tick x1="264" y1="44" x2="264" y2="76" stroke="currentColor" stroke-width="1.5" />
        <line #tick x1="336" y1="52" x2="336" y2="68" stroke="currentColor" stroke-width="1.5" />
        <line #tick x1="408" y1="40" x2="408" y2="80" stroke="currentColor" stroke-width="1.5" />
        <line #tick x1="456" y1="54" x2="456" y2="66" stroke="currentColor" stroke-width="1.5" />
        <line #tick x1="504" y1="46" x2="504" y2="74" stroke="currentColor" stroke-width="1.5" />
        <line #tick x1="552" y1="52" x2="552" y2="68" stroke="currentColor" stroke-width="1.5" />
        <circle #signalDot cx="600" cy="60" r="3" fill="currentColor" />
      </svg>

      <!-- centre content -->
      <div
        class="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 py-28 text-center">
        <p
          #eyebrow
          class="mb-7 flex items-center gap-3 font-mono text-sm tracking-[0.25em] text-signal">
          <span class="h-2 w-2 animate-pulse rounded-full bg-signal"></span>
          FULL-STACK DEVELOPER
          <span #caret class="inline-block h-4 w-2 animate-pulse bg-signal"></span>
        </p>

        <h1
          class="font-display text-6xl font-bold leading-[0.95] tracking-tight text-chalk sm:text-7xl xl:text-8xl">
          <span class="block">
            @for (c of firstLetters; track $index) {
              <span #letter class="inline-block will-change-transform">{{ c }}</span>
            }
          </span>
          <span class="block text-signal">
            @for (c of lastLetters; track $index) {
              <span #letter class="inline-block will-change-transform">{{ c }}</span>
            }
          </span>
        </h1>

        <p #lede class="mt-7 max-w-2xl text-lg leading-relaxed text-sage sm:text-xl">
          I design and build fast, dependable web applications end to end — Angular on
          the front, NestJS and Firebase behind — and I write about what I learn along
          the way.
        </p>

        <p #status class="mt-4 font-mono text-sm text-sage/80">
          <span
            class="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-signal align-middle"></span>
          now — {{ currentStatus }}
        </p>

        <div #actions class="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            routerLink="/blog"
            class="rounded-full bg-signal px-7 py-3 font-mono text-sm font-bold text-pitch transition-transform hover:-translate-y-0.5">
            read the blog
          </a>
          <a
            href="#connect"
            class="rounded-full border border-line px-7 py-3 font-mono text-sm text-chalk transition-colors hover:border-signal/50 hover:text-signal">
            let's connect
          </a>
        </div>

        <div #socials class="mt-10">
          <app-page-welcome-hero-socials />
        </div>
      </div>

      <!-- scroll cue -->
      <a
        #scrollCue
        href="#stack"
        class="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-sage/70 transition-colors hover:text-signal sm:flex"
        aria-label="Scroll to stack">
        scroll
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </a>
    </section>
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
export class PageWelcomeHeroComponent {
  readonly firstLetters = ['E', 'd', 'u', 'a', 'r', 'd'];
  readonly lastLetters = ['K', 'r', 'i', 'v', 'a', 'n', 'e', 'k'];
  /** A one-line "currently" status — update whenever you like. */
  readonly currentStatus = 'building modern web apps with Angular + RxJS';

  private readonly glow = viewChild<ElementRef>('glow');
  private readonly radar = viewChild<ElementRef>('radar');
  private readonly signalPath = viewChild<ElementRef>('signalPath');
  private readonly signalDot = viewChild<ElementRef>('signalDot');
  private readonly ticks = viewChildren<ElementRef>('tick');
  private readonly letters = viewChildren<ElementRef>('letter');
  private readonly eyebrow = viewChild<ElementRef>('eyebrow');
  private readonly caret = viewChild<ElementRef>('caret');
  private readonly lede = viewChild<ElementRef>('lede');
  private readonly status = viewChild<ElementRef>('status');
  private readonly actions = viewChild<ElementRef>('actions');
  private readonly socials = viewChild<ElementRef>('socials');
  private readonly scrollCue = viewChild<ElementRef>('scrollCue');

  constructor() {
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const path = this.signalPath()?.nativeElement;
      const tickEls = this.ticks().map(t => t.nativeElement);
      const dot = this.signalDot()?.nativeElement;
      const letterEls = this.letters().map(l => l.nativeElement);
      const radar = this.radar()?.nativeElement;
      const glow = this.glow()?.nativeElement;

      // initial states
      gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(tickEls, { opacity: 0, scaleY: 0, transformOrigin: 'center' });
      gsap.set(dot, { opacity: 0, scale: 0 });
      gsap.set(letterEls, { opacity: 0, y: 42, filter: 'blur(10px)' });
      gsap.set(this.eyebrow()?.nativeElement, { opacity: 0, y: 14 });
      gsap.set(this.caret()?.nativeElement, { opacity: 0 });
      gsap.set(this.lede()?.nativeElement, { opacity: 0, y: 18 });
      gsap.set(this.status()?.nativeElement, { opacity: 0, y: 12 });

      // ambient, continuous motion
      gsap.to(radar, {
        rotation: 360,
        transformOrigin: '50% 50%',
        duration: 48,
        repeat: -1,
        ease: 'none',
      });
      gsap.to(glow, {
        scale: 1.08,
        opacity: 0.85,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      if (dot) {
        gsap.to(dot, {
          scale: 1.6,
          opacity: 0.5,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // intro timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(radar, { opacity: 0, scale: 0.92, duration: 1.2, ease: 'power2.out' })
        .to(path, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, '-=0.6')
        .to(tickEls, { opacity: 1, scaleY: 1, duration: 0.35, stagger: 0.04 }, '-=0.9')
        .to(dot, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '-=0.5')
        .to(this.eyebrow()?.nativeElement, { opacity: 1, y: 0, duration: 0.6 }, '-=0.6')
        .to(this.caret()?.nativeElement, { opacity: 1, duration: 0.4 }, '-=0.4')
        .to(
          letterEls,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.55,
            stagger: 0.045,
            ease: 'power3.out',
          },
          '-=0.4'
        )
        .to(this.lede()?.nativeElement, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .to(this.status()?.nativeElement, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .from(this.actions()?.nativeElement, { opacity: 0, y: 16, duration: 0.6 }, '-=0.45')
        .from(this.socials()?.nativeElement, { opacity: 0, y: 14, duration: 0.6 }, '-=0.45')
        .from(this.scrollCue()?.nativeElement, { opacity: 0, duration: 0.8 }, '-=0.3');
    });
  }
}
