---
title: ''
seoTitle: ''
seoDescription: ''
slug:
tags: javascript, angular, rxjs, opinion
order:
datePublished:
readTime:
coverImage: ''
---

Working on one of my side projects I had an interesting problem. I wanted to implement accessibility 👀 . I know, not the topic we usually talk about, but dark days sometimes come and we have to brace ourselves.

## The Task

Here is the problem. I had some components where I wanted to implement the following additions:

- have an `clickable` signal input where I can set value from the parent whether the component is clickable
- if `clickable` is set to true, add some css class to the component by `ngClass` and also `tabIndex` to be accessible by the keyboard
- if `clickable` is set, add an `(click)` and `(keydown.enter)` method on the component where both of them will notify the parent component that the child was clicked

## The Naive Solution

With all this in mind, the implementation to the components went something like this

```jsx
@Component({
  selector: 'app-test',
  standalone: true,
  imports: [/* imports */],
  template: `
    <div
      (keydown.enter)="onClick()"
      (click)="onClick()"
      [ngClass]="{
        'g-clickable': clickable()
      }"
      [tabIndex]="clickable() ? 0 : -1"
    >
		<!-- whetever body -->
    </div>
  `,
  styles: ``,
})
export class TestComponent {
  itemClicked = output<void>();

  clickable = input(false);


  onClick(): void {
    if (this.clickable()) {
      this.itemClicked.emit();
    }
  }
}
```

The `g-clickable` contains some global css class to make the component clickable. All in all it was decent , I would approve the PR, however, here is where the problem starts.

What if I have to implement clickable behaviour on multiple components?

Well I may create a wrapper component a wrap each component, which should be clickable by this one. It would work. Is there anything else ? Welcome to an not-so-spoken [Angular v15 feature - composition API](https://dev.to/bitovi/angular-v15-directive-composition-api-28an) (yes I liked my article, give it a like).

## The Proper Solution

With composition API what we can do is create a `ClickableDirective` and then use `hostDirectives` in components to export then `itemClicked` and `clickable` to parent components.

```tsx
import {
  Directive,
  ElementRef,
  InputSignal,
  OnDestroy,
  OutputEmitterRef,
  Renderer2,
  effect,
  inject,
  input,
  output,
} from '@angular/core';

interface Clickable {
  itemClicked: OutputEmitterRef<void>;
  clickable: InputSignal<boolean | undefined> | InputSignal<boolean>;
}

@Directive({
  selector: '[appClickable]',
  standalone: true,
})
export class ClickableDirective implements OnDestroy, Clickable {
  itemClicked = output<void>();
  clickable = input(false);

  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  /**
   * references for event listeners to destroy them when directive is destroyed
   */
  private clickMouseRef: (() => void) | null = null;
  private clickKeyboardRef: (() => void) | null = null;

  clickableChangeEffect = effect(() => {
    const isClickable = this.clickable();
    if (isClickable) {
      this.addClickableEffect();
    } else {
      this.removeClickableEffect();
    }
  });

  ngOnDestroy() {
    this.removeClickableEffect();
  }

  private addClickableEffect() {
    // add clickable class
    this.renderer.addClass(this.elementRef.nativeElement, 'g-clickable');

    // add tab index
    this.renderer.setAttribute(this.elementRef.nativeElement, 'tabIndex', '0');

    // on click by mouse dispatch event
    this.clickMouseRef = this.renderer.listen(this.elementRef.nativeElement, 'click', () => {
      this.itemClicked.emit();
    });

    // on click by keyboard dispatch event
    this.clickKeyboardRef = this.renderer.listen(this.elementRef.nativeElement, 'keydown.enter', () => {
      this.itemClicked.emit();
    });
  }

  private removeClickableEffect() {
    // remove clickable class
    this.renderer.removeClass(this.elementRef.nativeElement, 'g-clickable');
    // remove tab index
    this.renderer.removeAttribute(this.elementRef.nativeElement, 'tabIndex');
    // remove click event listener
    if (this.clickMouseRef) {
      this.clickMouseRef();
    }
    // remove keyboard event listener
    if (this.clickKeyboardRef) {
      this.clickKeyboardRef();
    }
  }
}
```

then going back to your component which you want to make clickable you can do the following

```tsx
@Component({
  selector: 'app-test',
  standalone: true,
  imports: [ClickableDirective /* imports */],
  hostDirectives: [
    {
      directive: ClickableDirective, // <-- magic
      inputs: ['clickable'],
      outputs: ['itemClicked'],
    },
  ],
  template: `
    <div>
      <!-- whetever body -->
    </div>
  `,
  styles: ``,
})
export class TestComponent {}
```

For all this examples I am attaching a stackblitz link: https://stackblitz.com/edit/stackblitz-starters-z8a4ca

## Summary

Composition API in Angular v15 is not something you see being used very frequently. I myself struggle finding use-cases for it (or maybe it is just lack of my knowledge), nonetheless, hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
