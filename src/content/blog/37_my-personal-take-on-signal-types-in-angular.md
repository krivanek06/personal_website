---
title: 'My Personal Take On Signal Types In Angular'
seoTitle: 'My Personal Take On Signal Types In Angular'
seoDescription: 'Personal opinion on signal use-cases, how I use them and what would be the RxJS equivalents'
slug: 37_my-personal-take-on-signal-types-in-angular
tags: javascript, angular, rxjs, opinion
order: 37
datePublished: 18.03.2025
readTime: 10
coverImage: article-cover/37_signal-types-personal-take.jpg
---

On May 3, 2023, signals were introduced in Angular v16 as a reactive variable for managing application state. While it was a new feature at the time, by Angular v19.2, signals have already become a well-established API. Although not all legacy corporate projects have adopted signals, most developers are aware of them (whether in a positive light or not).

In the latest (currently v19.2) we have signal APIs such as `httpResource`, `rxResource` / `resource` &`linkedSignal`. In this article I want to give my thoughts on signals, how I look at signals, in which situation I use them, and how they compare to alternative approaches, such as RxJS solving the same problem.

## Signal Primitives

[Reading Angular’s documentation](https://angular.dev/guide/signals), they describe that `signal()` is a wrapper around any primitives or complex data structure that notifies consumers when the value changes.

I use `signal()` whenever a variable is used in the DOM and its value updates over time. A common example is toggling between components using two buttons to control which component is displayed.

```typescript
@Component({
  selector: 'app-test',
  template: `
    <button (click)="onViewChange('card')" type="button">Card View</button>
    <button (click)="onViewChange('grid')" type="button">Grid View</button>

    @if (viewControl() === 'grid') {
      <app-grid-view />
    } @else if (viewControl() === 'card') {
      <app-card-view />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TestComponent {
  viewControl = signal<'grid' | 'card'>('grid');

  onViewChange(view: 'grid' | 'card'): void {
    this.viewControl.update(() => view);
  }
}
```

Is `signal()` the only viable option for this? Not really. An alternative approach could be to create a child component implementing `ControlValueAccessor` and manage state using reactive forms in the parent to control which view is displayed.

```typescript
@Component({
  selector: 'app-test',
  template: `
    <app-button-grid-card-view-change [formControl]="viewControl" />

    @if (viewControl.value === 'grid') {
      <app-grid-view />
    } @else if (viewControl.value === 'card') {
      <app-card-view />
    }
  `,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TestComponent {
  viewControl = new FormControl<'grid' | 'card'>('grid');
}
```

Creating a separate component for our buttons is a realistic approach, especially when dealing with multiple buttons and more complex logic. Worth mentioning that this example will not work with zoneless apps, because `viewControl.value` is not reactive. The framework will not know about the change. It might work in apps with zone.js, but only because of the "click" event, which is patched by zone.js.

Instead of using reactive forms, we can improve this scenario by leveraging the [`model()` signal](https://angular.dev/api/core/model) in the child component. This allows the child to notify the parent about which button was clicked, effectively delegating the responsibility of toggling between `card` and `grid` views to the child component. Note that `viewModel` is a `viewModel = model<'grid' | 'card'>('grid')` in the child component.

```typescript
@Component({
  selector: 'app-test',
  template: `
    <app-button-grid-card-view-change [(viewModel)]="viewControl" />

    @if (viewControl() === 'grid') {
      <app-grid-view />
    } @else if (viewControl() === 'card') {
      <app-card-view />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TestComponent {
  viewControl = signal<'grid' | 'card'>('grid');
}
```

This is all well and good. We now have at least three (if not more) different ways to solve the same problem, and honestly, the differences between them aren’t that significant. Based on the examples, I’d lean toward the third solution. However, as a big RxJS fanboy, I want to dive deeper into `effect`, `httpResource`, `rxResource`, and `linkedSignal`, how they simplify code, yet still have (for now) some limitations when it comes to shaping the result value.

## Opinion On Effect

When `effect()` was introduced alongside Angular signals, it's safe to say we all overused it. For a while, one of the most Googled questions was:

> How to fix: Writing to signals is not allowed in a computed or an effect by default. Use allowSignalWrites ….

We quickly discovered that creating infinite loops was easier than we’d like to admit. A classic example looks something like this:

```typescript
effect(() => {
  const user = authUser();
  this.methodReadsAndUpdatedSignals(a);
});
```

Later, we discovered that we could use `untracked()` inside `effect()`, essentially wrapping most of our code in it, to prevent infinite loops. What’s interesting is that, despite `effect()` being part of the Angular signal API, Angular actually discourages its use except in [very rare cases](https://angular.dev/guide/signals#effects).

When I built [ggfinance.io](https://ggfinance.io/) (_small promo_ 😏), a mid-sized application, I found myself using `effect()` only in the following scenarios:

- DOM – Initializing charts
- DOM – Displaying data in Angular Material tables
- DOM – Creating structural directives that modify the view based on signal (store) changes
- LOG – Logging signal changes

```typescript
@Component({
  selector: 'app-test',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule],
  template: `
    <table mat-table mat-sort [dataSource]="dataSource">
      <!-- display columns -->
    </table>
    <mat-paginator />
  `,
})
export class TestComponent {
  data = input<unknown[]>();

  paginator = viewChild(MatPaginator);
  sort = viewChild(MatSort);

  displayedColumns = ['col1', 'col2'];
  dataSource = new MatTableDataSource<unknown>([]);

  tableEffect = effect(() => {
    const data = this.data();

    untracked(() => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator() ?? null;
      this.dataSource.sort = this.sort() ?? null;
      this.dataSource._updateChangeSubscription();
    });
  });
}
```

Although `effect` is a building block as such, mainly to issue side-effect tasks, run an independent computation when one or more input values change, other alternatives are preferred when creating a new reactive data structure used in the DOM. Upon a later discovery, as I was writing this article, I realized that you solve some of the mentioned problems with `computed()`, such as rewriting the mat-table data population as such.

```typescript
@Component({
  selector: 'app-test',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule],
  template: `
    <table mat-table mat-sort [dataSource]="tableData()">
      <!-- display columns -->
    </table>
    <mat-paginator />
  `,
})
export class TestComponent {
  data = input<unknown[]>();

  paginator = viewChild(MatPaginator);
  sort = viewChild(MatSort);

  displayedColumns = ['col1', 'col2'];

  tableData = computed(() => {
    const data = this.data();
    const dataSource = new MatTableDataSource<unknown>([]);

    dataSource.data = data;
    dataSource.paginator = this.paginator() ?? null;
    dataSource.sort = this.sort() ?? null;

    return dataSource;
  });
}
```

## Opinion On linkedSignal

While `computed()` is a signal whose value is derived or computed from one or more other signals (dependencies), it is inherently a readonly signal. However, there are cases when you need to compute a signal, update its value over time, and then reset it back to its initial state when a dependency changes.

An example of this might be in an online store, ordering application, or a simple SaaS app. Imagine you have a scenario where a user selects an item. The initial quantity will always be 1, but the user can increment the quantity. However, when a new item is selected, the quantity should reset to 1.

Below are two examples of how to achieve this behavior, both before and after the introduction of `linkedSignal()`.

```typescript
// EXAMPLE BEFORE linkedSignal()
itemSelected = signal<unknown>(null);
itemUnits = signal(1);

// everytime a new item is selected, reset units to 0
itemUnitsEffect = effect(() => {
  const selected = this.itemSelected();

  untracked(() => {
    this.itemUnits.set(1);
  });
});
```

```typescript
// EXAMPLE USING linkedSignal()
itemSelected = signal<unknown>(null);

itemUnits = linkedSignal({
  source: this.itemSelected,
  computation: () => 1,
});
```

I think `linkedSignal()` particularly useful in cases where:

- State reset on dependency change, like in the example of selecting a product on an e-commerce site and resetting quantities back to the default value when a new item is selected.
- Conditional state, when you want to link one signal’s state to another and have the ability to reset or adjust its value based on the context of the other signal.
- Complex UI interactions, such as wizards or multi-step forms, where one step’s state depends on another, and you need to preserve or reset values depending on the flow.

That said, `linkedSignal()` might not be necessary for every use case. It’s useful for scenarios where you need more than just a computed signal but don’t want to deal with the complexity of manually resetting or synchronizing state.

## Opinion On httpResource & rxResource/resource

The recent Angular versions introduced two useful signal APIs designed to work with async data:

- `httpResource` – [available in version 19.2](https://github.com/angular/angular/pull/59876)
- `rxResource`/`resource` – [available in version 19.0](https://github.com/angular/angular/pull/58255)

Initially, I had mixed feelings about these two functions because, since we can achieve very similar behavior using RxJS. However, I realized that the long-term goal of the Angular team seems to be reducing the reliance on RxJS. Looking at `httpResource`, its description says:

> Uses HttpClient to make requests and supports interceptors, testing, and other features of the HttpClient API. Data is parsed as JSON by default.

```typescript
data1 = toSignal(this.http.get<unknown>('...').pipe(map(d => d.data)), {
  initialValue: [],
});

data2 = httpResource<unknown[]>(
  () => ({
    method: 'GET',
    url: '',
  }),
  { defaultValue: [], parse: (d): unknown[] => d.data }
);
```

At first, I thought the two approaches were almost identical. However, I quickly realized I was mistaken. The `httpResource` API provides additional built-in states like `isLoading` and `error`, which are incredibly useful for tracking the request’s status.

Furthermore, because `httpResource` is a `WritableResource`, it allows not just to observe state changes but also directly manipulate that state, manually setting the state of the signal, such as `data2.set([])`. This contrasts with the traditional `toSignal` API, which is a read-only signal.

Additionally, `httpResource` gives us the `progress` of the HTTP request, and we can use `reload()` to trigger the HTTP request again.

Let’s look at the following example. We have a search bar that loads items based on the prefix and selected genres, and when an item is selected, the search results will be dismissed.

![Overview Of A Simple Search](./article-images/37_signal-types-personal-take-search-overview.png)

To achieve this behavior with the new signal APIs, we could implement something like the code below. I’d say the code is definitely easy to read and doesn’t require RxJS.

As you type into the input, the values are saved in the `searchControl` signal. When the genre is changed, it gets saved in the `selectedGenresId` signal. I haven’t included the HTML part since I believe it's not crucial for this example.

```typescript
export class SearchComponent {
  private apiService = inject(AnimeApiService);

  selectedData = output<AnimeData>();

  // control signal to select a genre and item prefix
  searchControl = signal('');
  selectedGenresId = signal<number>(1);

  // load options if genre or prefix changes
  searchedDataResource = rxResource({
    request: () => ({
      genresId: this.selectedGenresId(),
      prefix: this.searchControl(),
    }),
    loader: ({ request }) =>
      this.apiService.searchAnime(request.prefix, request.genresId),
    defaultValue: [],
  });

  onGenresClick(id: number): void {
    this.selectedGenresId.set(id);
  }

  onClick(animeData: AnimeData): void {
    // emit to parent
    this.selectedData.emit(animeData);
    // reset displayed data
    this.searchedDataResource.value.set([]);
  }
}
```

One small thing I’d like to highlight with this approach is the difference between [declarative and imperative programming](https://dev.to/krivanek06/from-chaos-to-clarity-simplify-your-angular-code-with-declarative-programming-58gm).

In the `searchedDataResource`, we have the loaded items. However, when an item is selected, we imperatively change `searchedDataResource` to an empty array, somewhere in the program, to hide the loaded results.

The question I want to explore is: What would be the RxJS equivalent of this code, where we want to keep track of both the loading and error states of network requests?

```typescript
export class SearchComponent {
  private apiService = inject(AnimeApiService);

  // control for item prefix
  searchControl = new FormControl<string>('', {
    nonNullable: true,
  });

  // control to select a genre
  selectedGenresIdControl = new FormControl<number>(1, {
    nonNullable: true,
  });

  selectedData$ = new Subject<AnimeData>();

  // notifies parent when item is selected
  selectedAnime = outputFromObservable(this.selectedAnime$);

  searchedData = toSignal(
    this.selectedGenresIdControl.valueChanges.pipe(
      switchMap(genderId =>
        this.searchControl.valueChanges.pipe(
          // search immediatelly with new genres
          startWith(this.searchControl.value),
          // load from API
          switchMap(name =>
            this.apiService.searchAnime(name, genderId).pipe(
              map(data => ({ data, isLoading: false })),
              startWith({ data: [], isLoading: true }),
              catchError(e => of({ data: [], error: e, isLoading: false }))
            )
          ),
          // listen on select and reset the data
          switchMap(result =>
            this.selectedData$.pipe(
              map(() => ({ data: [], isLoading: false })),
              startWith(result)
            )
          )
        )
      )
    ),
    { initialValue: { data: [] as AnimeData[], isLoading: false } }
  );

  onClick(data: AnimeData): void {
    this.selectedData$.next(data);
  }
}
```

One might argue that the `rxResource` version is shorter, more readable, therefore a better choice. While readability certainly wins here, what I personally miss from signals are the utility functions that RxJS provides, such as `distinctUntilChanged()`, `debounceTime()`, and others for manipulating data.

To further reduce the complexity in RxJS, which typically handles the loading and error states of network requests, you can abstract the logic by [creating custom RxJS operators](https://dev.to/this-is-angular/create-custom-rxjs-operators-edd).

If you want to minimize RxJS usage, but still need functionality like debouncing, you could either use [Lodash](https://lodash.com/docs/4.17.15) or combine RxJS with `rxResource` to achieve something like this:

```typescript
export class AnimeSearchNewComponent {
  private readonly apiService = inject(AnimeApiService);

  // control signal to select a genre and item prefix
  readonly searchControl = signal('');
  readonly searchControlSignal = toSignal(
    toObservable(this.searchControl).pipe(distinctUntilChanged(), debounceTime(300))
  );

  // load options if genre or prefix changes
  readonly searchedDataResource = rxResource({
    request: () => ({
      prefix: this.searchControlUsed(),
    }),
    loader: ({ request }) => this.apiService.searchAnime(request.prefix),
    defaultValue: [],
  });
}
```

One thing to consider with signals is that while they provide a simpler API for managing state, RxJS still has its place for more complex scenarios where you need to do heavy data transformation or work with [higher-order observables](https://dev.to/krivanek06/angular-interview-what-is-higher-order-observable-2k03). Signals shine in cases where you just need to track a value and its changes, whereas RxJS excels when you're dealing with multiple asynchronous streams, operators like `combineLatest` or `switchMap`, and complex transformations.

## Summary

No one can argue that Angular's team doesn't deliver new and useful features. Perhaps it’s because I’ve been part of the ecosystem for so long, or because of my experience with RxJS, that I feel the need to discuss this topic. It’s also worth mentioning the new RFCs about resource architecture:

- [Resource RFC 1: Architecture](https://github.com/angular/angular/discussions/60120)
- [Resource RFC 2: APIs](https://github.com/angular/angular/discussions/60121)

The ongoing RFCs about the resource architecture will likely shape the direction Angular takes with handling asynchronous data.

When I first set out to write this article, I didn’t quite understand the usefulness of `rxResource` and `httpResource`, thinking that you could achieve the same or similar results with signals. However, after creating a small example of the search box – [available on GitHub](https://github.com/krivanek06/stackblitz-signal-example) – I came to appreciate that having more options to accomplish the same result is actually a good thing. Whether you choose RxJS or signals depends on your preferences and the needs of your project as both have their place in Angular development.

Finally I do recommend taking a look on [HttpResource in Angular 19.2 from Decoded Frontend](https://www.youtube.com/watch?v=GXzPlaF3-bE) as he explains lots of functionalities with the `HttpResource`. I hope you enjoyed my musings on this topic. You can also read more from me on [dev.to](https://dev.to/krivanek06) or connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek).
