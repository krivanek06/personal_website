---
title: 'Angular Interview: What is a Higher-Order Observable?'
seoTitle: 'Angular Interview: What is a Higher-Order Observable?'
seoDescription: 'One of the most common questions in Angular interviews is “what is a Higher-Order Observable”?...'
slug: 18_angular-interview-what-is-higher-order-observable
tags: javascript, angular, rxjs, interview
order: 18
datePublished: 09.07.2023
readTime: 5
coverImage: article-cover/18_angular-interview-what-is-higher-order-observable.webp
---

One of the most common questions in Angular interviews is “_what is a Higher-Order Observable_”?

It is a question, that I used or was asked multiple times, which can immediately tell you a decent enough information of how skillful the person is with RxJs. Let’s first take a look at what is a Higher-Order Function in Javascript and then discuss what it means in what world of Observables.

## Higher-Order Functions

In JS, Higher-Order Functions (HOF) are functions that can accept other functions as arguments and/or return functions as their results. They treat functions as values, allowing them to manipulate and compose them to create more flexible code.

HOF provides a way to abstract and encapsulate common patterns of behavior in your code, making it more reusable and expressive. Here is an example in TS:

```tsx
const fetchData = async <T>(
		url: string,
		onSuccess: (d: T) => T,
		onError: (e: any) => void
): Promise<T | null> => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return onSuccess(data);
  } catch (error) {
    onError(error);
  }
  return null;
};

const apiUrl = 'https://api.example.com/data';

const data = fetchData<string>(
	apiUrl,
	(data) => {
			console.log(data)
			return data
	},
	(err) => console.log(err)
);
```

Even tho the name higher-order may sound like a foreign word, you most likely encountered them on a daily basis by manipulating arrays such as:

```tsx
const numbers = [1, 2, 3, 4, 5];

// Output: [2, 4, 6, 8, 10]
const doubledNumbers = numbers.map(n => n * 2);

// Output: [2, 4]
const evenNumbers = numbers.filter(n => n % 2 === 0);

// Output: 15
const sum = numbers.reduce((acc, curr) => {
  return acc + curr;
}, 0);
```

## Higher-Order Observables

The concept of Higher-Order Observables is an extension of the concept of Higher-Order Functions, where observables accept or emit other observables.

In RxJs there are four operators which qualify as Higher-Order Observables, those are:

