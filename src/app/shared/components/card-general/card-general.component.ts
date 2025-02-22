import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-card-general',
  imports: [],
  template: `
    <div class="rounded-lg border border-green-700 bg-[#00b01a1e] p-4">
      <ng-content />
    </div>
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
export class CardGeneralComponent {}
