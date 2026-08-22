import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-card-general',
  imports: [],
  template: `
    <div
      [class]="
        'group rounded-2xl border border-line bg-moss transition-colors duration-300 hover:border-signal/40 ' +
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardGeneralComponent {
  readonly additionalClasses = input<string>('');
}
