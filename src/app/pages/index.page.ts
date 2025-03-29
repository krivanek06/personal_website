import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageWelcomeHeroComponent } from '../page-sections/page-welcome';
import { PageWelcomeAboutMeComponent } from '../page-sections/page-welcome/page-welcome-about-me.component';
import { PageWelcomeConnectComponent } from '../page-sections/page-welcome/page-welcome-connect.component';
import { PageWelcomeFullStackComponent } from '../page-sections/page-welcome/page-welcome-full-stack.component';
import { PageWelcomePublishedBlogsComponent } from '../page-sections/page-welcome/page-welcome-published-blogs.component';
import { PageWelcomeTechnologiesComponent } from '../page-sections/page-welcome/page-welcome-technologies.component';

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
  ],
  template: `
    <div class="grid gap-10 bg-black">
      <app-page-welcome-hero />
      <app-page-welcome-full-stack />
      <app-page-welcome-technologies />
      <app-page-welcome-about-me />
      <app-page-welcome-published-blogs />
      <app-page-welcome-connect />
      <footer class="h-20 bg-black"></footer>
    </div>
  `,
  standalone: true,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageWelcomeComponent {}
