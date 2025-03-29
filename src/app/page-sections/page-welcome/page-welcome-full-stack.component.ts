import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardGeneralComponent } from './../../shared/components';

@Component({
  selector: 'app-page-welcome-full-stack',
  imports: [CardGeneralComponent],
  template: `
    <section class="relative z-10 mx-auto w-full p-10 xl:w-[1480px]">
      <h2 class="text-primary-green mb-20 text-center text-5xl">Full Stack Developer</h2>

      <div class="grid grid-cols-2 gap-x-10">
        <p class="mx-auto w-9/12 text-center text-xl">
          Providing comprehensive web development and consulting services to help clients create high-quality
          applications that meet their specific needs and goals
        </p>

        <p class="mx-auto w-9/12 text-center text-xl">
          Building custom web applications, creating an e-commerce platforms, or revamping an existing websites, I have
          the skills and expertise to bring your vision to life
        </p>
      </div>

      <div class="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <!-- Frontend Card -->
        <app-card-general>
          <div class="flex h-full flex-col items-center justify-center p-6 text-center">
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
            <h3 class="mb-4 text-2xl font-bold text-white">Frontend</h3>
            <p class="text-gray-300">Angular, React, TypeScript</p>
            <ul class="mt-4 text-left text-gray-400">
              <li class="mb-2">• Responsive Design</li>
              <li class="mb-2">• Modern UI/UX</li>
              <li class="mb-2">• Performance Optimization</li>
            </ul>
          </div>
        </app-card-general>

        <!-- Backend Card -->
        <app-card-general>
          <div class="flex h-full flex-col items-center justify-center p-6 text-center">
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
            <h3 class="mb-4 text-2xl font-bold text-white">Backend</h3>
            <p class="text-gray-300">Node.js, Express, MongoDB</p>
            <ul class="mt-4 text-left text-gray-400">
              <li class="mb-2">• RESTful APIs</li>
              <li class="mb-2">• Database Design</li>
              <li class="mb-2">• Security Implementation</li>
            </ul>
          </div>
        </app-card-general>

        <!-- DevOps Card -->
        <app-card-general>
          <div class="flex h-full flex-col items-center justify-center p-6 text-center">
            <div class="mb-4 rounded-full bg-green-500/10 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-12 w-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="mb-4 text-2xl font-bold text-white">DevOps</h3>
            <p class="text-gray-300">Docker, AWS, CI/CD</p>
            <ul class="mt-4 text-left text-gray-400">
              <li class="mb-2">• Container Orchestration</li>
              <li class="mb-2">• Cloud Infrastructure</li>
              <li class="mb-2">• Automated Deployment</li>
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
export class PageWelcomeFullStackComponent {}
