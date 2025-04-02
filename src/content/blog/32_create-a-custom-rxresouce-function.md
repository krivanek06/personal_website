---
title: 'Creating Custom Rxresource API in Angular'
seoTitle: 'Creating Custom Rxresource API in Angular'
seoDescription: 'Creating Custom Rxresource API in Angular'
slug: 32_create-a-custom-rxresouce-function
tags: javascript, angular, rxjs, tutorial
order: 32
datePublished: 14.11.2024
readTime: 8
coverImage: article-cover/32_custom-rxresouce-api.png
---

At the time of writing this article, Angular is approaching the version 19 release and it [brings a new API called resource](https://github.com/angular/angular/pull/58255). A great in-depth article is to read [Enea Jahollari - Everything you need to know about the resource API](https://push-based.io/article/everything-you-need-to-know-about-the-resource-api).

While the resource API is available from version 19, [Angular npm downloads](https://www.npmjs.com/package/@angular/core?activeTab=versions) show that many projects are still stuck on version 12-15.
Since these older versions heavily use Observables, I want to attempt creating a similar wrapper as `rxResource`, only it would work with Observables instead of signals.

## Application Overview

Below you can see a simple app on which we can demonstrate the main functionalities of `rxResource` API. Our goals is to fulfill the following requirements:

- As the user increments the counter, load more items
- Display the loading state while the data is being loaded
- Display the error state if the HTTP call fails
- Create a refresh button that will reload the data
- Enable editing displayed items - remove them from the UI by clicking

![Resource Final Overview](./article-images/32_resource-example.gif)

## Solving It With The rxResource

With the new resource API, this example can be solved similarly as shown below

```typescript
@Component({
  selector: 'app-resource-normal-example',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="grid gap-y-2">
      <h1>Resource Normal Example</h1>

      <button (click)="todosResource.reload()">refresh</button>

      <input type="number" [(ngModel)]="limitControl" />

      <!-- loading state -->
      @if (todosResource.isLoading()) {
        <div class="g-loading">Loading...</div>
      }

      <!-- error state -->
      @else if (todosResource.error()) {
        <div class="g-error">
          {{ todosResource.error() }}
        </div>
      }

      <!-- display data -->
      @else if (todosResource.hasValue()) {
        @for (item of todosResource.value() ?? []; track $index) {
          <div class="g-item" (click)="onRemove(item)">
            {{ item.id }} -{{ item.title }}
          </div>
        }
      }
    </div>
  `,
})
export class ResourceNormalExample {
  private http = inject(HttpClient);
  limitControl = signal<number>(5);

  todosResource = rxResource({
    request: this.limitControl,
    loader: ({ request: limit }) => {
      return this.http
        .get<Todo[]>(`https://jsonplaceholder.typicode.com/todos?_limit=${limit}`)
        .pipe(
          map(res => {
            if (limit === 8) {
              throw new Error('Error happened on the server');
            }
            return res;
          }),
          delay(1000)
        );
    },
  });

  onRemove(todo: Todo) {
    this.todosResource.update(d => d?.filter(item => item.id !== todo.id));
  }
}
```

To briefly summarize, whenever the `limitControl` signal changes, it will rerun the `loader` part of the `rxResource`. The `loader` takes the limit value as an argument and creates an HTTP request. We use `delay` to simulate slow network (to display the loading state) and if you select number 8, an error will be thrown to demonstrate the error state.

On every click on a single displayed Todo item, the item will be removed from the `todosResource`, and, lastly, there is a refresh button to reload todos from the API.

## Creating a Custom rxResource

This part will be divided into two section. First, we create a basic `rxResourceCustomBasic` function that will return the state of the request (loading, loaded, etc.) with the loaded data, and then we will create a more complex version of this to also allow refreshing, updating and setting a new value manually.

## Defining The Correct Types

We need to define what types we are working with, such as the data, the error and the loading state of the request, so we may go with something like the following:

```typescript
// this is the primary type we will be working with
type RxResourceCustomResult<T> = {
  /**
   * states:
   * - `loading` - the resource is loading
   * - `loaded` - the resource has been loaded
   * - `error` - an error occurred while loading the resource
   * - `local` - the resource has been set/modified locally
   */
  state: 'loading' | 'loaded' | 'error' | 'local';
  isLoading: boolean;
  data: T | null;
  error?: unknown;
};

// in theory you could also go with the one below,
// but its usage were a bit different from what Angular's rxResource has
type RxResourceCustomResult<T> =
  | {
      state: 'loading';
    }
  | {
      state: 'local';
    }
  | {
      state: 'loaded';
      data: T | null;
    }
  | {
      state: 'error';
      error: unknown;
    };
