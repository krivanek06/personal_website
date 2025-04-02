---
title: 'Angular: Infinite Scrolling'
seoTitle: 'Angular: Infinite Scrolling'
seoDescription: 'Rendering takes time. That is especially the case if you have to load large amounts of data from your...'
slug: 17_angular-infinite-scrolling
tags: javascript, angular, tutorial, beginner
order: 17
datePublished: 06.07.2023
readTime: 5
coverImage: article-cover/17_angular-infinite-scrolling.webp
---

Rendering takes time. That is especially the case if you have to load large amounts of data from your server and display them. Sometimes the server doesn’t handle pagination and returns the whole collection of data at once.

Of course, you don’t want to display 2000 elements for the user, because the more complex the components structure for the element is, the more time it will take to render. Rendering takes computer resources, and time, and the UI is blocked until everything is ready (if you don’t use web workers).

Usually, we want to display N amount of items until the user doesn’t want to see more. In the following article, I will present the solution I started to implement for custom pagination and infinite scroll.

## The Usual Solution

If you work with Angular, you most likely work with Angular Material too, When it comes to tables and pagination, we tend to use [MatTable](https://material.angular.io/components/table/overview) and [MatPaginator](https://material.angular.io/components/paginator/overview).

The problem with MatPaginator is that… it is just ugly 🤮 . There are solutions to use [Rendere2](https://angular.io/api/core/Renderer2) to change its look (I will create an article about it in the future), however nowadays most applications are adopting the infinite scroll solution (example: go to [youtube.com](https://www.youtube.com/) and start scrolling).

## The Problem

Let’s say we make an API call to the server and receive back 10 000 elements, as follows:

```TS
import { Observable, of } from 'rxjs';

export interface DummyData {
  id: number;
  firstName: string;
  // ...
}

export const dummyDataObs$: Observable<DummyData[]> = of(
  [...Array(10_000).keys()].map((index) => ({
    id: index,
    firstName: `firstName_${index}`,
    // ...
  }))
);
```

We want to display this data in MatTable (it is not required to use material table I just find it convenient) and we end up with the following code:

```tsx
// imports

@Component({
  selector: 'app-simple-table',
  styleUrls: ['./simple-table.component.css'],
  standalone: true,
  imports: [
    /* ... */
  ],
  template: `
    <table mat-table [dataSource]="dataSourceSignal()" [trackBy]="identity">
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>Id</th>
        <td mat-cell *matCellDef="let row">
          {{ row.id }}
        </td>
      </ng-container>

      <ng-container matColumnDef="firstName">
        <th mat-header-cell *matHeaderCellDef>First Name</th>
        <td mat-cell *matCellDef="let row">
          {{ row.firstName }}
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
})
export class SimpleTableComponent {
  @Input({ required: true }) set dummyData(data: DummyData[]) {
    this.dummyDataSignal.set(data);
    this.limitSignal.set(30);
  }

  // internal collection of DummyData
  private dummyDataSignal = signal<DummyData[]>([]);

  // how many elements I want to display
  private limitSignal = signal<number>(30);

  dataSourceSignal = computed(() => {
    // slice data to display only portion of them
    const data = this.dummyDataSignal().slice(0, this.limitSignal());

    // create correct data structure
    return new MatTableDataSource<DummyData>(data);
  });

  displayedColumns: string[] = ['id', 'firstName'];

  // tracking indentity for rendering
  identity: TrackByFunction<DummyData> = (_, item: DummyData) => item.id;
}
```

In the above example we have a `limitSignal` signal which has an initial value of 30 elements. Every time we either increase the `limitSignal` value, to display additional elements or we receive a new collection of data saved into `dummyDataSignal` we `compute` a new `dataSourceSignal` and pass its value into the table `[dataSource]="dataSourceSignal()"`.

Everything is fine, except the question is, how will we know when the user scrolled to the end of the table to display more elements?

## Creating a Scrolling Directive

The best possible scenario I could come up with is to create an `appScrollNearEnd` directive, that we can attach to any element and it will emit a value to the parent component if the user scrolled to the end of the page.

> **_NOTE:_** Because we implement an infinite scroll, the solution will only work if the table is the last component in the page. This is usually the case as if you once have an infinite scroll attached to anything, it is most likely your last element, however, I just wanted to highlight this, because the computation involves accessing the page height and calculating whether we approach its end or not.

```tsx
// imports ...

@Directive({
  selector: '[appScrollNearEnd]',
  standalone: true,
})
export class ScrollNearEndDirective implements OnInit {
  @Output() nearEnd: EventEmitter<void> = new EventEmitter<void>();

  /**
   * threshold in PX when to emit before page end scroll
   */
  @Input() threshold = 120;

  private window!: Window;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // save window object for type safety
    this.window = window;
  }

  @HostListener('window:scroll', ['$event.target'])
  windowScrollEvent(event: KeyboardEvent) {
    // height of whole window page
    const heightOfWholePage = this.window.document.documentElement.scrollHeight;

    // how big in pixels the element is
    const heightOfElement = this.el.nativeElement.scrollHeight;

    // currently scrolled Y position
    const currentScrolledY = this.window.scrollY;

    // height of opened window - shrinks if console is opened
    const innerHeight = this.window.innerHeight;

    /**
     * the area between the start of the page and when this element is visible
     * in the parent component
     */
    const spaceOfElementAndPage = heightOfWholePage - heightOfElement;

    // calculated whether we are near the end
    const scrollToBottom = heightOfElement - innerHeight - currentScrolledY + spaceOfElementAndPage;

    // if the user is near end
    if (scrollToBottom < this.threshold) {
      this.nearEnd.emit();
    }
  }
}
```

The inspiration for the above code came from the Stack Overflow thread - [How to detect scroll to bottom of html element](https://stackoverflow.com/questions/40664766/how-to-detect-scroll-to-bottom-of-html-element). Every time the user scrolls to the page the `windowScrollEvent` function will be triggered. So how it works?

- Get the height of the whole page - `heightOfWholePage`
- Get the height of the element to which the directive is attached - `heightOfElement`
- Get the current Y scroll position (change by scrolling) - `currentScrolledY`
- Get the height of the viewed window (constant value, but shrinks if dev tools is open) - `innerHeight`
- Calculate the space between the element to which the directive is attached and the start of the page (constant value) - `spaceOfElementAndPage`
- Calculate `scrollToBottom` by subtracting from the table’s height the window size and the scrolled position, but adding back the space between the table and the start of the page, otherwise, you would get negative values

We can import the `ScrollNearEndDirective` to our `SimpleTableComponent`, attach it to the table and display more elements, every time `nearEnd` emits:

```tsx
// imports

@Component({
  selector: 'app-simple-table',
  styleUrls: ['./simple-table.component.css'],
  standalone: true,
  imports: [
    /* ... */
  ],
  template: `
    <div style="height: 50px;">this is spaceOfElementAndPage = 50</div>

    <table
      appScrollNearEnd
      (nearEnd)="onNearEndScroll()"
      mat-table
      [dataSource]="dataSourceSignal()"
      [trackBy]="identity">
      <!-- content of the table -->
    </table>
  `,
})
export class SimpleTableComponent {
  private limitSignal = signal<number>(30);

  // ... Previous logic

  // increase the number of displayed items
  onNearEndScroll(): void {
    this.limitSignal.update(val => val + this.defaultValue);
  }
}
```

The final result is below and the code is available on [stackblitz](https://stackblitz.com/edit/stackblitz-starters-q99hbb?file=src%2Fscroll-near-end.directive.ts) if you want to play with it.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x3xkd9swm86kcif6wkpy.gif)
