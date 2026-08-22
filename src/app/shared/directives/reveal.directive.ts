import {
  afterNextRender,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Fades + lifts an element into view the first time it scrolls into the
 * viewport. Respects `prefers-reduced-motion` by leaving the element in its
 * natural (visible) state.
 *
 * Usage: <div appReveal [appRevealDelay]="0.15">…</div>
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective {
  private readonly host = inject(ElementRef<HTMLElement>);

  /** Delay in seconds before the reveal starts. */
  readonly revealDelay = input(0, { alias: 'appRevealDelay' });
  /** Vertical offset (px) the element starts from. */
  readonly revealY = input(28, { alias: 'appRevealY' });

  constructor() {
    afterNextRender(() => {
      const el = this.host.nativeElement;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      gsap.from(el, {
        opacity: 0,
        y: this.revealY(),
        duration: 0.9,
        delay: this.revealDelay(),
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      });
    });
  }
}