```

### Creating A Function Skeleton

To create the skeleton for the custom function that will look the same as Angular’s rxResource, we may go with something like:

```typescript
export const rxResourceCustomBasic = (data: {
  request: any[];
  loader: (values: any) => Observable<any>;
}): Observable<RxResourceCustomResult<any>> => {
  // todo ....
  return of({} as RxResourceCustomResult<any>);
};
```

The `request` accepts an array of something, ideally observables. It will
differ from `rxResource` in syntax that we are expecting an array,
however `rxResource` uses the following syntax `request: () => ({limit: this.limitControl})`.

The `loader` is a closure function provided by the user, that can
access (the observable) values from the `request` parameter and it returns an observable (a HTTP request).

Since initially everything is a type of `any`, TS doesn’t suggest that the `value` inside the `loader` array should a be number. Let’s fix it:

```typescript
// extract the value from an observable
type ObservableValue<T> = T extends Observable<infer U> ? U : never;

export const rxResourceCustomBasic = <T, TLoader extends Observable<unknown>[]>(data: {
  request: [...TLoader];
  loader: (values: {
    [K in keyof TLoader]: ObservableValue<TLoader[K]>;
  }) => Observable<T>;
}): Observable<RxResourceCustomResult<T>> => {
  return of({} as RxResourceCustomResult<any>);
};
```

A bit of generics are used, but what’s happening is that the first `T` in `rxResourceCustomBasic`
represents the shape of the data from an API and `TLoader extends Observable<unknown>[]`
represents an array of observable dependencies that we will be listening to.
I will not explain the whole generic structure, you can visit the [Github example](https://github.com/krivanek06/stackblitz-angular-custom-resource-function)
if you want to investigate what happens by tweaking the types.

Now when you use the `rxResourceCustomBasic` you will see the correct types. For example the `loader` has exactly 3 parameters and each has its own correct type.

![Custom rxResource wrapper with correct types](./article-images/32_i2.png)

## Basic Custom rxResource

Types are correctly solved, now let’s create the basic version of our custom rxResource, that has the state, data and error properties.

```typescript
export const rxResourceCustomBasic = <T, TLoader extends Observable<unknown>[]>(data: {
  request: [...TLoader];
  loader: (values: {
    [K in keyof TLoader]: ObservableValue<TLoader[K]>;
  }) => Observable<T>;
}): Observable<RxResourceCustomResult<T>> => {
  // listen to all the requests observables
  return combineLatest(data.request).pipe(
    switchMap(values =>
      // execute the loader function provided by the user
      data
        .loader(
          values as {
            [K in keyof TLoader]: ObservableValue<TLoader[K]>;
          }
        )
        .pipe(
          switchMap(result =>
            of({
              state: 'loaded' as const,
              data: result,
            })
          ),
          // setup loading state
          startWith({
            state: 'loading' as const,
            data: null,
          }),
          // handle error state
          catchError(error =>
            of({
              state: 'error' as const,
              error,
              data: null,
            })
          ),

          // map the result to the expected type
          map(
            result =>
              ({
                ...result,
                isLoading: result.state === 'loading',
              }) satisfies RxResourceCustomResult<T>
          )
        )
    ),
    // share the observable
    shareReplay(1)
  );
};
```

- We use `combineLatest` to listen on any new emission from the array of observables in `data.request` and we want to rerun the logic if any of those observables emit a new value.
- I use casting `value as ....` because TS suggest that `value` is a type of `unknown[]`. Not sure how to fix it, this was the easiest way.
- The `data.loader(values)` is used to provide the arguments from the `request` part into the `loader` part function provided by the user.
- Using the rxjs `startWith`, the initial state is `loading` and every time any observable emits, the state will always start with the `loading` state.
- Using the `catchError` to handle error state and add it to the source that can throw an error. If you are confused why `catchError` is not the last operator, consider checking out [Angular Rxjs - CatchError Position Matter!](https://dev.to/krivanek06/angular-rxjs-catcherror-position-matter-3b00)
- The `shareReplay()` operator is used to broadcast a newly emitted value to each subscriber, making it a hot observable

![Using the basic custom rxResource](./article-images/32_i3.png)

## Advanced Custom rxResouce

Although, the basic example works fine, there are some small issues with it. The main one is that the `rxResourceCustomBasic` returns an observable and we always have to subscribe on it, even if we only want the most current value.

Second, we are missing some methods, which the Angular’s `rxResource` provides, such as `reload()`, `update()` and `set()`. Let’s create a more advanced version that will have all the above mentioned features.

```typescript
export type RxResourceCustom<T> = {
  /**
   * Trigger a reload of the resource
   */
  reload: () => void;
  /**
   * @returns the current result of the resource
   */
  value: () => T | null;
  /**
   * @param updateFn - function to update the current data
   */
  update: (updateFn: (current: T) => T) => void;
  /**
   * @param data - set the data of the resource
   */
  set: (data: T) => void;
  /**
   * Observable of the resource state
   */
  result$: Observable<RxResourceCustomResult<T>>;
};

