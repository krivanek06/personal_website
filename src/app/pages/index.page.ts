import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageWelcomeHeroComponent } from '../page-sections/page-welcome';
import { PageWelcomeAboutMeComponent } from '../page-sections/page-welcome/page-welcome-about-me.component';
import { PageWelcomeConnectComponent } from '../page-sections/page-welcome/page-welcome-connect.component';
import { PageWelcomeFullStackComponent } from '../page-sections/page-welcome/page-welcome-full-stack.component';
import { PageWelcomePublishedBlogsComponent } from '../page-sections/page-welcome/page-welcome-published-blogs.component';
import { PageWelcomeTechnologiesComponent } from '../page-sections/page-welcome/page-welcome-technologies.component';
import { BlobComponent, SvgOneComponent, SvgTwoComponent } from '../shared/components';

export const routeMeta: RouteMeta = {
  title: 'Welcome',
  meta: [
    {
      name: 'description',
      content:
        'Hi, I am Eduard Krivanek, welcome to my personal website, where I share my journey as a developer.',
    },
    {
      property: 'og:title',
      content: 'Eduard Krivanek Personal Website',
    },
    {
      property: 'og:description',
      content:
        'Hi, I am Eduard Krivanek, welcome to my personal website, where I share my journey as a developer.',
    },
    {
      property: 'og:image',
      // linkedin profile image
      content:
        'https://media.licdn.com/dms/image/v2/D4D03AQGnGpyIoB1ogg/profile-displayphoto-shrink_800_800/B4DZQwfZsVG0Ac-/0/1735980326182?e=1749081600&v=beta&t=xJIuWYzikAAutEpqZYh1e7OIORTULw9qSzAN7UQOyJQ',
    },
    {
      property: 'og:url',
      content: 'eduardkrivanek.com',
    },
  ],
};

@Component({
  selector: 'app-page-welcome',
  imports: [
    PageWelcomeHeroComponent,
    PageWelcomeFullStackComponent,
    PageWelcomePublishedBlogsComponent,
    PageWelcomeAboutMeComponent,
    PageWelcomeTechnologiesComponent,
    PageWelcomeConnectComponent,
    BlobComponent,
    SvgOneComponent,
    SvgTwoComponent,
  ],
  template: `
    <div class="relative mx-auto max-w-[1980px] overflow-x-clip overflow-y-clip bg-black">
      <app-blob />

      <app-svg-two addClass="absolute top-[750px] right-0 z-10  " />

      <section class="relative mb-10">
        <!-- SVGs top left -->
        <app-svg-one
          addClass="absolute top-[50px] left-0 lg:left-[200px] z-10 w-[120px] h-[120px] opacity-40" />
        <app-svg-one
          addClass="absolute top-[100px] left-[190px] lg:left-[420px] z-10 w-[120px] h-[120px] opacity-40" />
        <app-svg-one
          addClass="absolute top-[200px] left-[70px] lg:left-[250px] z-10 w-[120px] h-[120px] opacity-30" />
        <app-svg-one
          addClass="absolute top-[380px] left-[100px] lg:left-[200px] z-10 w-[120px] h-[120px] opacity-20" />
        <app-svg-one
          addClass="absolute top-[250px] left-[220px] lg:left-[380px] z-10 w-[120px] h-[120px] opacity-30" />

        <!-- SVGs bottom right -->
        <app-svg-one
          addClass="absolute bottom-[0px] right-[200px] z-10 w-[120px] h-[120px] opacity-30" />
        <app-svg-one
          addClass="absolute bottom-[100px] right-[420px] z-10 w-[120px] h-[120px] opacity-30" />
        <app-svg-one
          addClass="absolute bottom-[120px] right-[250px] z-10 w-[120px] h-[120px] opacity-20" />

        <app-page-welcome-hero />
      </section>

      <section class="relative mb-16">
        <!-- SVGs for hero section -->
        <app-svg-one
          addClass="absolute top-[20px] left-[200px] z-10 w-[120px] h-[120px] opacity-40" />
        <app-svg-one
          addClass="absolute top-[120px] left-[320px] z-10 w-[120px] h-[120px] opacity-40" />
        <app-svg-one
          addClass="absolute top-[300px] left-[250px] z-10 w-[120px] h-[120px] opacity-30" />

        <app-page-welcome-full-stack />
      </section>

      <section class="relative mb-16">
        <app-page-welcome-technologies />
      </section>

      <section class="relative mb-16">
        <app-page-welcome-about-me />

        <app-svg-two addClass="absolute top-0 left-0  rotate-180  " />
        <app-svg-one
          addClass="absolute top-[600px] right-[200px] z-10 w-[120px] h-[120px] opacity-20" />
        <app-svg-one
          addClass="absolute top-[750px] right-[380px] z-10 w-[120px] h-[120px] opacity-30" />
      </section>

      <section class="relative mb-16">
        <app-page-welcome-published-blogs />
      </section>

      <section class="relative">
        <app-page-welcome-connect />
      </section>
    </div>
  `,
  standalone: true,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageWelcomeComponent {
  // todo - add some social - og:FB:TITLE
}
