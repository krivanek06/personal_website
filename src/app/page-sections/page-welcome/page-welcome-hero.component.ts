import { NgOptimizedImage } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { PageWelcomeHeroSocialsComponent } from './components/page-welcome-hero-socials.component';

@Component({
  selector: 'app-page-welcome-hero',
  imports: [NgOptimizedImage, PageWelcomeHeroSocialsComponent],
  template: `
    <section class="relative h-screen">
      <!-- info about me -->
      <div class="relative z-10 ml-[160px] pt-[15%]">
        <div #name class="text-8xl opacity-0">Eduard Krivanek</div>
        <div #title class="text-2xl text-gray-400 opacity-0">Full Stack Web Developer</div>
        <div #description class="mt-4 max-w-xl text-gray-300 opacity-0">
          Passionate about creating elegant solutions to complex problems. Specializing in modern web technologies and
          delivering high-quality, scalable applications.
        </div>
        <div #socials class="mt-8 opacity-0">
          <app-page-welcome-hero-socials />
        </div>
      </div>

      <img
        #heroImage
        priority
        ngSrc="me/me-hero_2.webp"
        width="1000"
        height="1000"
        class="absolute top-0 right-0 opacity-0" />
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
  private readonly socials = viewChild<ElementRef>('socials');
  private readonly heroImage = viewChild<ElementRef>('heroImage');

  constructor() {
    afterNextRender(() => {
      // Create a timeline for sequential animations
      const tl = gsap.timeline({
        defaults: { duration: 1, ease: 'power3.out' },
      });

      // Animate the hero image first
      tl.to(this.heroImage()?.nativeElement, {
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out',
      })
        // Then animate the name
        .to(
          this.name()?.nativeElement,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
          },
          '-=0.5'
        ) // Start slightly before the previous animation ends
        // Animate the title
        .to(
          this.title()?.nativeElement,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.3'
        )
        // Animate the description
        .to(
          this.description()?.nativeElement,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.3'
        )
        // Finally animate the socials
        .to(
          this.socials()?.nativeElement,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.3'
        );
    });
  }
}
