import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Renderer2,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-blob',
  imports: [],
  template: `<div #blob id="blob"></div>`,
  standalone: true,
  styles: [
    `
      #blob {
        z-index: 10;
        -webkit-filter: blur(25px);
        -moz-filter: blur(25px);
        -o-filter: blur(25px);
        -ms-filter: blur(25px);
        width: 350px;
        height: 350px;
        background: #22c55d5f;
        transition: 0.15s linear;
        position: absolute;
        left: 50%;
        top: 50%;
        translate: -50% -50%;
        opacity: 0.3;
        animation:
          blobRadius 5s ease infinite,
          rotate 20s infinite;
      }

      @keyframes blobRadius {
        0%,
        100% {
          border-radius: 43% 77% 80% 40% / 40% 40% 80% 80%;
        }
        20% {
          border-radius: 47% 73% 61% 59% / 47% 75% 45% 73%;
        }
        40% {
          border-radius: 46% 74% 74% 46% / 74% 58% 62% 46%;
        }
        60% {
          border-radius: 47% 73% 61% 59% / 40% 40% 80% 80%;
        }
        80% {
          border-radius: 50% 70% 52% 68% / 51% 61% 59% 69%;
        }
      }

      @keyframes rotate {
        from {
          rotate: 0deg;
          scale: 1 1;
        }

        30% {
          scale: 1.3 1.8;
        }

        70% {
          scale: 1.2 1.5;
        }

        to {
          rotate: 360deg;
          scale: 1 1;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlobComponent {
  private readonly renderer = inject(Renderer2);
  readonly blobRef = viewChild.required<ElementRef<HTMLDivElement>>('blob');

  constructor() {
    // move blob only on client, outside of angular
    afterNextRender(() => {
      this.renderer.listen('document', 'mousemove', event => {
        const { pageX, pageY } = event;
        const blobRef = this.blobRef();

        // move blob
        blobRef.nativeElement.animate(
          {
            left: `${pageX}px`,
            top: `${pageY}px`,
          },
          { duration: 20000, fill: 'forwards' }
        );
      });
    });
  }
}
