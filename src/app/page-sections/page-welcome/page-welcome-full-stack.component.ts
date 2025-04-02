import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CardGeneralComponent } from './../../shared/components';

@Component({
  selector: 'app-page-welcome-full-stack',
  imports: [CardGeneralComponent],
  template: `
    <section class="relative z-10 mx-auto w-full p-10 xl:w-[1480px]">
      <h2 class="text-primary-green mb-20 text-center text-5xl">Full Stack Developer</h2>

      <div class="grid grid-cols-2 gap-x-10">
        <p class="mx-auto w-9/12 text-center text-xl">
          Providing comprehensive web development and consulting services to help clients
          create high-quality applications that meet their specific needs and goals.
        </p>

        <p class="mx-auto w-9/12 text-center text-xl">
          Whether building custom web applications, creating e-commerce platforms, or
          revamping existing websites, I have the skills and expertise to bring your
          vision to life.
        </p>
      </div>

      <div #cardGrid class="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2">
        <!-- Frontend Card -->
        <app-card-general>
          <div
            #cardElement1
            class="flex h-full flex-col items-center justify-center p-6 text-center transition-transform duration-300">
            <div class="mb-4 rounded-full bg-green-500/10 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-12 w-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="mb-2 text-2xl font-bold text-white">Frontend</h3>
            <p class="mb-4 text-lg text-gray-300">Angular, React, TypeScript</p>
            <ul class="mt-4 text-left text-gray-400">
              <li class="mb-2">
                • Responsive Design: Crafting interfaces that adapt seamlessly to any
                device size.
              </li>
              <li class="mb-2">
                • Modern UI/UX: Implementing intuitive and engaging user experiences.
              </li>
              <li class="mb-2">
                • Performance Optimization: Ensuring fast load times and smooth
                interactions.
              </li>
            </ul>
          </div>
        </app-card-general>

        <!-- Backend Card -->
        <app-card-general>
          <div
            #cardElement2
            class="flex h-full flex-col items-center justify-center p-6 text-center transition-transform duration-300">
            <div class="mb-4 rounded-full bg-green-500/10 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-12 w-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <h3 class="mb-2 text-2xl font-bold text-white">Backend</h3>
            <p class="mb-4 text-lg text-gray-300">Node.js, Express, MongoDB</p>
            <ul class="mt-4 text-left text-gray-400">
              <li class="mb-2">
                • RESTful APIs: Designing robust and scalable API endpoints.
              </li>
              <li class="mb-2">
                • Database Design: Structuring data for efficiency and reliability.
              </li>
              <li class="mb-2">
                • Security Implementation: Protecting applications with best security
                practices.
              </li>
            </ul>
          </div>
        </app-card-general>
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
export class PageWelcomeFullStackComponent {
  private readonly cardGrid = viewChild<ElementRef>('cardGrid');
  private readonly cardElement1 = viewChild<ElementRef>('cardElement1');
  private readonly cardElement2 = viewChild<ElementRef>('cardElement2');

  constructor() {
    afterNextRender(() => {
      // Register the ScrollTrigger plugin
      gsap.registerPlugin(ScrollTrigger);

      // Create a timeline for the technology grid
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: this.cardGrid()?.nativeElement,
          start: 'top 75%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
          once: true,
          markers: false,
        },
      });

      const cardElement1 = this.cardElement1();
      const cardElement2 = this.cardElement2();

      if (cardElement1 && cardElement2) {
        // Animate both cards simultaneously
        this.initCardAnimations(tl, cardElement1, cardElement2);
      }
    });
  }

  private initCardAnimations(tl: gsap.core.Timeline, ...cards: ElementRef[]) {
    cards.forEach(card => {
      // Set initial state
      gsap.set(card.nativeElement, {
        opacity: 0,
      });

      // Animate to final state
      tl.to(
        card.nativeElement,
        {
          opacity: 1,
          duration: 1,
        },
        0
      ); // Start both animations at the same time

      // Animate the bullet points
      const bulletPoints = card.nativeElement.querySelectorAll('li');
      bulletPoints.forEach((bullet: Element, bulletIndex: number) => {
        tl.from(
          bullet,
          {
            opacity: 0,
            x: -20,
          },
          0.5
        ); // Start bullet animations after card animations

        tl.to(
          bullet,
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            delay: bulletIndex * 0.2,
          },
          '-=0.1'
        );
      });
    });
  }
}
