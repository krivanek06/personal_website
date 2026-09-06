---
title: 'Angular - Power Of Renderer2'
seoTitle: 'Angular - Power Of Renderer2'
seoDescription: 'When we build apps with Angular, we usually stay inside the world of templates and signals. Here is why Renderer2 is still the safe way to talk to the DOM.'
slug: 46_angular-power-of-renderer2
tags: angular, webdev
order: 46
datePublished: 21.03.2026
readTime: 5
coverImage: article-cover/46_angular-power-of-renderer2.png
---

When we build apps with Angular, we usually stay inside the world of templates and signals. It works great for almost everything. But sometimes you hit a wall and need a lower level access to build a custom tooltip, a complex file generator, or a special pagination system. In those moments, you might want to use "document" or "nativeElement" to change a color or move an element. However, doing this can break your app. Renderer2 lets you talk to the webpage safely.

## Why Direct DOM Access Is Risky

It is easy to write `document.getElementById` in a component, but that habit can cause three major problems:

**1. The Server Side Challenge**
Many modern apps use Server Side Rendering or SSR. This means your app starts running on a server before it ever reaches a user's browser. A server does not have a "window" or a "document" because there is no actual screen there. If your code tries to find a button using the global document while it is running on the server, your whole application will crash. Renderer2 is smart. It knows if it is running on a server or in a browser, and it ensures your code does not cause a crash.

**2. Security and XSS**
Web security is a top priority. If you use something like innerHTML to inject content, you might accidentally open a door for hackers. This is called Cross Site Scripting or XSS. They can inject sneaky scripts into your site to steal data. Angular is very good at blocking these attacks, but it can only protect you if you use its official tools. Renderer2 helps keep your app safe by handling these changes in a secure, sanitized way.

**3. Testing Your Code**
We want our tests to be fast and reliable. If your component is tied directly to the browser DOM, it becomes very difficult to test in different environments. By using the tools Angular provides, you can "mock" or fake the webpage during your tests. This makes your testing process much smoother and ensures your code works perfectly before it goes live.

Renderer2 is an "abstraction." This just means it is a middleman that talks to the DOM for you. You do not have to worry about whether the app is on a phone, a server, or a browser. To start using it in a modern component or directive, you just inject it along with the `ElementRef` or use the `DOCUMENT` injection token to access HTML elements.

```typescript
import { Component, inject, Renderer2, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-custom-style',
  standalone: true,
  template: `<div #myBox>Target Box</div>`,
})
export class MyComponent {
  private renderer = inject(Renderer2);
  private box = viewChild<ElementRef>('myBox');

  applyStyle() {
    const el = this.box()?.nativeElement;
    if (el) {
      this.renderer.setStyle(el, 'background-color', 'blue');
    }
  }
}
```

Renderer2 gives you a set of tools that cover almost everything you would ever need to do to a webpage. Here are the ones we use most often:

- **createElement**: Build a new HTML tag from scratch without using messy strings.
- **createText**: Add plain text inside your elements.
- **appendChild**: Take a new element and put it inside another one.
- **setStyle and removeStyle**: Change colors, margins, or animations on the fly.
- **addClass and removeClass**: The best way to handle CSS transitions and dark mode themes.

Using `addClass` is usually better than `setStyle` because it keeps your design logic inside your CSS files where it belongs. I have used this many times when building custom UI like a YAML file generator or a custom pagination component. When you are parsing complex data and need to show it on the screen, these methods keep your code clean and easy to read.

One useful example I like to always go with is a clickable element directive. This is a common task when you want to add special behavior to a button or a div without breaking the way the page works. By using the renderer to add or remove classes based on user interaction, you keep the DOM manipulation safe and clean. It is a much better way to handle "active" states or ripple effects than trying to manage every single CSS change through a complex template binding. You can read the [full example here](https://dev.to/krivanek06/angular-clickable-component-4o3d).

```typescript
import { Directive, inject, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[appClickable]',
  standalone: true,
  host: {
    '(click)': 'onElementClick($event)',
    '(mouseenter)': 'onHover()',
    '[class.is-active]': 'active()',
  },
})
export class ClickableDirective {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  // We can use signals for state
  protected active = signal(false);

  onElementClick(event: MouseEvent) {
    this.active.set(!this.active());
    // Using renderer to set a style safely
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', 'yellow');
  }

  onHover() {
    console.log('User is hovering over the element');
  }
}
```

You might wonder when to use RendererFactory2. Think of Renderer2 as the tool you hold in your hand. RendererFactory2 is the factory that builds that tool. Most of the time, you just inject Renderer2. But if you are working in a service where there is no specific element to attach to, you might need the factory to create a renderer for you. Here is how that looks:

```typescript
import { inject, Injectable, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DynamicThemeService {
  private factory = inject(RendererFactory2);
  // We create a renderer that is not tied to any specific component
  private renderer = this.factory.createRenderer(null, null);

  applyGlobalTheme(themeName: string) {
    this.renderer.addClass(document.body, themeName);
  }
}
```

Practical use cases for `Renderer2` usually pop up when you are dealing with things that live outside the standard Angular template logic.

A great example is handling [image loading issues](https://dev.to/krivanek06/angular-default-image-placeholder-3dfc). You use the renderer to listen for the "error" event on an `<img>` tag and then safely swap the `src` attribute to a backup image. This prevents your UI from looking broken if an external link fails, and it works perfectly even if you are using Server Side Rendering.

Another high level case is discussed in the [blogpost about web components in Angular](https://dev.to/playfulprogramming-angular/web-components-in-angular-why-passing-inputs-breaks-on-navigation-52b6). When you use custom elements, standard Angular inputs can sometimes fail during navigation between pages. Using the renderer to manually set properties or attributes on those web components ensures that the data stays synced and the component does not break when the user moves around your app.

Finally, when you need to build [custom angular material pagination](https://dev.to/playfulprogramming-angular/angular-custom-matpaginator-styling-en6). Since the internal parts of material components are often hidden or hard to reach, the renderer lets you find those specific buttons or labels to inject custom logic or styles. This allows you to create a unique user experience without having to rewrite the entire pagination logic from scratch.

## Summary

A great video on this topic is from [Decoded Frontend - The Role of Renderer2 in Modern Angular](https://www.youtube.com/watch?v=t0WvhimkM7Q)**.** While many problems have multiple solutions, you can solve many cases by just simply accessing the DOM directly, however using renderer, it gives you a safe, SSR compatible, way of doing so. Understanding how it works, allows you to solve problems in a cleaner way. Hope you liked this example, catch more of my articles on [dev.to](https://dev.to/krivanek06), connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or check my [Personal Website](https://eduardkrivanek.com/).
