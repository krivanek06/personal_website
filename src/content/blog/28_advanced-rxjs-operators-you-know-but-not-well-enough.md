---
title: 'Advanced RxJs Operators You Know But Not Well Enough'
seoTitle: 'Advanced RxJs Operators You Know But Not Well Enough'
seoDescription: 'I’ve been using Angular for more or less half a decade and recently I reviewed how many rxjs...'
slug: 28_advanced-rxjs-operators-you-know-but-not-well-enough
tags: angular, rxjs, beginner, tutorial
order: 28
datePublished: 17.06.2024
readTime: 12
coverImage: article-cover/28_advanced-rxjs-operators-you-know-but-not-well-enough.png
---

I’ve been using Angular for more or less half a decade and recently I reviewed how many rxjs operators I am familiar with. I wanted to create this article to share some of my experience with rxjs, but also talk about some operators, differences between them, combination, and give some examples how I use them (also linking some useful resources).
We will talk about:

- take(1) vs first()
- find() vs single()
- debounceTime() and distinctUntilChanged()
- catchError() position matter
- bufferTime() or bufferCount()
- share() vs shareReplay()
- merge() and scan()
- exhaustMap() operator
- expand() operator

Hope you find it helpful and feel free to share your thoughts.

## Take(1) vs First()

Both operators delivers the first emission and also cancel the subscription, so you prevent memory leaks. To understand the difference between these two operators, it involves the additional operator `EMPTY`.

