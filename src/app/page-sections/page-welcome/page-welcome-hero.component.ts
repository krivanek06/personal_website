import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import { generateRandomNumber } from './../../shared/utils/general';
import { PageWelcomeHeroSocialsComponent } from './components/page-welcome-hero-socials.component';

@Component({
  selector: 'app-page-welcome-hero',
  imports: [PageWelcomeHeroSocialsComponent],
  template: `
    <section class="relative min-h-screen overflow-hidden bg-black">
      <!-- name and title -->
      <div
        class="relative z-10 mx-auto flex min-h-screen max-w-[1480px] flex-col items-center justify-center gap-y-6 px-4 text-center">
        <!-- my name -->
        <div #name class="text-6xl font-bold text-white md:text-7xl lg:text-8xl">
          <span class="inline-block max-md:text-green-500 md:opacity-0">E</span>
          <span class="inline-block md:opacity-0">d</span>
          <span class="inline-block md:opacity-0">u</span>
          <span class="inline-block md:opacity-0">a</span>
          <span class="inline-block md:opacity-0">r</span>
          <span class="inline-block md:opacity-0">d</span>
          <span class="ml-4 inline-block max-md:text-green-500 md:opacity-0"> K </span>
          <span class="inline-block md:opacity-0">r</span>
          <span class="inline-block md:opacity-0">i</span>
          <span class="inline-block md:opacity-0">v</span>
          <span class="inline-block md:opacity-0">a</span>
          <span class="inline-block md:opacity-0">n</span>
          <span class="inline-block md:opacity-0">e</span>
          <span class="inline-block md:opacity-0">k</span>
        </div>

        <!-- title -->
        <div #title class="text-4xl text-green-600 opacity-0">Full Stack Developer</div>

        <!-- Description -->
        <div #description class="max-w-xl text-xl text-gray-400 opacity-0">
          Specializing in modern web technologies, high-quality, scalable applications and
          creating elegant solutions to complex problems.
        </div>

        <!-- Socials -->
        <div #socials>
          <app-page-welcome-hero-socials />
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-20 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
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
  private readonly name = viewChild<ElementRef>('name');
  private readonly title = viewChild<ElementRef>('title');
  private readonly description = viewChild<ElementRef>('description');
  private readonly socialsComponent = viewChild(PageWelcomeHeroSocialsComponent);

  constructor() {
    afterNextRender(() => {
      // Create main timeline
      const mainTl = gsap.timeline({
        defaults: { duration: 0.8, ease: 'power3.out' },
      });

      // Create name animation timeline
      const nameTl = gsap.timeline();
      const nameChars = (Array.from(this.name()?.nativeElement.children) ??
        []) as HTMLElement[];

      nameChars.forEach(child => {
        // Set initial state for each character
        gsap.set(child, {
          opacity: 0.2,
          y: generateRandomNumber(-200, 200),
          x: generateRandomNumber(-100, 100),
          rotateX: 90,
        });

        // Animate each character
        nameTl.to(
          child,
          {
            opacity: 1,
            y: 0,
            x: 0,
            rotateX: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: 'back.out(1.7)',
          },
          '-=0.2'
        );
      });

      // color every second letter
      nameChars.forEach((child, index) => {
        if (index % 2 === 0) {
          nameTl.to(
            child,
            {
              color: '#22c55e',
              duration: 0.4,
              stagger: 0.1,
            },
            '-=0.2'
          );
        }
      });

      // Continue with the rest of the animations
      mainTl
        .to(this.title()?.nativeElement, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.8,
          ease: 'power2.out',
        })
        .to(this.description()?.nativeElement, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        });

      // animate first social in the component
      this.socialsComponent()
        ?.socials()
        .forEach((social, index) => {
          const xAxis = index === 0 ? -150 : index === 1 ? 0 : 150;
          gsap.set(social.nativeElement, { opacity: 0, y: 50, x: xAxis });

          // Animate each social
          mainTl.to(
            social.nativeElement,
            {
              opacity: 1,
              y: 0,
              x: 0,
              duration: 0.8,
              stagger: 0.2,
              ease: 'power2.out',
            },
            '-=0.2'
          );
        });
    });
  }
}
