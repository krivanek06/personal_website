import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageWelcomeHeroSocialsComponent } from './components/page-welcome-hero-socials.component';

@Component({
  selector: 'app-page-welcome-hero',
  imports: [NgOptimizedImage, PageWelcomeHeroSocialsComponent],
  template: `
    <section class="relative h-screen">
      <!-- info about me -->
      <div class="relative z-10 ml-[160px] pt-[15%]">
        <div class="text-8xl">Eduard Krivanek</div>
        <div>Web Developer</div>
        <app-page-welcome-hero-socials />
      </div>

      <img priority ngSrc="me/me-hero_2.webp" width="1000" height="1000" class="absolute top-0 right-0" />
    </section>
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
export class PageWelcomeHeroComponent {}