- [switchMap](https://www.learnrxjs.io/learn-rxjs/operators/transformation/switchmap)
- [concatMap](https://www.learnrxjs.io/learn-rxjs/operators/transformation/concatmap)
- [mergeMap](https://www.learnrxjs.io/learn-rxjs/operators/transformation/mergemap)
- [exhaustMap](https://www.learnrxjs.io/learn-rxjs/operators/transformation/exhaustmap)

Examples of where you may be using these operators are having an auto-complete form, listening to its value change, and loading items from the server, based on the user’s input. Here is a small code snippet highlighting the example.

```tsx
@Component({
  selector: 'app-search-basic',
  standalone: true,
  imports: [
    /* imports */
  ],
  template: `
    <mat-form-field>
      <mat-label>Search</mat-label>
      <input type="text" matInput [formControl]="searchControl" />

      <mat-autocomplete #auto="matAutocomplete">
        <!-- loaded data -->
        <mat-option *ngFor="let data of options()" [value]="data">
          {{ data.name }}
        </mat-option>
      </mat-autocomplete>
    </mat-form-field>
  `,
})
export class SearchBasicComponent {
  searchControl = new FormControl<string>('', { nonNullable: true });

  userService = inject(UserService);

  options = signal<User[]>([]);

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        tap(value => this.options.set([])),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(value => this.userService.searchUsers(value).pipe(catchError(() => []))),
        tap(data => this.options.set(data)),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
```

### SwitchMap

RxJs `switchMap` is the most common operator for accepting and returning an observable. Putting this operator into the chain, you indicates that you are no longer concerned with the response of the previous request when a new input arrives resulting in a canceling effect of the previous inner observable. Illustration from [rxjs.dev](https://rxjs.dev/api/operators/switchMap)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/cocghpd0pkh4xz0vxh2p.png)

Use cases may be plenty. Most likely you use this operator without thinking when mapping observables into a network request or using them with NgRx effects.

Here is an interactive example (full code available at the end) whereby clicking in the canvas we want to draw a rectangle as follows:

```tsx
fromEvent(this.canvas.nativeElement, 'click').pipe(
  switchMap(event =>
    of(1).pipe(
      delay(1500),
      tap(() => this.drawPoint(event as MouseEvent))
    )
  )
);
```

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/c9xuaz39nqssr8yty924.gif)

Each time you click a yellow rectangle appears, indicating that you have clicked on that place and after 1.5 seconds it will turn red. However, if you click anywhere else within that time interval, the previous emission will be canceled, the red rectangle will be generated where the last emission (click) happened and each previous emission (clicks/yellow rectangles) will disappear.

### ConcatMap

The operator `concatMap` is used in cases when the next Observable is not subscribed until the first one completes. Here is an illustration of its functionality from [rxjs.dev](https://rxjs.dev/api/operators/concatMap)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zvj929t4fsduoh9fjqsy.png)

A use-case may be having a trading application, where the trades executed on the backend take a few seconds (not the fastest one), however meanwhile the user may submit multiple trades even before the first one was finished. The appropriate solution would be to apply `concatMap` to sequentially send each trade one after another.

Here is our interactive example of drawing on the canvas.

```tsx
fromEvent(this.canvas.nativeElement, 'click').pipe(
  concatMap(event =>
    of(1).pipe(
      delay(1500),
      tap(() => this.drawPoint(event as MouseEvent))
    )
  )
);
```

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pehv192f14tki19eqjw4.gif)

### MergeMap

The `mergeMap` operator allows for multiple inner observables to be active at the same time and not be dependent on their execution position. This operator is also referred to as a flattening operator because by concurrently emitting values from all input streams, it merges the inner observable streams obtained through the map operator. Here is an example.

```tsx
const source1$ = of([10, 20, 30]).pipe(delay(1000));
const source2$ = of([100, 200, 300]).pipe(delay(2000));
const source3$ = of([1000, 2000, 3000]).pipe(delay(3000));

/**
 * returns 3 emitions:
 *  [10, 20, 30] <- after 1s
 *  [100, 200, 300] <- after 2s
 *  [1000, 2000, 3000] <- after 3s
 */
of([source1$, source2$, source3$])
  .pipe(
    mergeAll(),
    mergeMap(sources => sources)
  )
  .subscribe(console.log);

/**
 * returns only:
 *   [1000, 2000, 3000] <- after 3s
 */
of([source1$, source2$, source3$])
  .pipe(
    mergeAll(),
    switchMap(sources => sources)
  )
  .subscribe(console.log);
```

A use-case may be sending analytics to the server by each user's click on your website. You don’t care about the execution order you just want to save which sections had the most interaction.

Beware that when using `mergeMap`, it can lead to a memory leak when handling long-lived or infinite inner observables, such as intervals or websocket communication. You have to manage their disposal by operators like: `take(1)`, `takeUntilDestroyed()`, etc.

Here is our interactive example of drawing on the canvas.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fcdivdbbgefjfifmtbxs.gif)

### ExhaustMap

The operator `exhaustMap` maintains a single active subscription at any given time, through which values are relayed to an observer. When a Higher-Order Observable emits a new inner observable stream, `exhaustMap` ignores the new inner observable if the current stream has not yet completed.

```tsx
const source$ = interval(500);

/**
 * returns: 0 ... 7 ... 14 ... 21 ...
 */
source$.pipe(exhaustMap(value => of(value).pipe(delay(3000)))).subscribe(console.log);
```

A use-case may be having a bank application, where once the user clicks on the payment execution, you want to await the server’s response before sending any following request.

Here is our interactive example of drawing on the canvas.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/iny34hg63q55szu29ltv.gif)

## Summary

Using Higher-Order Observables is an essential part of writing cleaner RxJs code and mapping results from one observable to another one. It is also important to wisely choose which operator is the correct one for your use case. Even if these operators make a small difference when your application is fast, by choosing the right operator you can prevent undesirable anomalies.

The interactive canvas example is [available on stackblitz](https://stackblitz.com/edit/stackblitz-starters-egw2kd?file=src%2Fmain.ts).

Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
