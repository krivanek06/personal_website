import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageWelcomeHeroComponent } from '../page-sections/page-welcome';
import { PageWelcomeAboutMeComponent } from '../page-sections/page-welcome/page-welcome-about-me.component';
import { PageWelcomeConnectComponent } from '../page-sections/page-welcome/page-welcome-connect.component';
import { PageWelcomeFullStackComponent } from '../page-sections/page-welcome/page-welcome-full-stack.component';
import { PageWelcomePublishedBlogsComponent } from '../page-sections/page-welcome/page-welcome-published-blogs.component';
import { PageWelcomeTechnologiesComponent } from '../page-sections/page-welcome/page-welcome-technologies.component';
import { BlobComponent, SvgOneComponent, SvgTwoComponent } from '../shared/components';

// export const routeMeta: RouteMeta = {
//   title: 'Welcome',
// };

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

      <section class="relative">
        <!-- SVGs top left -->
        <app-svg-one addClass="absolute top-[50px] left-[200px] z-10 w-[120px] h-[120px] opacity-40" />
        <app-svg-one addClass="absolute top-[100px] left-[420px] z-10 w-[120px] h-[120px] opacity-40" />
        <app-svg-one addClass="absolute top-[200px] left-[250px] z-10 w-[120px] h-[120px] opacity-30" />
        <app-svg-one addClass="absolute top-[380px] left-[200px] z-10 w-[120px] h-[120px] opacity-20" />
        <app-svg-one addClass="absolute top-[250px] left-[380px] z-10 w-[120px] h-[120px] opacity-30" />

        <!-- SVGs bottom right -->
        <app-svg-one addClass="absolute bottom-[0px] right-[200px] z-10 w-[120px] h-[120px] opacity-30" />
        <app-svg-one addClass="absolute bottom-[100px] right-[420px] z-10 w-[120px] h-[120px] opacity-30" />
        <app-svg-one addClass="absolute bottom-[120px] right-[250px] z-10 w-[120px] h-[120px] opacity-20" />

        <app-page-welcome-hero />
      </section>

      <section class="relative">
        <!-- SVGs for hero section -->
        <app-svg-one addClass="absolute top-[20px] left-[200px] z-10 w-[120px] h-[120px] opacity-40" />
        <app-svg-one addClass="absolute top-[120px] left-[320px] z-10 w-[120px] h-[120px] opacity-40" />
        <app-svg-one addClass="absolute top-[300px] left-[250px] z-10 w-[120px] h-[120px] opacity-30" />

        <app-page-welcome-full-stack />
      </section>

      <section class="relative">
        <app-page-welcome-technologies />
      </section>

      <section class="relative">
        <app-page-welcome-about-me />

        <app-svg-two addClass="absolute top-0 left-0  rotate-180  " />
        <app-svg-one addClass="absolute top-[600px] right-[200px] z-10 w-[120px] h-[120px] opacity-20" />
        <app-svg-one addClass="absolute top-[750px] right-[380px] z-10 w-[120px] h-[120px] opacity-30" />
      </section>

      <section class="relative">
        <app-page-welcome-published-blogs />
      </section>

      <section class="relative">
        <app-page-welcome-connect />
      </section>

      <footer class="h-20 bg-black"></footer>
    </div>
  `,
  standalone: true,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageWelcomeComponent {}
