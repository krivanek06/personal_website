import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CardGeneralComponent } from '../../shared/components';
import { URL_LINKED_IN } from './model';

@Component({
  selector: 'app-page-welcome-connect',
  standalone: true,
  imports: [CardGeneralComponent],
  template: `
    <section class="relative z-10 mx-auto w-full p-10 xl:w-[1480px]">
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/10 to-blue-500/10 p-8 md:p-12">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/20 via-transparent to-transparent"></div>
        </div>

        <div class="relative grid gap-8 md:grid-cols-2">
          <!-- Left side - Content -->
          <div class="flex flex-col justify-center">
            <div #titleContainer class="mb-6">
              <h2 class="mb-4 text-5xl">Let's Connect</h2>
              <p class="text-xl text-gray-300">
                Ready to bring your ideas to life? Let's discuss how we can work together to create something amazing.
              </p>
            </div>

            <div #contactContainer class="space-y-6">
              <!-- Experience -->
              <div class="flex items-center gap-4">
                <div class="rounded-full bg-green-500/10 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-white">5+ Years Experience</h3>
                  <p class="text-gray-400">Building scalable web applications</p>
                </div>
              </div>

              <!-- Expertise -->
              <div class="flex items-center gap-4">
                <div class="rounded-full bg-green-500/10 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-white">Full Stack Expertise</h3>
                  <p class="text-gray-400">Frontend, Backend & DevOps</p>
                </div>
              </div>

              <!-- Projects -->
              <div class="flex items-center gap-4">
                <div class="rounded-full bg-green-500/10 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-white">Diverse Project Portfolio</h3>
                  <p class="text-gray-400">From startups to enterprise solutions</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right side - Call to Action -->
          <app-card-general class="self-center">
            <div #ctaContainer class="flex flex-col items-center justify-center rounded-2xl p-8">
              <div class="mb-6 text-center">
                <h3 class="mb-4 text-2xl font-bold text-white">Ready to Start Your Project?</h3>
                <p class="text-gray-300">
                  Let's connect on LinkedIn to discuss your project requirements and how I can help bring your vision to
                  life.
                </p>
              </div>

              <a
                [href]="URL_LINKED_IN"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex items-center gap-3 rounded-lg bg-green-500 px-8 py-4 text-white transition-all hover:bg-green-600">
                <svg viewBox="0 0 24 24" class="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22 3.47059V20.5294C22 20.9194 21.8451 21.2935 21.5693 21.5693C21.2935 21.8451 20.9194 22 20.5294 22H3.47059C3.08056 22 2.70651 21.8451 2.43073 21.5693C2.15494 21.2935 2 20.9194 2 20.5294V3.47059C2 3.08056 2.15494 2.70651 2.43073 2.43073C2.70651 2.15494 3.08056 2 3.47059 2H20.5294C20.9194 2 21.2935 2.15494 21.5693 2.43073C21.8451 2.70651 22 3.08056 22 3.47059ZM7.88235 9.64706H4.94118V19.0588H7.88235V9.64706ZM8.14706 6.41177C8.14861 6.18929 8.10632 5.96869 8.02261 5.76255C7.93891 5.55642 7.81542 5.36879 7.65919 5.21039C7.50297 5.05198 7.31708 4.92589 7.11213 4.83933C6.90718 4.75277 6.68718 4.70742 6.46471 4.70588H6.41177C5.95934 4.70588 5.52544 4.88561 5.20552 5.20552C4.88561 5.52544 4.70588 5.95934 4.70588 6.41177C4.70588 6.86419 4.88561 7.29809 5.20552 7.61801C5.52544 7.93792 5.95934 8.11765 6.41177 8.11765C6.63426 8.12312 6.85565 8.0847 7.06328 8.00458C7.27092 7.92447 7.46074 7.80422 7.62189 7.65072C7.78304 7.49722 7.91237 7.31346 8.00248 7.10996C8.09259 6.90646 8.14172 6.6872 8.14706 6.46471V6.41177ZM19.0588 13.3412C19.0588 10.5118 17.2588 9.41177 15.4706 9.41177C14.8851 9.38245 14.3021 9.50715 13.7799 9.77345C13.2576 10.0397 12.8143 10.4383 12.4941 10.9294H12.4118V9.64706H9.64706V19.0588H12.5882V14.0529C12.5457 13.5403 12.7072 13.0315 13.0376 12.6372C13.3681 12.2429 13.8407 11.9949 14.3529 11.9471H14.4647C15.4 11.9471 16.0941 12.5353 16.0941 14.0176V19.0588H19.0353L19.0588 13.3412Z" />
                </svg>
                <span class="text-lg font-semibold">Connect on LinkedIn</span>
              </a>
            </div>
          </app-card-general>
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
export class PageWelcomeConnectComponent {
  private readonly titleContainer = viewChild<ElementRef>('titleContainer');
  private readonly contactContainer = viewChild<ElementRef>('contactContainer');
  private readonly ctaContainer = viewChild<ElementRef>('ctaContainer');

  readonly URL_LINKED_IN = URL_LINKED_IN;

  constructor() {
    afterNextRender(() => {
      // Register ScrollTrigger plugin
      gsap.registerPlugin(ScrollTrigger);

      // Set initial states
      gsap.set(this.titleContainer()?.nativeElement, { opacity: 0, y: 30 });
      gsap.set(this.contactContainer()?.nativeElement.children, { opacity: 0, x: -30 });
      gsap.set(this.ctaContainer()?.nativeElement, { opacity: 0, x: 30 });

      // Create a timeline for the connect section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: this.titleContainer()?.nativeElement,
          start: 'top 90%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
          once: true,
        },
      });

      // Animate the title
      tl.to(this.titleContainer()?.nativeElement, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Animate the contact information
      tl.to(
        this.contactContainer()?.nativeElement.children,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
        },
        '-=0.3'
      );

      // Animate the CTA section
      tl.to(
        this.ctaContainer()?.nativeElement,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.3'
      );
    });
  }
}
