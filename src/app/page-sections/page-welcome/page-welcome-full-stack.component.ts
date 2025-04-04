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
    <section class="relative z-10 mx-auto w-full p-6 lg:p-10 xl:w-[1480px]">
      <h2 class="text-primary-green mb-10 text-center text-4xl lg:mb-20 lg:text-5xl">
        Full Stack Developer
      </h2>

      <div #cardGrid class="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2">
        <!-- Frontend Card -->
        <app-card-general additionalClasses="p-4 h-full">
          <div
            #cardElement1
            class="flex h-full flex-col items-center p-6 text-center transition-transform duration-300">
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
            <p class="mb-4 text-lg text-gray-300">Angular | RxJS | TypeScript</p>
            <p class="mx-auto w-11/12 text-left text-lg max-sm:hidden">
              I specialize in Angular development, CSR and SSR, creating scalable and
              high-performance web applications. Engaging with product owners for the best
              result, suggesting technical improvements, unit testing, and ensuring the
              best quality.
            </p>

            <ul
              class="mt-4 text-left text-gray-400 [&>li]:mb-2 [&>li]:inline-flex [&>li]:gap-2">
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 fill-green-500"
                  viewBox="0 0 30 30">
                  <path
                    d="M 15 3 C 8.373 3 3 8.373 3 15 C 3 21.627 8.373 27 15 27 C 21.627 27 27 21.627 27 15 C 27 12.820623 26.409997 10.783138 25.394531 9.0214844 L 14.146484 20.267578 C 13.959484 20.454578 13.705453 20.560547 13.439453 20.560547 C 13.174453 20.560547 12.919422 20.455578 12.732422 20.267578 L 8.2792969 15.814453 C 7.8882969 15.423453 7.8882969 14.791391 8.2792969 14.400391 C 8.6702969 14.009391 9.3023594 14.009391 9.6933594 14.400391 L 13.439453 18.146484 L 24.240234 7.3457031 C 22.039234 4.6907031 18.718 3 15 3 z M 24.240234 7.3457031 C 24.671884 7.8662808 25.053743 8.4300516 25.394531 9.0195312 L 27.707031 6.7070312 C 28.098031 6.3150312 28.098031 5.6839688 27.707031 5.2929688 C 27.316031 4.9019687 26.683969 4.9019688 26.292969 5.2929688 L 24.240234 7.3457031 z"></path>
                </svg>
                <div>
                  <span class="text-white">Performance Optimization:</span>
                  lazy routing, tree shaking, defer blocks, change detection optimization
                </div>
              </li>

              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 fill-green-500"
                  viewBox="0 0 30 30">
                  <path
                    d="M 15 3 C 8.373 3 3 8.373 3 15 C 3 21.627 8.373 27 15 27 C 21.627 27 27 21.627 27 15 C 27 12.820623 26.409997 10.783138 25.394531 9.0214844 L 14.146484 20.267578 C 13.959484 20.454578 13.705453 20.560547 13.439453 20.560547 C 13.174453 20.560547 12.919422 20.455578 12.732422 20.267578 L 8.2792969 15.814453 C 7.8882969 15.423453 7.8882969 14.791391 8.2792969 14.400391 C 8.6702969 14.009391 9.3023594 14.009391 9.6933594 14.400391 L 13.439453 18.146484 L 24.240234 7.3457031 C 22.039234 4.6907031 18.718 3 15 3 z M 24.240234 7.3457031 C 24.671884 7.8662808 25.053743 8.4300516 25.394531 9.0195312 L 27.707031 6.7070312 C 28.098031 6.3150312 28.098031 5.6839688 27.707031 5.2929688 C 27.316031 4.9019687 26.683969 4.9019688 26.292969 5.2929688 L 24.240234 7.3457031 z"></path>
                </svg>
                <div>
                  <span class="text-white">Project Architecture: </span>
                  logically splitting application parts into modules/libraries using NX
                  monorepo, NgRx storage or apollo-client
                </div>
              </li>

              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 fill-green-500"
                  viewBox="0 0 30 30">
                  <path
                    d="M 15 3 C 8.373 3 3 8.373 3 15 C 3 21.627 8.373 27 15 27 C 21.627 27 27 21.627 27 15 C 27 12.820623 26.409997 10.783138 25.394531 9.0214844 L 14.146484 20.267578 C 13.959484 20.454578 13.705453 20.560547 13.439453 20.560547 C 13.174453 20.560547 12.919422 20.455578 12.732422 20.267578 L 8.2792969 15.814453 C 7.8882969 15.423453 7.8882969 14.791391 8.2792969 14.400391 C 8.6702969 14.009391 9.3023594 14.009391 9.6933594 14.400391 L 13.439453 18.146484 L 24.240234 7.3457031 C 22.039234 4.6907031 18.718 3 15 3 z M 24.240234 7.3457031 C 24.671884 7.8662808 25.053743 8.4300516 25.394531 9.0195312 L 27.707031 6.7070312 C 28.098031 6.3150312 28.098031 5.6839688 27.707031 5.2929688 C 27.316031 4.9019687 26.683969 4.9019688 26.292969 5.2929688 L 24.240234 7.3457031 z"></path>
                </svg>
                <div>
                  <span class="text-white">Responsive Design: </span>
                  desktop and mobile development, using UI libraries like Angular Material
                  and Tailwind
                </div>
              </li>
            </ul>
          </div>
        </app-card-general>

        <!-- Backend Card -->
        <app-card-general additionalClasses="p-4 h-full">
          <div
            #cardElement2
            class="flex h-full flex-col items-center p-6 text-center transition-transform duration-300">
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
            <p class="mb-4 text-lg text-gray-300">NestJS, Firebase, MongoDB</p>
            <p class="mx-auto w-11/12 text-left text-lg max-sm:hidden">
              Skilled in build RESTful or GraphQL API services using NestJS, but
              personally preferring Firebase for real-time data updates. Using ORMs like
              Prisma. Cloudflare for CDN and caching, testing using Jest and deploying
              mainly on Google Cloud Platform.
            </p>

            <ul
              class="mt-4 text-left text-gray-400 [&>li]:mb-2 [&>li]:inline-flex [&>li]:gap-2">
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 fill-green-500"
                  viewBox="0 0 30 30">
                  <path
                    d="M 15 3 C 8.373 3 3 8.373 3 15 C 3 21.627 8.373 27 15 27 C 21.627 27 27 21.627 27 15 C 27 12.820623 26.409997 10.783138 25.394531 9.0214844 L 14.146484 20.267578 C 13.959484 20.454578 13.705453 20.560547 13.439453 20.560547 C 13.174453 20.560547 12.919422 20.455578 12.732422 20.267578 L 8.2792969 15.814453 C 7.8882969 15.423453 7.8882969 14.791391 8.2792969 14.400391 C 8.6702969 14.009391 9.3023594 14.009391 9.6933594 14.400391 L 13.439453 18.146484 L 24.240234 7.3457031 C 22.039234 4.6907031 18.718 3 15 3 z M 24.240234 7.3457031 C 24.671884 7.8662808 25.053743 8.4300516 25.394531 9.0195312 L 27.707031 6.7070312 C 28.098031 6.3150312 28.098031 5.6839688 27.707031 5.2929688 C 27.316031 4.9019687 26.683969 4.9019688 26.292969 5.2929688 L 24.240234 7.3457031 z"></path>
                </svg>
                <div>
                  <span class="text-white">API design: </span>
                  experience in both working on RESTful and GraphQL APIs, using NestJS or
                  Firebase
                </div>
              </li>

              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 fill-green-500"
                  viewBox="0 0 30 30">
                  <path
                    d="M 15 3 C 8.373 3 3 8.373 3 15 C 3 21.627 8.373 27 15 27 C 21.627 27 27 21.627 27 15 C 27 12.820623 26.409997 10.783138 25.394531 9.0214844 L 14.146484 20.267578 C 13.959484 20.454578 13.705453 20.560547 13.439453 20.560547 C 13.174453 20.560547 12.919422 20.455578 12.732422 20.267578 L 8.2792969 15.814453 C 7.8882969 15.423453 7.8882969 14.791391 8.2792969 14.400391 C 8.6702969 14.009391 9.3023594 14.009391 9.6933594 14.400391 L 13.439453 18.146484 L 24.240234 7.3457031 C 22.039234 4.6907031 18.718 3 15 3 z M 24.240234 7.3457031 C 24.671884 7.8662808 25.053743 8.4300516 25.394531 9.0195312 L 27.707031 6.7070312 C 28.098031 6.3150312 28.098031 5.6839688 27.707031 5.2929688 C 27.316031 4.9019687 26.683969 4.9019688 26.292969 5.2929688 L 24.240234 7.3457031 z"></path>
                </svg>
                <div>
                  <span class="text-white">Monitoring: </span>
                  using Google Cloud Platform, Firebase and Sentry for error tracking,
                  kibana for logs, and Grafana for performance tracking
                </div>
              </li>

              <li class="mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 fill-green-500"
                  viewBox="0 0 30 30">
                  <path
                    d="M 15 3 C 8.373 3 3 8.373 3 15 C 3 21.627 8.373 27 15 27 C 21.627 27 27 21.627 27 15 C 27 12.820623 26.409997 10.783138 25.394531 9.0214844 L 14.146484 20.267578 C 13.959484 20.454578 13.705453 20.560547 13.439453 20.560547 C 13.174453 20.560547 12.919422 20.455578 12.732422 20.267578 L 8.2792969 15.814453 C 7.8882969 15.423453 7.8882969 14.791391 8.2792969 14.400391 C 8.6702969 14.009391 9.3023594 14.009391 9.6933594 14.400391 L 13.439453 18.146484 L 24.240234 7.3457031 C 22.039234 4.6907031 18.718 3 15 3 z M 24.240234 7.3457031 C 24.671884 7.8662808 25.053743 8.4300516 25.394531 9.0195312 L 27.707031 6.7070312 C 28.098031 6.3150312 28.098031 5.6839688 27.707031 5.2929688 C 27.316031 4.9019687 26.683969 4.9019688 26.292969 5.2929688 L 24.240234 7.3457031 z"></path>
                </svg>
                <div>
                  <span class="text-white">Testing: </span>
                  using Jest for unit testing, and Postman for API testing, then common
                  tools such as eslint, prettier, husky, lint-staged for code quality
                </div>
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
      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: this.cardGrid()?.nativeElement,
          start: 'top 65%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
          once: true,
          markers: false,
        },
      });

      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: this.cardGrid()?.nativeElement,
          start: 'top 65%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
          once: true,
          markers: false,
        },
      });

      const cardElement1 = this.cardElement1();
      const cardElement2 = this.cardElement2();

      if (cardElement1) {
        this.initCardAnimations(tl1, cardElement1);
      }

      if (cardElement2) {
        this.initCardAnimations(tl2, cardElement2);
      }
    });
  }

  private initCardAnimations(tl: gsap.core.Timeline, card: ElementRef) {
    // set initial header animation
    const header = card.nativeElement.querySelector('h3');
    gsap.set(header, {
      opacity: 0,
      y: 20,
      delay: 0.2,
    });
    tl.to(header, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
    });

    // set initial paragraph animation
    const paragraph = card.nativeElement.querySelector('p');
    gsap.set(paragraph, {
      opacity: 0,
      y: 20,
      delay: 0.4,
    });
    tl.to(paragraph, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
    });

    // set second paragraph animation
    const secondParagraph = card.nativeElement.querySelector('p:nth-of-type(2)');
    gsap.set(secondParagraph, {
      opacity: 0,
      y: 20,
      delay: 0.6,
    });
    tl.to(secondParagraph, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
    });

    // Animate the bullet points
    const bulletPoints = card.nativeElement.querySelectorAll('li');
    bulletPoints.forEach((bullet: Element, bulletIndex: number) => {
      tl.from(
        bullet,
        {
          opacity: 0,
          x: -20,
          delay: 1.2,
        },
        0.6 + bulletIndex * 0.5
      ); // Start bullet animations after card animations

      tl.to(bullet, {
        opacity: 1,
        x: 0,
        duration: 0.4,
        delay: bulletIndex * 0.4,
      });
    });
  }
}