Let’s say you have a service which makes API calls to load users, however something goes wrong, and the server returns a 500 error code. We catch the error and return [EMPTY](https://rxjs.dev/api/index/const/EMPTY), such as below.

```tsx
@Injectable({
  providedIn: 'root',
})
export class UserService {
  getUsers(): Observable<User[]> {
    return this.http.get('...').pipe(catchError(() => EMPTY));
  }
}
```

Then inside a component you want to load these users using the `take(1)` or `first()` operator and ensure un-subscription. The difference between these two operators is that the `first()` operator can throw an error EmptyError. Here is the explanation [from the docs](https://www.learnrxjs.io/learn-rxjs/operators/filtering/first):

> `first` will deliver an EmptyError to the Observer's error callback if the Observable completes before any next notification was sent. If you don't want this behavior, use `take(1)` instead.

```tsx
@Component({
  /* .... */
})
export class UserComponent {
  private userService = inject(UserService);

  constructor() {
    // throws "EmptyError" - "no elements in sequence"
    this.userService.getUsers().pipe(first()).subscribe(console.log);

    // does not throw error, does not emit anything
    this.userService.getUsers().pipe(take(1)).subscribe(console.log);
  }
}
```

I personally still use the `first()` operator and handle errors if needed, but I found that the errors are thrown only if use the `EMPTY` observable which immediately completes.

Something worth nothing that you may want to also consider using the [defaultIfEmpty()](https://www.learnrxjs.io/learn-rxjs/operators/conditional/defaultifempty) operator with `first()` to ensure that no errors will be thrown when using `EMPTY` constant.

```tsx
@Component({
  /* .... */
})
export class UserComponent {
  private userService = inject(UserService);

  constructor() {
    // will emit - "no users"
    this.userService.getUsers().pipe(defaultIfEmpty('no users'), first()).subscribe(console.log);
  }
}
```

## Find() vs Single()

I guess you are familiar with the [find()](https://www.learnrxjs.io/learn-rxjs/operators/filtering/find) operator. As the name suggest you want to “find” an item inside an array of items. However there is a lesser known operator called [single()](https://www.learnrxjs.io/learn-rxjs/operators/filtering/single). On the first glance both work the same way

```tsx
// this will output number 3
from([1, 2, 3])
  .pipe(find(val => val === 3))
  .subscribe(console.log);

// this will output number 3
from([1, 2, 3])
  .pipe(single(val => val === 3))
  .subscribe(console.log);
```

The difference is when the value is not found. The docs says:

- [find() docs](https://rxjs.dev/api/operators/find) - “does not emit an error if a valid value is not found (emits `undefined` instead)”
- [single() docs](https://rxjs.dev/api/operators/single) - “If the source Observable did not emit `next` before completion, it will emit an [`EmptyError`](https://rxjs.dev/api/index/interface/EmptyError) to the Observer's `error` callback”

Personally I haven’t seen many places where the `single()` operator would be used. It is a more “strict version” of the `find()` operator and you most likely will have to use the `catchError()` operator with it.

```tsx
// output will be: 333 ... single() throws and error
from([1, 2])
  .pipe(
    single(d => d === 3),
    catchError(e => of(333))
  )
  .subscribe(x => {
    console.log('Value is:', x);
  });

// output will be: undefined
from([1, 2])
  .pipe(
    find(d => d === 3),
    catchError(e => of(333))
  )
  .subscribe(x => {
    console.log('Value is:', x);
  });
```

## DebounceTime and DistinctUntilChanged

Using the combination of [distinctUntilChanged](https://www.learnrxjs.io/learn-rxjs/operators/filtering/distinctuntilchanged) and [debounceTime](https://www.learnrxjs.io/learn-rxjs/operators/filtering/debouncetime) is probably the most common pair that you yourself use quite often.

Not gonna waste much time here, just want to give a small example with this combination. Let’s say you have an auto-complete and on every key press you load some data from the server.

You want to have some time passed before sending the user’s input value to the server and prevent sending the same value twice, so you can you these two operators as follows:

```tsx
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section>
      <h2>Write something to the input</h2>
      <input [formControl]="searchControl" placeholder="write" />
      <section></section>
    </section>
  `,
})
export class App implements OnInit {
  searchControl = new FormControl('', { nonNullable: true });
  apiService = inject(ApiService);

  loadedUsers = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(500), // wait 500ms after user input to send data
      distinctUntilChanged(), // don't send the same value if not changed
      switchMap(value => this.apiService.loadUsersByPrefix(value))
    )
  );
}
```

## CatchError Position Matter

Referring back to my article [CatchError Position Matter](https://dev.to/krivanek06/angular-rxjs-catcherror-position-matter-3b00), I highlighted that depending on the placement of the [catchError](https://rxjs.dev/api/operators/catchError) operator, you can experience unexpected behaviours.

Let’s have the same example as above. We want to load users from the server as an user types something into the autocomplete. Going with the above example, where would you put the catchError operator? Let’s say you decide to place it in the end of the chain as such:

```tsx
loadedUsers = toSignal(
  this.searchControl.valueChanges.pipe(
    switchMap(value => this.apiService.loadUsersByPrefix(value)),
    catchError(() => EMPTY)
  )
);
```

This will have a side-effect that once you receive an error - your search will STOP working. Even if you type something into the input field again (after getting an error), it will not make additional API calls, since your chain has already errored out (and you handled it). Therefore, it is more recommended to put the `catchError()` operator closer where the error happens as such:

```tsx
loadedUsers = toSignal(
  this.searchControl.valueChanges.pipe(
    switchMap(value => this.apiService.loadUsersByPrefix(value).pipe(catchError(() => EMPTY)))
  )
);
```

With this small change, even if you receive an Error, your search functionality will still continue working. To get more info about this and an stackblitz example, visit [CatchError Position Matter](https://dev.to/krivanek06/angular-rxjs-catcherror-position-matter-3b00) blogpost.

## BufferTime or BufferCount

In cases when you have, let’s say, a websocket communication, you may bump into a problem of high frequency updates.

As for myself, I worked on a projects as such:

- stock market application (many real time price updates)
- phone call application monitoring (many calls from many users)

Both of these projects were receiving frequent data updates and it came to a point where the UI was updating so frequently that it was freezing.

One way how we solved the problem was using the [bufferTime](https://rxjs.dev/api/operators/bufferTime) and [bufferCount](https://www.learnrxjs.io/learn-rxjs/operators/transformation/buffercount) operators. Both of them aggregates data from an observable and then returns an array of received data by some time interval.

```tsx
//output [0,1,2]...[3,4,5,6]
const subscribe = interval(500)
  .pipe(bufferTime(2000))
  .subscribe(val => console.log('Buffered with Time:', val));
```

## Share() vs ShareReplay()

Last year I wrote a blogpost about [How shareReplay Saved My Angular Project](https://dev.to/krivanek06/the-real-usage-of-sharereplay-in-angular-4fpa). It describes the side-effects that can arise when having multiple subscriptions and not using the one of these multicast operators.

Both of these operators are used to multicast a value from an observable, prevent re-execution, however with a different strategy. We need to look at three types:

- using `share()` - cache the value (for existing subscriptions) until the observable completes
- using `shareReplay({ refcount: true, bufferSize:1 })` - cache the value (for existing and new subscriptions) until the observable completes
- using `shareReplay({ refcount: false, bufferSize:1 })` - cache the value, observable never completes (creates a ReplaySubject(1) under the hood)

For demonstration, let’s have the following example:

```tsx
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notification$ = new Subject<void>();

  listener$ = this.notification$.asObservable().pipe(
    tap(() => console.log('notification received')),
    // shareReplay({ bufferSize: 1, refCount: false }),
    // shareReplay({ bufferSize: 1, refCount: true }),
    // share(),
    scan(acc => acc + 1, 0)
  );

  notify() {
    this.notification$.next();
  }
}

@Component({
  /* .... */
})
export class NoticationComponent {
  private notificationService = inject(NotificationService);

  constructor() {
    this.notificationService.listener$.subscribe(x => {
      console.log('Not 1:', x);
    });

    this.notificationService.listener$.subscribe(x => {
      console.log('Not 2:', x);
    });

    // create notification
    this.notificationService.notify();

    // make a new listener
    setTimeout(() => {
      this.notificationService.listener$.subscribe(x => {
        console.log('Not 3:', x);
      });
    }, 1000);

    // create notification
    setTimeout(() => {
      this.notificationService.notify();
    }, 2000);
  }
}
```

Not using `share()` or `shareReplay()` , the result will be that the body of `notification$.asObservable()` will re-execute on each subscription

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yiw9o26dkv6xuzixhs05.png)

Not necessarily something you want right? You want to log the “notification received” message only once when the `notify()` is called. So you may use `share()` for that? If you attach `share()` into the `notification$.asObservable()` you get the following:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vv7l5u5r0a872e2zy5z8.png)

Almost correct. Only two message logs, however why is “Not 3: 1” ? Shouldn’t it be 2? Well, even if `share()` multicast the new value for each existing subscriptions, it doesn't cache the already computed value by the `notification$.asObservable()`, so it starts from 0 on every later new subscription.

What about `shareReplay()` ? Interestingly in this example, it doesn’t matter if you use `refcount` true of false, since you attach `shareReplay()` on a long living subject that never completes. Basically even if you used `refcount: true` it would behave (in this example) as `refCount: false`.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h38hcu92s3nh5biq8rfh.png)

Using `shareReplay({ refcount: false, bufferSize:1 })` may sound sometimes like a good strategy, since it caches the last emitted value, however be careful with it since it never completes and can cause memory leaks when used outside of a service (singleton).

For more information I recommend reading an article from [Thomas Laforge about Share / ShareReplay / RefCount](https://itnext.io/share-sharereplay-refcount-a38ae29a19d).

## Merge and Scan

The operator combination [merge](https://rxjs.dev/api/index/function/merge) and [scan](https://www.learnrxjs.io/learn-rxjs/operators/transformation/scan) is a nice combination I've started to use recently. I will give an example how I use them, but I have to give some credits to [Decoded Frontend - RxJS Scan Operator](https://www.youtube.com/watch?v=PDpAjf0688Y&t=703s).

I will give a short explanation of how I use these two operators, however for more informations, feel free to check out [From Chaos to Clarity: Simplify Your Angular Code with Declarative Programming](https://dev.to/krivanek06/from-chaos-to-clarity-simplify-your-angular-code-with-declarative-programming-58gm).

Let’s say you have a dropdown, and every time you select a value, you want to load some additional (more) data from the server. While loading, you want to display a loading state and then display a data when they arrive. More or less, your first intuition would suggest to go with something like

```tsx
export class SelectImperativeComponent {
  private dataService = inject(DataService);

  selectedItems = signal<DataItem[]>([]);
  isLoadingData = signal(false);

  /**
   * on select change - load data from API
   */
  onChange(event: any) {
    const itemId = event.target.value;

    // set loading to true
    this.isLoadingData.set(true);

    // fake load data from BE
    this.dataService.getDataFakeAPI(itemId).subscribe((res) => {
      // save data
      this.selectedItems.update((prev) => [...prev, res]);
      // set loading to false
      this.isLoadingData.set(false);
    });
}
```

This works as intended. The “only” problem is that this code is imperative. You have a local property `selectedItems` which value can be changed anywhere inside the component. As previously mentioned, for more information, please read the article linked above (and give it a like, it helps me to sleep at night).

Instead of having multiple writable signals which value can be changed anywhere, you can create one read-only signal which has the state - data, isLoading, isError. Here is a sample code:

```tsx
@Component({
  /* ... */
})
export class SelectDeclarativeComponent {
  private removeItem$ = new Subject<DataItem>();
  private addItem$ = new Subject<string>();

  selectedItems = toSignal(
    merge(
      // create action to add a new item
      this.addItem$.pipe(
        switchMap(itemId =>
          this.dataService.getDataFakeAPI(itemId).pipe(
            map(item => ({ item, action: 'add' as const })),
            startWith({ item: null, action: 'loading' as const })
          )
        )
      ),
      // create action to remove an item
      this.removeItem$.pipe(map(item => ({ item, action: 'remove' as const })))
    ).pipe(
      scan(
        (acc, curr) => {
          // display loading
          if (curr.action === 'loading') {
            return {
              data: acc.data,
              isLoading: true,
            };
          }

          // check to remove item
          if (curr.action === 'remove') {
            return {
              isLoading: false,
              data: acc.data.filter(d => d.id !== curr.item.id),
            };
          }

          // add item into the rest
          return {
            isLoading: false,
            data: [...acc.data, curr.item],
          };
        },
        { data: [] as DataItem[], isLoading: false }
      )
    ),
    {
      initialValue: { data: [], isLoading: false },
    }
  );

  /**
   * on select change - load data from API
   */
  onChange(event: any) {
    const itemId = event.target.value;
    this.addItem$.next(itemId);
  }

  /**
   * removes item from selected array
   */
  onRemove(item: DataItem) {
    this.removeItem$.next(item);
  }
}
```

It’s a bit similar how state management libraries, like NgRx works. You have actions: `addItem$` and `removeItem$` and if any of these two actions emits a data, it goes though a reducer (`scan` operator) and the result is saved into the `selectedItems` value. Moreover the `selectedItems` is changing only in one place so a bug can happen only in one place.

## ExhaustMap Operator

When it comes to [higher-order observables](https://dev.to/krivanek06/angular-interview-what-is-higher-order-observable-2k03), more or less people by default go with switchMap(). It’s a safe and most used choice since it cancels the running process of the inner-observable and create a new one on each new emit.

That said, there may be cases when to use a different type of higher-order observable so you may be interested in - [Angular Interview: What is a Higher-Order Observable?](https://dev.to/krivanek06/angular-interview-what-is-higher-order-observable-2k03)

To be honest, using `exhaustMap` is very rare, but I will give you an example how I had to use it recently. Let’s you say want to implement an infinite scroll feature. You have some initial messages and as you scroll up, you load additional messages (using pagination). Here is the GIF about the result.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/178o6kmf6vfo97m32kaj.gif)

Just to have some reference, here is a code close to the final implementation

```tsx
@Component({
  selector: 'app-chat-feature',
  standalone: true,
  imports: [ScrollNearEndDirective],
  template: `
    <div appScrollNearEnd (nearEnd)="onNearEndEmit()">
      @for (item of displayedMessages().data; track item.messageId) {
        <!-- loaded messages -->
      }
    </div>
  `,
})
export class ChatFeatureComponent {
  private messageApiService = inject(MessageApiService);

  /**
   * subject to emit new scroll event with pagination
   */
  private scrollNewEndOffset$ = new Subject<number>();

  /**
   * observable to load messages from API based on scroll position
   */
  displayedMessages = toSignal(
    this.scrollNewEndOffset$.pipe(
      // initial paginatio is 0
      startWith(0),
      exhaustMap(offset =>
        this.messageApiService.getMessages(offset).pipe(
          // stop loading, set data
          map(data => ({ data, loading: false })),
          // error happened, set data
          catchError(err => of({ data: [], loading: false })),
          // show loading state
          startWith({ data: [], loading: true })
        )
      ),
      // remember previous values and add new ones
      scan(
        (acc, curr) => ({
          data: [...acc.data, ...curr.data],
          loading: curr.loading,
        }),
        {
          data: [] as Message[],
          loading: true,
        }
      )
    )
  );

  onNearEndEmit() {
    // emit with new offset
    this.scrollNewEndOffset$.next(this.displayedMessages().data.length);
  }
}
```

the main idea is that, as you scroll up, the `(nearEnd)` output will emit every-time as you move closer to the end of the scroll. When `(nearEnd)` emits, you change the value for the `scrollNewEndOffset$` , that represents how many messages are already load (initially 0) and when `scrollNewEndOffset$` emits with the new offset value, you load additional 20 (hardcoded) messages from the server with a new offset value.

So far so good, but why `exhaustMap` ? Wouldn’t `switchMap` work ? For that it needs to be understood how `ScrollNearEndDirective` works.

`ScrollNearEndDirective` is a custom directive that emits every time as your scroll bar moves to the end. Let’s say the end is 0px (maximum top) and you have a threshold of 80px. So if you move you scroll inside the threshold, the directive will emit each time when 1px changes. So if you used `switchMap` you result may be something like this:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ee0rw70rb4e1e3354roz.gif)

As you see, plenty of API calls were issued. Since one API call takes around ~2s to complete and I was hovering within that threshold of 80px, my directive was emitting each time and cancelling every previous API calls.

You may wonder if it could be fixed with `debounceTime(X)` and it would work partially, however `exhaustMap` is better, because you don’t care how many times the directive emitted while scrolling, you are sending the same offset value and receiving the same data back.

## Expand() Operator

The `expand()` operator is an operator that recursively runs, while returning an observable, until you return an `EMPTY` observable, which is the stopping condition.

I highly recommend checking out [Joshua Morony - What I learned from this crazy RxJS stream in my Angular app](https://www.youtube.com/watch?v=aKsPMTP6-sY&t=167s), but I will also give a small example with the already mentioned loading message API.

When you look at the previous example, we have the `messageApiService.getMessages(offset)` API call that always returns 20 new messages based on the offset you provide. You may say 20 is not enough, however this value is hard-coded in the BE and we can not change it, or can we ?

What if we could call the API for messages each time twice to load double the amount of the messages? For that you can use the `expand` operator as follows:

```tsx
export class ChatFeatureComponent {
  displayedMessages = toSignal(
    this.scrollNewEndOffset$.pipe(
      // initial paginatio is 0
      startWith(0),
      exhaustMap(offset =>
        this.messageApiService.getMessages(offset).pipe(
          // <--- this is new
          expand((_, index) => (index === 0 ? this.messageApiService.getMessages(offset + 20) : EMPTY)),
          // stop loading, set data
          map(data => ({ data, loading: false })),
          // error happened, set data
          catchError(err => of({ data: [], loading: false })),
          // show loading state
          startWith({ data: [], loading: true })
        )
      ),
      // remember previous values and add new ones
      scan(
        (acc, curr) => ({
          data: [...acc.data, ...curr.data],
          loading: curr.loading,
        }),
        { data: [] as Message[], loading: true }
      )
    )
  );
}
```

In this specific scenario, each time we make an API request to load 20 message, we create one more API request, with the `expand()` operator, so in total we load 40 messages on every scroll to top.

## Final Thoughts

In this article I tried to put together some “more advanced” rxjs operators, or combination of operators that can be useful and I occasionally use. I hope you liked the article and feel free to share your thoughts, or connect with me on [dev.to](https://dev.to/krivanek06) | [LinkedIn](https://www.linkedin.com/in/eduard-krivanek).
