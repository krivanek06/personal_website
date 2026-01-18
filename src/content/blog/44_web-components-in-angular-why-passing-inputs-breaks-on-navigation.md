---
title: 'Web Components in Angular - Why Passing Inputs Breaks on Navigation'
seoTitle: 'Web Components in Angular - Why Passing Inputs Breaks on Navigation'
seoDescription: 'Technical blogpost exploring how Web Components in Angular - Why Passing Inputs Breaks on Navigation works'
slug: 44_web-components-in-angular-why-passing-inputs-breaks-on-navigation
tags: angular, webcomponents
order: 44
datePublished: 21.12.2025
readTime: 6
coverImage: article-cover/angular_cover_image.webp
---

Imagine that in your organization one team is building a library that you want to integrate into your Angular app. That library is built using a different framework, such as Svelte or React, and uses Web Components for seamless integration.

For this example, let’s say it is a card payment widget you want to integrate into Angular (`payment-widget`), and it requires some input parameters like `country` and `entity`, which are validated during the construction of the widget. If incorrect values are provided, the component will fail. You might have something like this:

```typescript
@Component({
  selector: 'app-payment-wrapper',
  template: ` <payment-widget [attr.country]="country()" [attr.entity]="entity()" /> `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PaymentWidgetComponent {
  readonly country = input.required('');
  readonly entity = input.required('');

  // ... other code
}
```

On the first load, everything works fine. The attributes are passed and the widget works as expected. Then you navigate away (the component is destroyed), come back, and get an error: `Bad or unsupported value 'undefined' of input parameter 'entityUid'`. The Angular component has the value. The binding exists. Yet the Web Component crashes as if the value never arrived. This makes the issue especially confusing because there is no compilation or TypeScript error.

I am writing this article because I recently ran into this issue, and it took us a while to understand what was happening and why it worked only once. Our assumption was that “_if I bind `[attr._]`, Angular will update the element whenever the value changes”\*, which is correct, but it does not work the way you might expect with Web Components.

When you use a web component directly in an Angular template, everything usually looks fine at first. On the first navigation to the page, Angular creates the wrapper component and renders the custom HTML element. In most cases, the required values like `country` or `entity` are already available, or they resolve quickly enough. Angular creates the DOM element, then shortly after sets the attributes via `[attr.*]`.

The problem appears when you navigate away and then come back. Angular destroys the wrapper component when you leave the route and creates a new instance when you return. The important detail is that the browser initializes a custom element immediately when it is attached to the DOM. This means the web component’s constructor run before Angular has had a chance to set any attributes. At that moment, attributes like `entity` or `country` are still missing or `undefined`, even though Angular has the correct values ready. Once that happens, Angular cannot recover by setting the attributes later, because the component has already failed during its own initialization.

This is why the first render works and the second one does not. It happens because Angular and custom elements follow different lifecycle rules (not because of caching). Angular assumes it can create an element first and configure it afterward, while a web component assumes it is fully configured at the moment it is connected to the DOM.

## Incorrect Solutions

Before giving the actual working example, I want to give some examples what we have tried but did not work. One of the solutions we thought will work (but did not) was using a condition when to render the widget, so something like:

```typescript
@Component({
  selector: 'app-payment-wrapper',
  template: `
   @if(country() && entity())
	 <payment-widget
	    [attr.country]="country()"
	    [attr.entity]="entity()" />
    }
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PaymentWidgetComponent {
  readonly country = input.required('');
  readonly entity = input.required('');
}
```

Using a condition only controls when Angular adds the element to the DOM. As soon as the element is inserted, the browser immediately initializes the Web Component. Angular still applies `[attr.*]` bindings after the element is connected, so the Web Component can still initialize with missing or undefined values, especially when navigating back to the page.

Another failed attempts were using `setTimeout()`, `afterRendererEffect` or at one point we just hardcoded the country and entity many many (too many times) and had a `switch` statement in HTML to which `payment-widget` display. This solved the problem, but it wasn’t very scalable and finally we bumped to the correct solution.

## Correct Solution

The only reliable way to solve this problem is to stop letting Angular create the Web Component through the template. Instead, you create the element yourself, set all required attributes first, and only then attach it to the DOM. So an example is the following using `Renderer` :

```typescript
@Component({
  selector: 'app-payment-wrapper',
  template: `<div #elRef></div>`,
})
export class PaymentWidgetComponent {
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);

  readonly elRef = viewChild('elRef', { read: ElementRef<HTMLElement> });

  readonly country = input.required('');
  readonly entity = input.required('');

  // reference for the HTML element for cleanup
  private paymentWidget?: HTMLElement;

  constructor() {
    afterRendererEffect(() => {
      const paymentWidget = this.renderer.createElement('payment-widget');
      const elementRef = this.elRef().nativeElement;

      this.paymentWidget = paymentWidget;

      // set input attributes
      this.renderer.setAttribute(el, 'country', this.country());
      this.renderer.setAttribute(el, 'entity', this.entity());

      // attach to the DOM
      this.renderer.appendChild(elementRef, paymentWidget);
    });

    // cleanup - release memory
    this.destroyRef.onDestroy(() => {
      if (this.paymentWidget) {
        this.renderer.removeChild(host, this.paymentWidget);
        this.paymentWidget = undefined;
      }
    });
  }
}
```

This works because the Web Component is not connected to the DOM yet when its attributes are set. The browser does not run the custom element’s constructor or `connectedCallback()` until the element is actually appended. By the time that happens, all required attributes already exist and have valid values. From the Web Component’s point of view, it is being initialized in a fully configured state.

Another important detail is that Angular is no longer involved in the element’s lifecycle. Angular does not create the element, does not attach it automatically, and does not try to update its attributes later. You are treating the Web Component as an external system and interacting with it explicitly. This removes the timing mismatch between Angular’s rendering and the browser’s custom element initialization.

When you leave the route, the element is removed with the rest of the DOM. When you come back, a new element is created, configured, and attached. There is no first vs second render difference, and no chance for the Web Component to see `undefined` inputs during its initialization. Hope you liked this shorter article, catch more of my stuff on [dev.to](https://dev.to/krivanek06), connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or check my [Personal Website](https://eduardkrivanek.com/).
