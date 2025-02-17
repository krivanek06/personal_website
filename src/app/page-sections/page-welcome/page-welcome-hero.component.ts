import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-welcome-hero',
  imports: [],
  template: `<p>page-welcome-hero works!</p>`,
  standalone: true,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageWelcomeHeroComponent {}
