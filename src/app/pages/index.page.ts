import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageWelcomeHeroComponent } from '../page-sections/page-welcome';
import { PageWelcomeAboutMeComponent } from '../page-sections/page-welcome/page-welcome-about-me.component';
import { PageWelcomeConnectComponent } from '../page-sections/page-welcome/page-welcome-connect.component';
import { PageWelcomeFullStackComponent } from '../page-sections/page-welcome/page-welcome-full-stack.component';
import { PageWelcomeProjectsComponent } from '../page-sections/page-welcome/page-welcome-projects.component';
import { PageWelcomePublishedBlogsComponent } from '../page-sections/page-welcome/page-welcome-published-blogs.component';
import { PageWelcomeTechnologiesComponent } from '../page-sections/page-welcome/page-welcome-technologies.component';
import { PageWelcomeTickerComponent } from '../page-sections/page-welcome/page-welcome-ticker.component';
import { SvgOneComponent, SvgTwoComponent } from '../shared/components';

export const routeMeta: RouteMeta = {
  title: 'Eduard Krivanek — Full-Stack Developer',
  meta: [
    {
      name: 'description',
      content:
        'Eduard Krivanek is a Full Stack Developer focused on Angular, RxJS, NestJS and Firebase — building fast, dependable web applications and writing about it.',
    },
    {
      property: 'og:title',
      content: 'Eduard Krivanek — Full-Stack Developer',
    },
    {
      property: 'og:description',
      content:
        'Full Stack Developer focused on Angular, RxJS, NestJS and Firebase. Writing about what I learn along the way.',
    },
    {
      property: 'og:image',
      content:
        'https://media.licdn.com/dms/image/v2/D4D03AQGnGpyIoB1ogg/profile-displayphoto-shrink_800_800/B4DZQwfZsVG0Ac-/0/1735980326182?e=1749081600&v=beta&t=xJIuWYzikAAutEpqZYh1e7OIORTULw9qSzAN7UQOyJQ',
    },
    {
      property: 'og:url',
      content: 'https://eduardkrivanek.com',
    },
  ],
};

@Component({
  selector: 'app-page-welcome',
  imports: [
    PageWelcomeHeroComponent,
    PageWelcomeTickerComponent,
    PageWelcomeFullStackComponent,
    PageWelcomeTechnologiesComponent,
    PageWelcomeProjectsComponent,
    PageWelcomeAboutMeComponent,
    PageWelcomePublishedBlogsComponent,
    PageWelcomeConnectComponent,
    SvgOneComponent,
    SvgTwoComponent,
  ],
  template: `
    <div class="relative overflow-x-clip bg-pitch">
      <app-page-welcome-hero />
      <app-page-welcome-ticker />

      <section class="relative isolate">
        <app-svg-two
          addClass="pointer-events-none absolute -right-40 top-24 -z-10 opacity-20" />
        <app-svg-one
          addClass="pointer-events-none absolute left-6 top-20 -z-10 h-[110px] w-[110px] -rotate-12 opacity-20" />
        <app-page-welcome-full-stack />
        <app-page-welcome-technologies />
      </section>

      <app-page-welcome-projects />

      <section class="relative isolate">
        <app-svg-two
          addClass="pointer-events-none absolute -left-40 top-0 -z-10 rotate-180 opacity-20" />
        <app-page-welcome-about-me />
      </section>

      <section class="relative isolate">
        <app-svg-one
          addClass="pointer-events-none absolute right-[16%] top-16 -z-10 h-[100px] w-[100px] rotate-6 opacity-15" />
        <app-page-welcome-published-blogs />
      </section>

      <app-page-welcome-connect />
    </div>
  `,
  standalone: true,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageWelcomeComponent {}
