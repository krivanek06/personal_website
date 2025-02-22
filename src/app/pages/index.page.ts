import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageWelcomeHeroComponent } from '../page-sections/page-welcome';
import { PageWelcomeFullStackComponent } from '../page-sections/page-welcome/page-welcome-full-stack.component';

// export const routeMeta: RouteMeta = {
//   title: 'Welcome',
// };

@Component({
  selector: 'app-page-welcome',
  imports: [PageWelcomeHeroComponent, PageWelcomeFullStackComponent],
  template: `
    <div class="grid gap-10 bg-black">
      <app-page-welcome-hero />
      <app-page-welcome-full-stack />
    </div>
  `,
  standalone: true,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageWelcomeComponent {}
