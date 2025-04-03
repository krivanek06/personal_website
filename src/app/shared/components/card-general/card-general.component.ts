import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-card-general',
  imports: [],
  template: `
    <div
      [class]="
        'glass-effect rounded-lg border border-green-700 bg-[#00b01a1e] transition-all duration-300 hover:bg-[#00b01a33] ' +
        additionalClasses()
      ">
      <ng-content />
    </div>
  `,
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }
      .glass-effect {
        backdrop-filter: blur(10px);
        border-radius: 15px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardGeneralComponent {
  readonly additionalClasses = input<string>('');
}
