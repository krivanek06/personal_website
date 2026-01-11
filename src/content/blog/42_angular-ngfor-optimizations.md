---
title: 'Angular - For Loop Optimizations'
seoTitle: 'Angular - For Loop Optimizations'
seoDescription: 'Technical blogpost exploring how Angular - For Loop Optimizations works'
slug: 42_angular-ngfor-optimizations
tags: angular
order: 42
datePublished: 02.10.2025
readTime: 6
coverImage: article-cover/angular_cover_image.webp
---

In my recent article about [Senior Angular Interview Questions](https://www.angularspace.com/senior-angular-interview-questions/), I mentioned a section about optimizing `for`loops with the `track`method. However, I also pointed out that the choice of value you use for tracking really matters. Even if you add `track`, it might not actually make your rendering more performant if used incorrectly. This article expands on that section with additional explanation and examples.

The [`track` function](https://angular.dev/api/core/TrackByFunction) is a useful performance optimization that was often overlooked with the old `*ngFor="let item of items"` syntax. Fortunately, the new [control flow `@for()`](https://angular.dev/tutorials/learn-angular/5-control-flow-for) now requires you to specify a `track` function, which encourages better practices.

So, why is it important? Imagine you have a component that makes an API call to fetch a list of items, list of users, and displays them in the template. You also have a “reload” button to refetch this data (in case something has changed on the backend). Below is an example using the older `*ngFor` syntax to illustrate the issue:

```typescript
@Component({
  selector: 'app-child',
  imports: [NgForOf],
  template: `
    <button (click)="onRerun()">re run</button>

    <div *ngFor="let item of items()">
      {{ item.name }}
    </div>
  `,
})
export class ChildComponent {
  items = signal<{ id: string; name: string }[]>([]);

  onRerun() {
    // "fake api call" to reload data
    this.items.set([{ id: '100', name: 'Item 1' } /* ... */]);
  }
}
```

In this setup, every time `onRerun()` is triggered and the array is updated (even with the same content), Angular will re-render all elements in the DOM. That's because it can't tell which items stayed the same and why didn't. It result to performance loss and UI flickering, especially in long or complex lists. To prevent this, you use a `trackBy` function:

```typescript
@Component({
  selector: 'app-child',
  imports: [CommonModule],
  template: `
    <ng-container *ngFor="let item of items(); trackBy: identify">
      <!-- previous code -->
    </ng-container>
  `,
})
export class ChildComponent {
  // ... previous code

  identify(index: number, item: { id: string }): string | number {
    return item.id;
  }
}
```

This tells Angular how to uniquely identify items in the array, commonly via an `id`. With a `trackBy` function (or `track` key in `@for()`), Angular can associate each item with its corresponding DOM element. When the data is reloaded, Angular compares these keys (not full object references), allowing unchanged items to be preserved in the DOM.

Why does this matter? Because DOM operations are expensive. Without proper tracking, Angular discards and recreates DOM elements for every item, even if the data hasn't changed. With tracking, the DOM elements stay in place, and Angular only updates bindings when necessary.

On the GIF below, the top list uses `trackBy: identify` while the second one does not. You can see the difference. The top list preserves DOM elements during data reload, whereas the second recreates them entirely each time.

![NgFor Rerendering Whole List](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fz2cvqryfzo1s2145n76.webp)

With the new `@for()` syntax, Angular enforces the use of a `track` key for the same purpose. However, two common mistakes still happen:

- Using the object itself as the key - example: `@for (item of items(); track item)`. This does not work as expected because the reference to each item changes on every reload, even if the data is identical and it will re-render the UI every time, basically ignoring the `track` function.
- Using `$index` as the key - example: `@for (item of items(); track $index)`. This causes problems when an item is removed. Suppose you delete the 5th item in a list of 10, then every item after index 4 now has a new index, forcing Angular to re-render them all unnecessarily. In stateful components like forms, this leads to loss of input focus or cursor position, however using the `$index` is okay for static lists.

Here's a comparison: the top row uses `track item.id`, and the second uses `track $index`. Watch how the first preserves DOM elements during removal. Here is a [stackblitz example to play with](https://stackblitz.com/edit/stackblitz-starters-dtbhl8zb?file=src%2Fmain.ts).

![NgFor Using Index](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dzl6h85h8i3yk5b27w3m.webp)

If you’re rendering a static list of rows in a table, or a fixed ordered list that never changes its order or size, tracking by `$index` works because the identity of each item will never shift. In these scenarios, you don’t risk losing focus, cursor position, or component state since nothing is being reordered or removed. Use `$index` only for completely static, non-interactive lists. For anything dynamic or stateful, always track by a stable identifier like `id`.

A great example where proper tracking really matters is an infinite scroll or chat application. Imagine you’re building a chat window. As new messages arrive, they’re pushed into the list, and when you scroll up, older messages are loaded from the server.

If you don’t use a proper `track` key (like `message.id`), Angular will re-render the entire list whenever new data is appended. That means the scroll position jumps, the user loses their place, and any ongoing animations are lost.

Using an unique key for tracking (like ID), Angular reuses the existing DOM nodes for older messages and only creates DOM nodes for the new ones. This preserves scroll position, keeps animations smooth, and makes the whole app feel more stable and responsive. On the following example you see an incorrect usage of for loop, using the `$index` for tracking and every time a new message comes, the whole list is re-rendered.

```typescript
@Component({
  selector: 'app-chat',
  standalone: true,
  template: `
     @for(msg of messages(); track $index){
	     <div>
	       { msg.user }}: {{ msg.text }}
	     </div>
     }

    <button (click)="loadOlder()">Load older</button>
  `,
})
export class ChatComponent {
  readonly messages = signal([
    { id: 1, user: 'Alice', text: 'Hello' },
    { id: 2, user: 'Bob', text: 'Hi' },
  ]);

  loadOlder() {
    const older = [{ id: 0, user: 'System', text: `Message: ${this.messages().length}` }];
    this.messages.set([...older, ...this.messages()]);
  }
}
```

![NgFor Using Index With New Data](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vsg0jlk9u1ftxkjvb7v8.gif)

Hope you liked the article, feel free to share your thoughts, catch more of my articles on So fail. Then fail better. And maybe one day, you'll be writing blog posts like this, after you've finished crying over your failed side project. Hope you liked these short stories. Feel free to share your thoughts, catch more of my articles on [dev.to](https://dev.to/krivanek06), connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or check my [Personal Website](https://eduardkrivanek.com/).
