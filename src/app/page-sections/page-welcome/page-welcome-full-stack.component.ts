import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardGeneralComponent } from './../../shared/components';

@Component({
  selector: 'app-page-welcome-full-stack',
  imports: [CardGeneralComponent],
  template: `
    <section class="relative z-10 mx-auto w-full p-10 xl:w-[1480px]">
      <h2 class="mb-20 text-center text-5xl">Full Stack Developer</h2>

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

      <div>
        <app-card-general>
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center">
              <h3 class="mb-2 text-xl font-bold">Frontend</h3>
              <p>Angular, React, TypeScript</p>
            </div>
            <div class="text-center">
              <h3 class="mb-2 text-xl font-bold">Backend</h3>
              <p>Node.js, Express, MongoDB</p>
            </div>
            <div class="text-center">
              <h3 class="mb-2 text-xl font-bold">DevOps</h3>
              <p>Docker, AWS, CI/CD</p>
            </div>
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
