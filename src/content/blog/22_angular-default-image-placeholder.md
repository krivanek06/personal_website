---
title: 'Angular: Default Image Placeholder'
seoTitle: 'Angular: Default Image Placeholder'
seoDescription: 'Working on the frontend, most of the time you want to display images loaded from a CDN. The request...'
slug: 22_angular-default-image-placeholder
tags: angular, tutorial
order: 22
datePublished: 12.11.2023
readTime: 3
coverImage: article-cover/22_angular-default-image-placeholder.webp
---

Working on the frontend, most of the time you want to display images loaded from a CDN. The request takes some time and while it is not yet completed a nasty placeholder is displayed until the image is loaded (or when it fails).

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pgn5rzgld8yragbu4p3b.png)

## Making a Custom Placeholder

The following solution is done in Angular ('cause not all of us hate this framework) using a directive approach that can be attached to an `img` directive and will result to a pulsing object until the image is not loaded, or will place a placeholder when the loading fails.
Here is the working result:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wk5twjb4r83vhtcdeyu5.gif)

## Implementing The Directive

The whole working example can be found in the following [StackBlitz Example](https://stackblitz.com/edit/stackblitz-starters-oeeyee?file=src%2Fmain.ts) however here is the implementation:

```typescript
import { isPlatformServer } from '@angular/common';
import {
  Directive,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { defaultImageLocation } from './image-locations.model';

type ImageSrc = string | null | undefined;

@Directive({
  selector: '[appDefaultImg]',
  standalone: true,
})
export class DefaultImgDirective implements OnChanges {
  @Input({ required: true }) src: ImageSrc = null;

  // url link to some default image
  private defaultLocalImage = defaultImageLocation;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private imageRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.initImage();
  }

  private initImage() {
    // do not evaluate on SSR
    if (isPlatformServer(this.platformId)) {
      return;
    }

    // show skeleton before image is loaded
    this.renderer.addClass(this.imageRef.nativeElement, 'g-skeleton');

    const img = new Image();

    // return on no src
    if (!this.src) {
      return;
    }

    // if possible to load image, set it to img
    img.onload = () => {
      this.setImage(this.resolveImage(this.src));
      this.renderer.removeClass(this.imageRef.nativeElement, 'g-skeleton');
    };

    img.onerror = () => {
      // Set a placeholder image
      this.setImage(this.defaultLocalImage);
      this.renderer.removeClass(this.imageRef.nativeElement, 'g-skeleton');
    };

    // triggers http request to load image
    img.src = this.resolveImage(this.src);
  }

  private setImage(src: ImageSrc) {
    this.imageRef.nativeElement.setAttribute('src', src);
  }

  private resolveImage(src: ImageSrc): string {
    if (!src) {
      return this.defaultLocalImage;
    }

    return src;
  }
}
```

Not going too much in-depth how the directive works, the main parts are the following:
1.) Every time the `src` input changes, we will try to resolve the resource (url or image location)
2.) When using SSR, the `initImage` method will not try to resolve the image
3.) Attaching the `g-skeleton` css class we create some grey pulsing background, indicating to the user that the image is loading
4.) When the `img.src` is resolved we display the image or a placeholder when it fails

## Directive Usage

The directive can be attach on `img` HTML tags and used in the following way:

```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DefaultImgDirective],
  template: `
    <h1>Testing different image</h1>

    <h2>Working Images Directive vs Normal</h2>
    <div class="image-wrapper">
      <img appDefaultImg class="g-image-height" [src]="emoji1$ | async" />
      <img class="g-image-height" [src]="emoji2$ | async" />
    </div>

    <h2>
      Not Working Image Directive vs Normal
      <h2>
        <div class="image-wrapper">
          <img appDefaultImg class="g-image-height" [src]="emojiNotWorkiing$ | async" />
          <img class="g-image-height" [src]="emojiNotWorkiing$ | async" />
        </div>
      </h2>
    </h2>
  `,
})
export class App {
  emoji1$ = of(emoji1).pipe(delay(3000));
  emoji2$ = of(emoji1).pipe(delay(6000));
  emojiNotWorkiing$ = of('https://...').pipe(delay(3000));
}
```

Just to have all the code, here is the used CSS

```CSS
/* Add application styles & imports to this file! */
.g-skeleton {
  border-radius: 10px;
  background-color: rgb(224, 224, 224);
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
  transform: scale(1);
  animation: pulse 2s infinite;
}

.g-image-height {
  height: 200px;
  width: 200px;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    border-radius: 2px;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  }

  70% {
    transform: scale(1);
    border-radius: 10px;
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }

  100% {
    transform: scale(0.95);
    border-radius: 2px;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}

.image-wrapper {
  display: flex;
  gap: 16px;
}

```

## Summary

This post was a short tutorial on how I personally like to solve image loading in Angular. Hope this method will help you. If you have any questions, feel free to ask them below, share your solution or connect with me at:

Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