export const rxResourceCustom = <T, TLoader extends Observable<unknown>[]>(data: {
  request: [...TLoader];
  loader: (values: {
    [K in keyof TLoader]: ObservableValue<TLoader[K]>;
  }) => Observable<T>;
}): RxResourceCustom<T> => {
  // Subject to trigger reloads
  const reloadTrigger$ = new Subject<void>();

  // hold the latest result of type `T | null`
  const resultState$ = new BehaviorSubject<{
    state: RxResourceCustomResult<T>['state'];
    data: T | null;
  }>({
    state: 'loading' as const,
    data: null,
  });

  const result$ = reloadTrigger$.pipe(
    startWith(null),
    // listen to all the requests observables
    combineLatestWith(...data.request),
    // prevent request cancellation
    exhaustMap(([_, ...values]) =>
      // execute the loader function provided by the user
      data
        .loader(
          values as {
            [K in keyof TLoader]: ObservableValue<TLoader[K]>;
          }
        )
        .pipe(
          switchMap(result =>
            of({
              state: 'loaded' as const,
              data: result,
            })
          ),

          // setup loading state
          startWith({
            state: 'loading' as const,
            data: null,
          }),

          // handle error state
          catchError(error =>
            of({
              state: 'error' as const,
              error,
              data: null,
            })
          )
        )
    )
  );

  // subscribe to the result and update the state
  result$.pipe(takeUntilDestroyed()).subscribe(state => resultState$.next(state));

  return {
    result$: resultState$.asObservable().pipe(
      map(state => ({
        ...state,
        isLoading: state.state === 'loading',
      }))
    ),
    reload: () => reloadTrigger$.next(),
    value: () => resultState$.value.data,
    update: (updateFn: (current: T) => T) => {
      const current = resultState$.value;
      if (current?.data) {
        resultState$.next({
          state: 'local',
          data: updateFn(current.data),
        });
      }
    },
    set: data => {
      resultState$.next({
        state: 'local',
        data: data,
      });
    },
  };
};
```

When user executes the `reload()` function, it will next the `reloadTrigger$` and re-execute
the provided logic inside the `request` parameter.

Using `exhaustMap` allows us to ignore subsequent requests when the user
triggers the `reload()` function multiple times until the first one is not finished.

With the `combineLatestWith` operator we are constantly listening on the observable dependencies (from `request`) and if any of them emit, the logic (inside the `loader`) is re-executed.

The`resultState$` behaviourSubject is used to keep the current state of the `loader` section, so that we can return the current value and modify the cached result.

You may see that in this example we replaced the `shareReplay(1)` with `takeUntilDestroyed()`,
meaning, whenever you leave the execution context (component is destroyed), the subscription
is cancelled and you avoid memory leaks.

**Note**: Keep in mind that `takeUntilDestroyed` operator is available from
[Angular version 16](https://blog.angular.dev/angular-v16-is-here-4d7a28ec680d), so you need to be on at latest
version 16 when using the above advanced example.

## Using The Custom rxResource

Finally we can now use the custom `rxResourceCustom` that we’ve created as follows:

```typescript
@Component({
  selector: 'app-resource-custom-example',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  template: `
    <div class="grid gap-y-2">
      <h1>Resource Custom Example</h1>

      <button (click)="todosResource.reload()">refresh</button>

      <input type="number" [formControl]="limitControl" />

      @if (todosResource.result$ | async; as data) {
        <!-- loading state -->
        @if (data.isLoading) {
          <div class="g-loading">Loading...</div>
        }

        <!-- error state -->
        @else if (data.error) {
          <div class="g-error">
            {{ data.error }}
          </div>
        }

        <!-- display data -->
        @for (item of data.data; track $index) {
          <div class="g-item" (click)="onRemove(item)">
            {{ item.id }} - {{ item.title }}
          </div>
        }
      }
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceCustomExampleComponent {
  private http = inject(HttpClient);
  limitControl = new FormControl<number>(5, { nonNullable: true });

  private limitValue$ = this.limitControl.valueChanges.pipe(
    startWith(this.limitControl.value)
  );

  todosResource = rxResourceCustom({
    request: [this.limitValue$],
    loader: ([limit]) => {
      return this.http
        .get<Todo[]>(`https://jsonplaceholder.typicode.com/todos?_limit=${limit}`)
        .pipe(
          map(res => {
            if (limit === 8) {
              throw new Error('Error happened on the server');
            }
            return res;
          }),
          delay(1000)
        );
    },
  });

  onRemove(todo: Todo) {
    this.todosResource.update(d => d?.filter(item => item.id !== todo.id));
  }

  constructor() {
    // log the current value
    console.log(this.todosResource.value());
  }
}
```

## The Final Result

The final result of the side by side comparison of the Angular’s rxResource on the left, and our custom observable rxResource on the right

![Final Example](./article-images/32_result-final.gif)

Hope you liked the article and found it helpful. If you want to play around with it,
you can check the [Github repo](https://github.com/krivanek06/stackblitz-angular-custom-resource-function).
Also feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
