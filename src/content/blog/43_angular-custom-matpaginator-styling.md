---
title: 'Angular - Custom MatPaginator Styling'
seoTitle: 'Angular - Custom MatPaginator Styling'
seoDescription: 'Technical blogpost exploring how Angular - Custom MatPaginator Styling works'
slug: 43_angular-custom-matpaginator-styling
tags: angular, css
order: 43
datePublished: 24.11.2025
readTime: 9
coverImage: article-cover/angular_cover_image.webp
---

One of my more popular articles that I’ve published is [Angular: MatPaginator Custom Styling](https://dev.to/krivanek06/angular-matpaginator-custom-styling-dkb?utm_source=chatgpt.com), which shows how to transform Angular Material’s paginator (on a mat-table) using a custom directive to make it look more appealing.

I decided to update this article because since then, two major things have changed. It was originally written for Angular v14, and since then we’ve received the major [Angular Material MDC components](https://v17.material.angular.dev/guide/mdc-migration), which caused quite a few issues for people updating their projects, along with some smaller Angular improvements. Also, in my previous article, I was accessing some private methods of the `MatPaginator` component. In the GIF below, you can see the final example we’ll be building. You can also find the full source code in this [GitHub repository](https://github.com/krivanek06/stackblitz-angular-custom-mat-paginator).

![Angular Custom Paginator End Result](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5tqtw0ow1dbmylrih4ck.gif)

I will start this blog post by showing the full code section, you can always come back to it, and then we’ll go through some of the more interesting or not that obvious parts. You might already have a table component displaying data, something like this:

```typescript
import { afterNextRender, Component, viewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

type Data = { position: number; name: string; weight: number; symbol: string };

@Component({
  selector: 'app-test-table',
  imports: [MatTableModule, MatPaginatorModule, BubblePaginationDirective],
  template: `
    <table mat-table [dataSource]="dataSource">
      <!-- Position Column -->
      <ng-container matColumnDef="position">
        <th mat-header-cell *matHeaderCellDef>No.</th>
        <td mat-cell *matCellDef="let element">{{ element.position }}</td>
      </ng-container>

      <!-- ... more columns ... -->

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>

    <mat-paginator [length]="dataSource.data.length" [pageSize]="10" />
  `,
})
export class TestTableComponent {
  readonly dataSource = new MatTableDataSource<Data>([]);
  readonly paginator = viewChild(MatPaginator);

  readonly displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  constructor() {
    const data: Data[] = [];
    Array.from({ length: 100 }, (_, k) => k + 1).forEach(v => {
      data.push({ position: v, name: `Element ${v}`, weight: v * 1.5, symbol: `E${v}` });
    });

    this.dataSource.data = data;

    afterNextRender(() => {
      const paginator = this.paginator();

      if (paginator) {
        this.dataSource.paginator = paginator;
      }
    });
  }
}
```

With this simple configuration, your table looks as follows:

![Basic Table Basic Pagination](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/292r6kddxw3hnmphk5sf.png)

What we want to achieve is creating a directive that we can attach to the `mat-paginator` and it will transform the look of our paginated table into the bubble example. The usage of the directive will be the following:

```html
<mat-paginator
  [appBubblePagination]="dataSource.data.length"
  (page)="onPageChange($event)"
  [length]="dataSource.data.length"
  [pageSize]="15">
</mat-paginator>
```

Here is the full code of the directive and below I describe some of its sections.

```typescript
import {
  Directive,
  ElementRef,
  Renderer2,
  afterRenderEffect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

/**
 * Works from angular-material version 15. since all classes got the new prefix 'mdc-'
 */
@Directive({
  selector: '[appBubblePagination]',
})
export class BubblePaginationDirective {
  private readonly matPag = inject(MatPaginator, {
    optional: true,
    self: true,
    host: true,
  });
  private readonly elementRef = inject(ElementRef);
  private readonly ren = inject(Renderer2);

  /**
   * whether we want to display first/last button and dots
   */
  readonly showFirstButton = input(true);
  readonly showLastButton = input(true);

  /**
   * total number of items in pagination
   * needed to calculate how many buttons to render
   * when page size changes
   */
  readonly paginationSize = input(0, {
    alias: 'appBubblePagination',
  });

  /**
   * how many buttons to display before and after
   * the selected button
   */
  readonly renderButtonsNumber = input(2);

  /**
   * references to DOM elements
   */
  private dotsEndRef!: HTMLElement;
  private dotsStartRef!: HTMLElement;
  private bubbleContainerRef!: HTMLElement;

  /**
   * ref to rendered buttons on UI that we can remove them size changes
   */
  private buttonsRef: HTMLElement[] = [];

  readonly buildButtonsEffect = afterRenderEffect(() => {
    // rebuild buttons when pagination size change
    this.paginationSize();

    untracked(() => {
      // remove buttons before creating new ones
      this.removeButtons();

      // set some default styles to mat pagination
      this.styleDefaultPagination();

      // create bubble container
      this.createBubbleDivRef();

      // create all buttons
      this.buildButtons();

      // switch back to page 0
      this.switchPage(0);
    });
  });

  /**
   * change the active button style to the current one and display/hide additional buttons
   * based on the navigated index
   */
  private changeActiveButtonStyles(previousIndex: number, newIndex: number) {
    const previouslyActive = this.buttonsRef[previousIndex];
    const currentActive = this.buttonsRef[newIndex];

    if (!previouslyActive && !currentActive) {
      return;
    }

    // remove active style from previously active button
    if (previouslyActive) {
      this.ren.removeClass(previouslyActive, 'g-bubble__active');
    }

    // add active style to new active button
    this.ren.addClass(currentActive, 'g-bubble__active');

    // hide all buttons
    this.buttonsRef.forEach(button => this.ren.setStyle(button, 'display', 'none'));

    // show N previous buttons and X next buttons
    const renderElements = this.renderButtonsNumber();
    const endDots = newIndex < this.buttonsRef.length - renderElements - 1;
    const startDots = newIndex - renderElements > 0;

    const firstButton = this.buttonsRef[0];
    const lastButton = this.buttonsRef[this.buttonsRef.length - 1];

    // last bubble and dots
    if (this.showLastButton()) {
      this.ren.setStyle(this.dotsEndRef, 'display', endDots ? 'block' : 'none');
      this.ren.setStyle(lastButton, 'display', endDots ? 'flex' : 'none');
    }

    // first bubble and dots
    if (this.showFirstButton()) {
      this.ren.setStyle(this.dotsStartRef, 'display', startDots ? 'block' : 'none');
      this.ren.setStyle(firstButton, 'display', startDots ? 'flex' : 'none');
    }

    // resolve starting and ending index to show buttons
    const startingIndex = startDots ? newIndex - renderElements : 0;

    const endingIndex = endDots ? newIndex + renderElements : this.buttonsRef.length - 1;

    // display starting buttons
    for (let i = startingIndex; i <= endingIndex; i++) {
      const button = this.buttonsRef[i];
      this.ren.setStyle(button, 'display', 'flex');
    }
  }

  /**
   * Removes or change styling of some html elements
   */
  private styleDefaultPagination() {
    const nativeElement = this.elementRef.nativeElement;
    const itemsPerPage = nativeElement.querySelector('.mat-mdc-paginator-page-size');
    const howManyDisplayedEl = nativeElement.querySelector(
      '.mat-mdc-paginator-range-label'
    );
    const previousButton = nativeElement.querySelector(
      'button.mat-mdc-paginator-navigation-previous'
    );
    const nextButtonDefault = nativeElement.querySelector(
      'button.mat-mdc-paginator-navigation-next'
    );

    // remove 'items per page'
    if (itemsPerPage) {
      this.ren.setStyle(itemsPerPage, 'display', 'none');
    }

    // style text of how many elements are currently displayed
    if (howManyDisplayedEl) {
      this.ren.setStyle(howManyDisplayedEl, 'position', 'absolute');
      this.ren.setStyle(howManyDisplayedEl, 'color', '#919191');
      this.ren.setStyle(howManyDisplayedEl, 'font-size', '14px');
      this.ren.setStyle(howManyDisplayedEl, 'left', '-0');
    }

    // check whether to remove left & right default arrows
    this.ren.setStyle(previousButton, 'display', 'none');
    this.ren.setStyle(nextButtonDefault, 'display', 'none');
  }

  /**
   * creates `bubbleContainerRef` where all buttons will be rendered
   */
  private createBubbleDivRef(): void {
    const actionContainer = this.elementRef.nativeElement.querySelector(
      'div.mat-mdc-paginator-range-actions'
    );
    const nextButtonDefault = this.elementRef.nativeElement.querySelector(
      'button.mat-mdc-paginator-navigation-next'
    );

    // create a HTML element where all bubbles will be rendered
    this.bubbleContainerRef = this.ren.createElement('div') as HTMLElement;
    this.ren.addClass(this.bubbleContainerRef, 'g-bubble-container');

    // render element before the 'next button' is displayed
    this.ren.insertBefore(actionContainer, this.bubbleContainerRef, nextButtonDefault);
  }

  /**
   * helper function that builds all button and add dots
   * between the first button, the rest and the last button
   *
   * end result: (1) .... (4) (5) (6) ... (25)
   */
  private buildButtons(): void {
    if (!this.matPag) {
      return;
    }

    const neededButtons = Math.ceil(this.matPag.length / this.matPag.pageSize);

    // if there is only one page, do not render buttons
    if (neededButtons === 0 || neededButtons === 1) {
      this.ren.setStyle(this.elementRef.nativeElement, 'display', 'none');
      return;
    }

    // set back from hidden to block
    this.ren.setStyle(this.elementRef.nativeElement, 'display', 'block');

    // create first button
    this.buttonsRef = [this.createButton(0)];

    // add dots (....) to UI
    this.dotsStartRef = this.createDotsElement();

    // create all buttons needed for navigation (except the first & last one)
    for (let index = 1; index < neededButtons - 1; index++) {
      this.buttonsRef = [...this.buttonsRef, this.createButton(index)];
    }

    // add dots (....) to UI
    this.dotsEndRef = this.createDotsElement();

    // create last button to UI after the dots (....)
    this.buttonsRef = [...this.buttonsRef, this.createButton(neededButtons - 1)];
  }

  /**
   * Remove all buttons from DOM
   */
  private removeButtons(): void {
    this.buttonsRef.forEach(button => {
      this.ren.removeChild(this.bubbleContainerRef, button);
    });

    // remove dots
    if (this.dotsStartRef) {
      this.ren.removeChild(this.bubbleContainerRef, this.dotsStartRef);
    }
    if (this.dotsEndRef) {
      this.ren.removeChild(this.bubbleContainerRef, this.dotsEndRef);
    }

    // Empty state array
    this.buttonsRef.length = 0;
  }

  /**
   * create button HTML element
   */
  private createButton(i: number): HTMLElement {
    const bubbleButton = this.ren.createElement('div');
    const text = this.ren.createText(String(i + 1));

    // add class & text
    this.ren.addClass(bubbleButton, 'g-bubble');
    this.ren.setStyle(bubbleButton, 'margin-right', '8px');
    this.ren.appendChild(bubbleButton, text);

    // react on click
    this.ren.listen(bubbleButton, 'click', () => {
      this.switchPage(i);
    });

    // render on UI
    this.ren.appendChild(this.bubbleContainerRef, bubbleButton);

    // set style to hidden by default
    this.ren.setStyle(bubbleButton, 'display', 'none');

    return bubbleButton;
  }

  /**
   * helper function to create dots (....) on DOM indicating that there are
   * many more bubbles until the last one
   */
  private createDotsElement(): HTMLElement {
    const dotsEl = this.ren.createElement('span');
    const dotsText = this.ren.createText('.....');

    // add class
    this.ren.setStyle(dotsEl, 'font-size', '18px');
    this.ren.setStyle(dotsEl, 'margin-right', '8px');
    this.ren.setStyle(dotsEl, 'padding-top', '6px');
    this.ren.setStyle(dotsEl, 'color', '#919191');

    // append text to element
    this.ren.appendChild(dotsEl, dotsText);

    // render dots to UI
    this.ren.appendChild(this.bubbleContainerRef, dotsEl);

    // set style none by default
    this.ren.setStyle(dotsEl, 'display', 'none');

    return dotsEl;
  }

  /**
   * Helper function to switch page
   */
  private switchPage(i: number): void {
    if (!this.matPag) {
      return;
    }

    const previousPageIndex = this.matPag.pageIndex;

    // switch page index of mat paginator
    this.matPag.pageIndex = i;

    // change active button styles
    this.changeActiveButtonStyles(previousPageIndex, this.matPag.pageIndex);

    // need to trigger page event manually, because we are changing pageIndex programmatically
    this.matPag.page.emit({
      pageIndex: i,
      pageSize: this.matPag.pageSize,
      length: this.matPag.length,
      previousPageIndex: previousPageIndex,
    });
  }
}
```

### Injecting Dependencies

```typescript
inject(MatPaginator, { optional: true, self: true, host: true });
inject(ElementRef);
inject(Renderer2);
```

- `MatPaginator` - we hook into its current `pageIndex`, `pageSize`, and its `page` stream
- `ElementRef` - root element of the paginator (so we can query its internals)
- `Renderer2` - the safe way to create elements, set styles/classes, and listen to events. Works nicely with SSR and avoids direct DOM APIs

### Input / Output Bindings

- `showFirstButton = input(true);` & `showLastButton  = input(true);` - whether to display first and last buttons for fast navigation on the start / end of the table
- `renderButtonsNumber = input(2);` - when you are on an active page, let’s say index `6` , then how many buttons before and after should we display
- `paginationSize` - this input is required to detect changes in the table length (after filtering or loading new data). When it changes, the directive re-renders the bubbles to match the correct number of pages

### Core Logic Execution

The directive itself is around 300 lines of code, but when you try to understand how it works, the main logic is inside the `buildButtonsEffect` effect, such as:

```typescript
readonly buildButtonsEffect = afterRenderEffect(() => {
  // rebuild buttons when pagination size change
  this.paginationSize();

  untracked(() => {
    // remove buttons before creating new ones
    this.removeButtons();

    // set some default styles to mat pagination
    this.styleDefaultPagination();

    // create bubble container
    this.createBubbleDivRef();

    // create all buttons
    this.buildButtons();

    // switch back to page 0
    this.switchPage(0);
  });
});
```

What is great about the effect, is that, it will re-execute when length (size) of the elements change, so for example if you have one table, but doing server-side data filtering, then each time new data arrives, bubbles will be recalculated due to `paginationSize` signal input. The brief overview is described below.

- `paginationSize` - listen on page size changes (on new data) to recalculate bubbles
- `removeButtons()` – clear previous custom DOM (if re-running)
- `styleDefaultPagination()` – hide certain default Material bits and position labels
- `createBubbleDivRef()` – create a container where our bubbles will live
- `buildButtons()` – create bubbles + dots based on total length and page size
- `switchPage(0)` – start from page 0 to keep things predictable

You may also ask, why we use `afterRenderEffect` instead of `effect` ? The reason is that `afterRenderEffect` is executed only in the browser, but `effect` also runs on the server side. It could lead to some errors if your app supports SSR. For a deeper explanation, check out my [afterRenderEffect, afterNextRender, afterEveryRender & Renderer2 article](https://www.angularspace.com/afterrendereffect-afternextrender-aftereveryrender-renderer2/).

### Core Logic Execution - Switching Page Manually

The custom bubbles live outside Angular Material’s built-in controls. That means when a user clicks a bubble, nothing in `MatPaginator` fires by itself, we have to connect the click to the paginator so the table (and anyone subscribed to `matPag.page`) reacts, hence the need for `switchPage()` function.

```typescript
private createButton(index: number): HTMLElement {
  // our unique bubble showing a specific page - 1, 2, etc.
  const bubbleButton = this.ren.createElement('div');

  // ... some code ...

  this.ren.listen(bubbleButton, 'click', () => {
    this.switchPage(index);
  });

  // ... some code ...
}

private switchPage(index: number): void {
  if (!this.matPag) {
    return;
  }

  const previousPageIndex = this.matPag.pageIndex;

  // switch page index of mat paginator
  this.matPag.pageIndex = index;

  // change active button styles
  this.changeActiveButtonStyles(previousPageIndex, this.matPag.pageIndex);

  // trigger page event manually, we are changing pageIndex programmatically
  this.matPag.page.emit({
    pageIndex: index,
    pageSize: this.matPag.pageSize,
    length: this.matPag.length,
    previousPageIndex: previousPageIndex,
  });
}
```

The key part of is `this.matPag.pageIndex = index;`, keeping the paginator’s internal state in sync with witch bubble was clicked. If you were to remove this line, the pagination would stop working.

Next, since we are programmatically changing the index of the paginator (mentioned above), when you navigate though the items in the table, the `this.matPag.page` will not emit by itself, therefore we also need to manually emit this data.

### Paginator Style Updates

Inside `styleDefaultPagination`, you can see we’re directly accessing the paginator’s internal HTML elements to restyle them. Is this ideal? Probably not. Since it relies on exact class selectors like `button.mat-mdc-paginator-navigation-next`, it’s fragile. These internal selectors can change between Material versions.

This already happened when Material v15 introduced the new MDC components, which broke custom styling for many projects using `::ng-deep`. What we’re doing here is a similar kind of hack, but for our use case it’s the most practical solution available. Still, it’s worth being aware of the tradeoff.

### Custom Styles

Once the logic is done, we still need some styling to make it actually look like bubbles. This part is mostly CSS (or SCSS), and you can adjust it to fit your own theme. In my example, each bubble is a simple flex container with centered text, a hover state, and an active state to highlight the current page.

```css
/* Custom paginator styles */
.g-bubble-container {
  display: flex;
  gap: 4px;
}

.g-bubble {
  background-color: #f0f0f0;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2e2e2e;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #636363;
    color: orange;
  }
}

.g-bubble__active {
  background-color: #636363;
  color: orange;
}

mat-paginator {
  background: transparent !important;
  /* need mat-paginator range to align with other mat-table elements */
  position: relative;
}

/* override alignment for the labels that shows "x of y" */
.mat-mdc-paginator-range-label {
  margin: 0 !important;
}
```

### Things to Keep in Mind

There are a few small details that are good to keep in mind:

- Renderer2 limitations - you can’t directly use pseudo-classes (`::before`, `::after`) from within the directive, keep your visual parts inside SCSS files
- Changing Angular Material internals - as mentioned earlier, `mat-mdc-` selectors can change in future Material versions, it’s one of the risks of this directive
- Accessibility (a11y) - since these are custom clickable divs, you might want to add `role="button"` and `tabindex="0"` attributes so users can navigate the bubbles with a keyboard. You can also listen for `keydown` events and simulate click behavior with the space or enter key
- SSR / Hydration - if you’re running Angular SSR, the directive should still work fine, since `Renderer2` is SSR safe and we are using `afterRenderEffect` to render bubbles only on the client-side
- Active Button State - currently when we load more data into the table and re-execute the logic of rendering bubbles, we go back to the first page, so no active state was implemented yet
- Important input `[appBubblePaginationLength]` to bound the table length. Without it, the `afterRenderEffect` will not be notified that new data have arrived and buttons will not be rebuilt

### Summary

By the end of this post, you should have a working, MDC compatible paginator. The goal here wasn’t to replace Angular Material, but to show how far you can go using directives + Renderer2, to enhance an existing Material component, without creating your own custom paginator from scratch.

Of course there may be some room for improvement, it is still a simple directive, so if you have any suggestions, feel free to comment. Hope you liked this example, catch more of my articles on [dev.to](https://dev.to/krivanek06), connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or check my [Personal Website](https://eduardkrivanek.com/).
