import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild,
  viewChildren,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-page-welcome-about-me',
  standalone: true,
  template: `
    <section class="relative z-10 mx-auto w-full p-10 xl:w-[1480px]">
      <div class="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <!-- Left side - Image -->
        <div class="relative">
          <div #imageContainer class="relative h-[700px] overflow-hidden rounded-2xl">
            <img
              #profileImage
              src="me/me-black-white.webp"
              alt="Eduard Krivanek"
              class="h-full w-full object-cover" />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        </div>

        <!-- Right side - Content -->
        <div class="flex flex-col justify-center">
          <div #titleContainer class="mb-8">
            <h2 class="text-primary-green mb-4 text-5xl">About Me</h2>
            <div class="h-1 w-20 bg-white"></div>
          </div>

          <div #contentContainer class="mb-8 space-y-4 text-xl text-gray-300">
            <p>
              I'm Eduard Krivanek, a passionate Full Stack Developer specializing in
              building web application, with a strong focus on Angular, Firebase, NestJs
            </p>

            <p>
              Over the past few years, I've developed applications ranging from financial
              dashboards that generate trading statistics to finance tracking tools and
              ticketing systems for banks. Beyond coding, I share my insights and
              expertise through technical blogs, where I've been writing for over two
              years
            </p>
          </div>

          <div class="space-y-6">
            <div #contentItems class="space-y-4">
              <div class="flex items-start gap-4">
                <div class="mt-1 rounded-full bg-green-500/10 p-2">
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
                  <h3 class="text-xl font-semibold text-white">
                    5+ Years Angular Experience
                  </h3>
                  <p class="text-gray-400">
                    Started in version 8 and since then always kept up with the latest
                    version
                  </p>
                </div>
              </div>

              <div #contentItems class="flex items-start gap-4">
                <div class="mt-1 rounded-full bg-green-500/10 p-2">
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
                  <h3 class="text-xl font-semibold text-white">Fast & Efficient</h3>
                  <p class="text-gray-400">
                    Optimized performance and clean code practices
                  </p>
                </div>
              </div>

              <div #contentItems class="flex items-start gap-4">
                <div class="mt-1 rounded-full bg-green-500/10 p-2">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-white">Team Player</h3>
                  <p class="text-gray-400">
                    Excellent communication and collaboration skills
                  </p>
                </div>
              </div>

              <!-- New Content Item -->
              <div #contentItems class="flex items-start gap-4">
                <div class="mt-1 rounded-full bg-green-500/10 p-2">
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
                      d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-4.41 0-8-1.79-8-4V8c0-2.21 3.59-4 8-4s8 1.79 8 4v6c0 2.21-3.59 4-8 4z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-white">
                    Technical Blogger & Speaker
                  </h3>
                  <p class="text-gray-400">
                    Sharing insights through blogs and tech talks
                  </p>
                </div>
              </div>
            </div>
          </div>
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
export class PageWelcomeAboutMeComponent {
  private readonly imageContainer = viewChild<ElementRef>('imageContainer');
  private readonly profileImage = viewChild<ElementRef>('profileImage');
  private readonly titleContainer = viewChild<ElementRef>('titleContainer');
  private readonly contentContainer = viewChild<ElementRef>('contentContainer');
  private readonly contentItems = viewChildren<ElementRef>('contentItems');

  constructor() {
    afterNextRender(() => {
      // Register ScrollTrigger plugin
      gsap.registerPlugin(ScrollTrigger);

      // Set initial states
      gsap.set(this.imageContainer()?.nativeElement, { opacity: 0, y: 0 });
      gsap.set(this.profileImage()?.nativeElement, { scale: 1 });
      gsap.set(this.titleContainer()?.nativeElement, { opacity: 0, y: 50 });
      gsap.set(this.contentContainer()?.nativeElement, { opacity: 0, y: 30 });
      this.contentItems().forEach(item => {
        gsap.set(item.nativeElement, { opacity: 0, x: 100 });
      });

      // Create a timeline for the image section
      const imageTl = gsap.timeline({
        scrollTrigger: {
          trigger: this.imageContainer()?.nativeElement,
          start: 'top 70%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
          once: true,
        },
      });

      // Animate the image container
      imageTl
        .to(this.imageContainer()?.nativeElement, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
        })
        .to(
          this.profileImage()?.nativeElement,
          {
            scale: 1,
            duration: 1.5,
            ease: 'power2.out',
          },
          '-=0.5'
        );

      // Create a timeline for the content section
      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: this.titleContainer()?.nativeElement,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
          once: true,
        },
      });

      // Animate the title
      contentTl.to(this.titleContainer()?.nativeElement, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // Animate the content items with stagger
      contentTl.to(
        this.contentContainer()?.nativeElement,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
        },
        '-=0.3'
      );

      // animate container items
      this.contentItems().forEach((item, index) => {
        contentTl.to(item.nativeElement, {
          opacity: 1,
          x: 0,
          duration: 0.3,
          stagger: 0.2,
          ease: 'power2.out',
        });
      });
    });
  }
}
