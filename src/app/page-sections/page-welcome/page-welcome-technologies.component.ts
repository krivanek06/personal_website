import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-page-welcome-technologies',
  standalone: true,
  template: `
    <section class="relative z-10 mx-auto w-full p-10 xl:w-[1480px]">
      <div class="mb-20 text-center">
        <h2 class="mb-4 text-5xl">Technologies</h2>
        <p class="mx-auto max-w-2xl text-xl text-gray-400">
          A comprehensive stack of technologies I work with to create modern web applications
        </p>
      </div>

      <!-- Technology Grid -->
      <div #techGrid class="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        @for (tech of technologies; track tech.name) {
          <div
            #techItem
            class="group flex flex-col items-center justify-center rounded-xl bg-white/5 p-6 transition-all duration-300 hover:bg-white/10">
            <div class="mb-4 h-16 w-16">
              <img [src]="tech.icon" [alt]="tech.name" class="h-full w-full object-contain" width="64" height="64" />
            </div>
            <span class="text-center text-sm text-gray-400 transition-colors group-hover:text-white">
              {{ tech.name }}
            </span>
          </div>
        }
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
export class PageWelcomeTechnologiesComponent {
  private readonly techGrid = viewChild<ElementRef>('techGrid');

  protected readonly technologies = [
    // Frontend
    { name: 'Angular', icon: 'tech/angular.png', category: 'frontend' },
    { name: 'TypeScript', icon: 'tech/typescript.png', category: 'frontend' },
    { name: 'Tailwind', icon: 'tech/tailwind.png', category: 'frontend' },
    { name: 'RxJs', icon: 'tech/rxjs.png', category: 'frontend' },

    // Backend
    { name: 'NodeJS', icon: 'tech/nodejs.png', category: 'backend' },
    { name: 'NestJS', icon: 'tech/nestjs.png', category: 'backend' },
    { name: 'Typescript', icon: 'tech/typescript.png', category: 'backend' },
    { name: 'GraphQL', icon: 'tech/graphql.png', category: 'backend' },

    // // Database
    // { name: 'MongoDB', icon: 'tech/mongodb.svg', category: 'database' },
    // { name: 'PostgreSQL', icon: 'tech/postgresql.svg', category: 'database' },
    // { name: 'Redis', icon: 'tech/redis.svg', category: 'database' },
    // { name: 'MySQL', icon: 'tech/mysql.svg', category: 'database' },

    // // DevOps
    // { name: 'Docker', icon: 'tech/docker.svg', category: 'devops' },
    // { name: 'Kubernetes', icon: 'tech/kubernetes.svg', category: 'devops' },
    // { name: 'AWS', icon: 'tech/aws.svg', category: 'devops' },
    // { name: 'Git', icon: 'tech/git.svg', category: 'devops' },
    // { name: 'CI/CD', icon: 'tech/cicd.svg', category: 'devops' },

    // // Other
    // { name: 'GraphQL', icon: 'tech/graphql.svg', category: 'other' },
    // { name: 'REST API', icon: 'tech/rest.svg', category: 'other' },
    // { name: 'Jest', icon: 'tech/jest.svg', category: 'other' },
    // { name: 'Webpack', icon: 'tech/webpack.svg', category: 'other' },
  ] as const;

  constructor() {
    afterNextRender(() => {
      // Register ScrollTrigger plugin
      gsap.registerPlugin(ScrollTrigger);

      // Set initial state
      gsap.set(this.techGrid()?.nativeElement.children, {
        opacity: 0,
        y: 30,
      });

      // Create a timeline for the technology grid
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: this.techGrid()?.nativeElement,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
          once: true,
          markers: false,
        },
      });

      // Animate each technology item with stagger
      tl.to(this.techGrid()?.nativeElement.children, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: {
          amount: 1,
          grid: 'auto',
          from: 'start',
        },
        ease: 'power2.out',
      });
    });
  }
}
