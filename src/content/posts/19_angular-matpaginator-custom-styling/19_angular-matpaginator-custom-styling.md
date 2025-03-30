As a frontend developer you most likely had a task to display data in a table and as an Angular frontend developer, you probably picked [Angular Material](https://material.angular.io/) to do so.

In my previous article [Angular: Infinite Scrolling](https://dev.to/krivanek06/angular-infinite-scrolling-2jab) I mentioned how you can infinite table scrolling starting with a initial few elements, however despite it is a good UX solution, sometimes we have to go with the traditional pagination.

When you search for [MatPaginator](https://material.angular.io/components/paginator/overview) you find your solution, however, one thing to note … Angular’s pagination doesn’t look appealing at all. Wouldn't it be nice if we could keep its navigation, but change its visuals into something else?

## The Goal

In the following article we will walk step-by-step how we can implement a custom directive and attach it to the `mat-paginator` which will completly change its UI to the example below.

The whole source code is available on [StackBlitz](https://stackblitz.com/edit/stackblitz-starters-jab6ez).

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bqb5yz1cwqy5lz9p05g8.gif)

We will create a directive called `appBubblePagination`, which will leverage the power of `Renderer2` to create custom UI elements replacing the default pagination layout, and the directive usage will be as follows:

```tsx
<table mat-table [dataSource]="dataSource" [trackBy]="identity">
		<!-- table content -->
</table>

<mat-paginator
  appBubblePagination
  [appCustomLength]="dataSource.data.length"
  [length]="dataSource.data.length"
  [pageSize]="20"
>
</mat-paginator>
```

## Step 1.) Create a Directive

To achieve the goal of changing the visual aspect of the mat-pagination, we create a directive and import the following dependencies.

```tsx
@Directive({
  selector: '[appBubblePagination]',
  standalone: true,
})
export class BubblePaginationDirective {
  constructor(
    @Host() @Self() @Optional() private readonly matPag: MatPaginator,
    private elementRef: ElementRef,
    private ren: Renderer2
  ) {}
}
```

The dependencies are used as follows:

- `MatPaginator` - is the reference to the attached `mat-paginator`. It will be used to manually change the pagination index by clicking on custom bubbles.
- `ElementRef` - is the reference to the DOM elements (`mat-paginator`) to which the directive is attached. It will be used to get the reference where to render additional HTML elements. Read more on [Angular docs](https://angular.io/api/core/ElementRef).
- `Renderer2` - allows to render HTML elements, add/remove css classes and attach listeners (click, hover). Read more on [Angular docs](https://angular.io/api/core/Renderer2).

## Step 2.) Modify Default Layout

Next, we want to slightly change the visual aspect of the default pagination. Below is the illustration of the starting and ending state.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qxix1lwhgjdls6sqdw3b.jpg)

The changes include:

- Removing “items per page” text
- Put the current pagination number (1-20) to right and modify its visuals

With the dependencies `ElementRef` and `Renderer2`, we modify the layout as follows:

```tsx
export class BubblePaginationDirective implements AfterViewInit {
  ngAfterViewInit(): void {
    this.styleDefaultPagination();
  }

  private styleDefaultPagination() {
    const nativeElement = this.elementRef.nativeElement;

    const itemsPerPage = nativeElement.querySelector('.mat-mdc-paginator-page-size');
    const howManyDisplayedEl = nativeElement.querySelector('.mat-mdc-paginator-range-label');

    // remove 'items per page'
    this.ren.setStyle(itemsPerPage, 'display', 'none');

    // style text of how many elements are currently displayed
    this.ren.setStyle(howManyDisplayedEl, 'position', 'absolute');
    this.ren.setStyle(howManyDisplayedEl, 'left', '0');
    this.ren.setStyle(howManyDisplayedEl, 'color', '#919191');
    this.ren.setStyle(howManyDisplayedEl, 'font-size', '14px');
  }
}
```

## Step 3.) Insert a DIV between Navigation Button

Upon inspecting the HTML element we see that there is a `mat-mdc-paginator-range-actions` class attached to a div wrapper element. We want to target this div and insert a new `div` element between the left and right arrow buttons. It will be used as a place where to generate the custom bubble pagination buttons.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vavlx0b4jywktk2b293a.png)

```tsx
ngAfterViewInit(): void {
    this.styleDefaultPagination();
    this.createBubbleDivRef();
  }

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
    this.ren.insertBefore(
      actionContainer,
      this.bubbleContainerRef,
      nextButtonDefault
    );
  }
```

We get the reference to the div wrapper element by `actionContainer`, however we also need the `nextButtonDefault` in order to properly attach our `div` element into DOM, where the buttons will be rendered. We also save this reference into `bubbleContainerRef`.

Using the `this.ren.insertBefore()` we attach the `div` element inside the `mat-mdc-paginator-range-actions` class, putting the `div` element before the pagination’s next button.

If we were used `this.ren.appendChild(actionContainer, this.bubbleContainerRef);` the end result would be rendered buttons after the arrow navigation.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qipnt88k7ov6o77fx6gi.png)

## Step 4.) Render Buttons to the DOM

In the fourth step, we want to render the first and the last button and add dots between them and the rest of the buttons. Even if we render everything the this example, what you will see that initially every element is set to `display: none`, where on the next step we will reveal only the necessary items.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qv6s4zpenvioeqr0627u.png)

```tsx
export class BubblePaginationDirective implements AfterViewInit {
  /**
   * how many elements are in the table
   */
  @Input() appCustomLength: number = 0;

  ngAfterViewInit(): void {
    this.styleDefaultPagination();
    this.createBubbleDivRef();
    this.buildButtons();
  }

	// .... previous code

  /**
   * end result: (1) .... (4) (5) (6) ... (25)
   */
  private buildButtons(): void {
    const neededButtons = Math.ceil(
      this.appCustomLength / this.matPag.pageSize
    );

    // if there is only one page, do not render buttons
    if (neededButtons === 1) {
      this.ren.setStyle(this.elementRef.nativeElement, 'display', 'none');
      return;
    }

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
    this.buttonsRef = [
      ...this.buttonsRef,
      this.createButton(neededButtons - 1),
    ];
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
   * Helper function to switch page
   */
  private switchPage(i: number): void {
    const previousPageIndex = this.matPag.pageIndex;
    this.matPag.pageIndex = i;
    this.matPag['_emitPageEvent'](previousPageIndex);
  }
```

Let’s recap what’s going on.

Function `buildButtons()`:

- calculate how many pagination buttons to render by `neededButtons` as it is the total amount of the elements in the table (`appCustomLength`) divided by the pagination size.
- If elements in table are fewer than pagination size, we don’t render anything
- If there is more items in table (`neededButtons` > 1) we:
  - render the first button
  - render dots
  - render the remaining buttons except the last one
  - render dots
  - render the last button
- save the buttons from `createButton()` into `buttonsRef` array, as they will be needed later

Function `createButton()`:

- receives an index, increments it by one and attach this values as a text value to the button with some additional CSS classes
- every buttons is hidden from the DOM, set by `this.ren.setStyle(bubbleButton, 'display', 'none');`. On later step we display/hide some of them as user navigates by clicking on them.
- by attaching the click event listener on each button `this.ren.listen(bubbleButton, 'click' ...)`, we call the helper function `switchPage()` to change the current page.

From the above example the `createDotsElement()` is not present, as it is a renderer function similar to `createButton()` and we also create some CSS classes like `g-bubble` for styling.

Side-Note: In `switchPage()` I am not necessarily sure why with `_emitPageEvent` needs to emit the `previousPageIndex`. I wasn’t able to find an answer for it, but it works.

## Step 5.) Listen on User Navigation Clicks

As the last step we want to implement the logic that will listen to the user clicks on bubble buttons and change the active index with styling.

At this moment all the buttons are hidden and their reference is kept in `buttonsRef`. We want to display only the first 2-3 buttons and as the user navigates to either direction, we want to display additional 2 buttons to right and left, and also the dots between the first and the last buttons if the user is in the middle of the navigation.

```tsx
export class BubblePaginationDirective implements AfterViewInit {

	private buttonsRef: HTMLElement[] = [];

	// .... previous code

	ngAfterViewInit(): void {
    this.styleDefaultPagination();
    this.createBubbleDivRef();
    this.buildButtons();

    this.matPag.page
    .pipe(
      map((e) => [e.previousPageIndex ?? 0, e.pageIndex]),
      startWith([0, 0])
    )
    .subscribe(([prev, curr]) => {
      this.changeActiveButtonStyles(prev, curr);
    });
  }

	// .... previous code

	private changeActiveButtonStyles(previousIndex: number, newIndex: number) {
    const previouslyActive = this.buttonsRef[previousIndex];
    const currentActive = this.buttonsRef[newIndex];

    // remove active style from previously active button
    this.ren.removeClass(previouslyActive, 'g-bubble__active');

    // add active style to new active button
    this.ren.addClass(currentActive, 'g-bubble__active');

    // hide all buttons
    this.buttonsRef.forEach((button) =>
      this.ren.setStyle(button, 'display', 'none')
    );

    // show 2 previous buttons and 2 next buttons
    const renderElements = 2;
    const endDots = newIndex < this.buttonsRef.length - renderElements - 1;
    const startDots = newIndex - renderElements > 0;

    const firstButton = this.buttonsRef[0];
    const lastButton = this.buttonsRef[this.buttonsRef.length - 1];

    // last bubble and dots
    this.ren.setStyle(this.dotsEndRef, 'display', endDots ? 'block' : 'none');
    this.ren.setStyle(lastButton, 'display', endDots ? 'flex' : 'none');

    // first bubble and dots
    this.ren.setStyle(
      this.dotsStartRef,
      'display',
      startDots ? 'block' : 'none'
    );
    this.ren.setStyle(firstButton, 'display', startDots ? 'flex' : 'none');

		// resolve starting and ending index to show buttons
    const startingIndex = startDots ? newIndex - renderElements : 0;
    const endingIndex = endDots
      ? newIndex + renderElements
      : this.buttonsRef.length - 1;

    // display starting buttons
    for (let i = startingIndex; i <= endingIndex; i++) {
      const button = this.buttonsRef[i];
      this.ren.setStyle(button, 'display', 'flex');
    }
  }
```

Looks scary right 😓 ? No need to worry tho. Let’s walk thought each step what is happening in this function, help you to understand this nonsense to be able to change it later 🤗.

First, we want to subscribe to the `[this.matPag.page](http://this.matPag.page)` observable and get the previous and new clicked pagination index. The observable is triggered by each bubble button click, because in the previous step we attach `switchPage()` function to each bubble.

In `changeActiveButtonStyles()` the following happens:

- we swap the `g-bubble__active` from the previous active bubble into the new one, which highlight the current active button, by the provided new indexes to the function
- by default hide all buttons (`display: none`)
- determine whether to show end dots and the last button by `endDots`, if `newIndex` is not the last 2 buttons
- determine whether to show start dots on the beginning with the first button by `startDots`, if `newIndex` more than 2
- calculate the indexes to show buttons from the `buttonsRef`, to show 2 previous buttons (`startingIndex`) and 2 next buttons (`endingIndex`)
- change the display value for buttons that needs to be visible

## Summary

This blog post outlines how to modify the styling of Angular Material's MatPaginator component to create a custom pagination UI. The post walks through creating a custom directive, modifying the default layout, inserting a div between navigation buttons, rendering buttons to the DOM, and listening for user navigation clicks.

The end result is a custom pagination UI with bubble buttons and dots between the first and last buttons. The whole source code to this example is available on [StackBlitz](https://stackblitz.com/edit/stackblitz-starters-jab6ez).

Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
