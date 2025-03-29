import { NgOptimizedImage } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { PageWelcomeHeroSocialsComponent } from './components/page-welcome-hero-socials.component';

@Component({
  selector: 'app-page-welcome-hero',
  imports: [NgOptimizedImage, PageWelcomeHeroSocialsComponent],
  template: `
    <section class="relative min-h-screen overflow-hidden bg-black">
      <!-- name and title -->
      <div class="relative z-10 mx-auto flex min-h-screen max-w-[1480px] items-center justify-center px-4">
        <div class="flex flex-col items-center text-center md:items-start md:text-left lg:ml-[-30%]">
          <div #greeting class="text-xl font-medium text-green-500 opacity-0">Hello, I'm</div>
          <div #name class="text-6xl leading-tight font-bold text-white md:text-7xl lg:text-8xl">
            <span class="inline-block opacity-0">E</span>
            <span class="inline-block opacity-0">d</span>
            <span class="inline-block opacity-0">u</span>
            <span class="inline-block opacity-0">a</span>
            <span class="inline-block opacity-0">r</span>
            <span class="inline-block opacity-0">d</span>
            <span class="ml-4 inline-block opacity-0">K</span>
            <span class="inline-block opacity-0">r</span>
            <span class="inline-block opacity-0">i</span>
            <span class="inline-block opacity-0">v</span>
            <span class="inline-block opacity-0">a</span>
            <span class="inline-block opacity-0">n</span>
            <span class="inline-block opacity-0">e</span>
            <span class="inline-block opacity-0">k</span>
          </div>
          <div #title class="text-2xl text-gray-400 opacity-0">Full Stack Web Developer</div>
          <div #description class="max-w-xl text-lg text-gray-300 opacity-0">
            Specializing in modern web technologies, delivering high-quality, scalable applications and creating elegant
            solutions to complex problems.
          </div>
          <div #socials class="mt-8 opacity-0">
            <app-page-welcome-hero-socials />
          </div>
        </div>
      </div>

      <!-- Image -->
      <div
        #imageContainer
        class="absolute top-[60px] right-[140px] aspect-square w-full max-w-[750px] overflow-hidden rounded-2xl opacity-0">
        <img
          #heroImage
          priority
          ngSrc="me/me-hero_3.webp"
          width="1000"
          height="1000"
          class="h-full w-full object-cover"
          alt="Eduard Krivanek" />
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-20 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
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
  private readonly greeting = viewChild<ElementRef>('greeting');
  private readonly name = viewChild<ElementRef>('name');
  private readonly title = viewChild<ElementRef>('title');
  private readonly description = viewChild<ElementRef>('description');
  private readonly socials = viewChild<ElementRef>('socials');
  private readonly imageContainer = viewChild<ElementRef>('imageContainer');
  private readonly heroImage = viewChild<ElementRef>('heroImage');

  constructor() {
    afterNextRender(() => {
      // Create main timeline
      const mainTl = gsap.timeline({
        defaults: { duration: 0.8, ease: 'power3.out' },
      });

      // Animate the greeting
      mainTl.to(this.greeting()?.nativeElement, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      });

      // Create name animation timeline
      const nameTl = gsap.timeline();
      const nameChars = this.name()?.nativeElement.children;

      if (nameChars) {
        // Initial state for all characters
        gsap.set(nameChars, {
          opacity: 0,
          y: 50,
          rotateX: -90,
        });

        // Animate each character
        nameTl.to(nameChars, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.7)',
        });

        // Special effects for first letters
        nameTl.to(
          [nameChars[0], nameChars[6]],
          {
            color: '#22c55e',
            duration: 0.5,
            stagger: 0.1,
          },
          '-=0.3'
        );

        // Wave effect for middle characters of first name
        nameTl.to(
          [nameChars[2], nameChars[3], nameChars[4]],
          {
            y: -20,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
          },
          '-=0.3'
        );

        // last name
        nameTl.to(
          [nameChars[6]],
          {
            scale: 1.1,
            rotate: 7,
            duration: 0.3,
            stagger: 0.1,
            ease: 'elastic.out(1, 0.3)',
          },
          '-=0.2'
        );

        nameTl.to(
          [nameChars[0]],
          {
            scale: 1.1,
            rotate: -7,
            duration: 0.3,
            stagger: 0.1,
            ease: 'elastic.out(1, 0.3)',
          },
          '-=0.2'
        );
      }

      // Continue with the rest of the animations
      mainTl
        .to(this.title()?.nativeElement, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        })
        .to(this.description()?.nativeElement, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        })
        .to(this.socials()?.nativeElement, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        });

      // Image animation timeline
      const imageTl = gsap.timeline({
        defaults: { duration: 1.2, ease: 'power3.out' },
      });

      imageTl
        .to(this.imageContainer()?.nativeElement, {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: 'power2.out',
        })
        .to(
          this.heroImage()?.nativeElement,
          {
            scale: 1.1,
            duration: 1.5,
            ease: 'power2.out',
          },
          '-=0.5'
        );
    });
  }
}
