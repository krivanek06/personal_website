Building anything meaningful requires having a state management in your app. The question is, how should you design your state services ? Should you use a custom implementation - subjects or signals ? Or should you check out NgRx or something else? What are even the differences?

In this article I want to answer the question of how to implement application state using different approaches so that you can choose the one which suits you the most.

## Application Review

To demonstrate ways of creating a state management, we will have the following example.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/b9tiz2b4483jlmf5c054.gif)

An application where you initially preload users and messages. Then you display all the loaded messages and you can filter these messages based on the selected user. Furthermore, you can create or delete messages and you also have a websocket connection to a server that periodically sends new messages in some time interval.

The API service may look as follows:

```tsx
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  getUsers(): Observable<User[]> {
    return of(randomUsers).pipe(delay(200));
  }

  getMessages(): Observable<Message[]> {
    return of(randomMessages).pipe(delay(200));
  }

  /** emulates WS connection */
  listenOnRandomMessages(): Observable<Message> {
    return interval(4000).pipe(map(() => randomMessage()));
  }
}
```

## 1. The Old Way - Using BehaviourSubjects

Back in the old days, before signals were introduced in Angular, the common way of keeping a state in services was using `BehaviourSubjects`. This is the approach you see in older apps. To create a state management for the above requirements, you may go with something as follows:

```tsx
@Injectable({
  providedIn: 'root',
})
export class StateSubjects {
  private apiService = inject(ApiService);

  /** ----------------------(Private) Application State------------------- */

  /** state of loaded users */
  readonly #users$ = new BehaviorSubject<User[]>([]);

  /** state of loaded messages */
  readonly #messages$ = new BehaviorSubject<Message[]>([]);

  /** whether a user is selected */
  readonly #selectedUser$ = new BehaviorSubject<User | null>(null);

  /** -----------------------(Public-Readonly) Exposed State--------------- */

  readonly users$ = this.#users$.asObservable();
  readonly messages$ = this.#messages$.asObservable();
  readonly selectedUser$ = this.#selectedUser$.asObservable();

  // filters messages if a user is selected
  readonly messagesPerSelectedUser$ = this.#selectedUser$.pipe(
    switchMap(user => this.#messages$.pipe(map(messages => messages.filter(m => m.user.userId === user?.userId)))),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  get users(): User[] {
    return this.#users$.getValue();
  }

  get messages(): Message[] {
    return this.#messages$.getValue();
  }

  get selectedUser(): User | null {
    return this.#selectedUser$.getValue();
  }

  /** ----------------------Public Methods---------------------------- */

  addMessage(message: Message) {
    this.#messages$.next([message, ...this.#messages$.getValue()]);
  }

  removeMessage(messageId: string) {
    this.#messages$.next(this.#messages$.getValue().filter(m => m.messageId !== messageId));
  }

  setSelectedUser(user: User | null) {
    this.#selectedUser$.next(user);
  }

  getMessageById(messageId: string) {
    return this.#messages$.getValue().find(m => m.messageId === messageId);
  }

  constructor() {
    this.preloadData();
  }

  private preloadData() {
    // preload users
    this.apiService.getUsers().subscribe(users => {
      this.#users$.next(users);
    });

    // preload messages
    this.apiService.getMessages().subscribe(messages => {
      this.#messages$.next(messages);
    });

    // listen on WS new messages
    this.apiService.listenOnRandomMessages().subscribe(message => {
      this.#messages$.next([message, ...this.#messages$.getValue()]);
    });
  }
}
```

You may use this pattern even today and there is nothing wrong with this.

Having a `preloadData()` method to preload some data into the state, saving the data into `BehaviorSubject` and then creating public methods to return a `readonly` value from the state either as `observable` or as `getters` and finally some public methods to change the value of a state, such as `addMessage()` or `removeMessage()`.

## 2. The New Way - Signals

If you have already messed around with signals, you may have realized they are much better to handle application state compared to subjects. You can replace lots of `subscriptions` by using `computed`. To replace to first example with signals, you can go with something as follows:

```tsx
@Injectable({
  providedIn: 'root',
})
export class StateSignals {
  private apiService = inject(ApiService);

  /** ----------------(Private) Application State----------------- */

  /** state of loaded users */
  readonly #users = signal<User[]>([]);

  /** state of loaded messages */
  readonly #messages = signal<Message[]>([]);

  /** whether a user is selected */
  readonly #selectedUser = signal<User | null>(null);

  /** ----------------(Public-Readonly) Exposed State------------- */

  readonly users = computed(() => this.#users());

  readonly messages = computed(() => this.#messages());

  readonly selectedUser = computed(() => this.#selectedUser());

  readonly messagesPerSelectedUser = computed(() =>
    this.#messages().filter(m => m.user.userId === this.selectedUser()?.userId)
  );

  /** -------------------Public Methods---------------------------- */

  addMessage(message: Message) {
    this.#messages.set([message, ...this.#messages()]);
  }

  removeMessage(messageId: string) {
    this.#messages.set(this.#messages().filter(m => m.messageId !== messageId));
  }

  setSelectedUser(user: User | null) {
    this.#selectedUser.set(user);
  }

  getMessageById(messageId: string) {
    return this.#messages().find(m => m.messageId === messageId);
  }

  constructor() {
    this.preloadData();
  }

  private preloadData() {
    // preload users
    this.apiService.getUsers().subscribe(users => {
      this.#users.set(users);
    });

    // preload messages
    this.apiService.getMessages().subscribe(messages => {
      this.#messages.set(messages);
    });

    // listen on WS new messages
    this.apiService.listenOnRandomMessages().subscribe(message => {
      this.#messages.set([message, ...this.#messages()]);
    });
  }
}
```

At the first glance, using signals may not be much of a difference compared to subjects, however as your application grows, constantly subscribing to observables may lead some undesirable consequences, such as executing the observable’s inner logic multiple times. For further information read about [signals vs observables](https://blog.logrocket.com/angular-signals-vs-observables/).

Another thing to point out may be why to use a private property `#users` and then create a public computed property `users = computed(() => this.#users());` ?

The reason is the if you were to exposed `#users` (`#` makes it private) then the value of the signal could be changed outside of the service, something you don’t want. You want to change the signal’s values only inside the state service.

## 3. Signals - Declarative Approach

What you may see in both the first and the second example, is that both of them are imperative approaches ([wtf is declarative programming in angular](https://dev.to/krivanek06/from-chaos-to-clarity-simplify-your-angular-code-with-declarative-programming-58gm)).

In short looking at the second example, the `#messages` signal value is changed on multiple places. For a small example like this it’s not a significant problem, however as your application state grows, it may become harder and harder to debug and keep track how/where exactly the values in your state service are changing even if it happens inside one service. So the question becomes, how to solve the problem?

In my previous article [Advanced RxJs Operators](https://dev.to/krivanek06/advanced-rxjs-operators-you-know-but-not-well-enough-1ela), I mentioned a combination of
`merge()` and `scan()` rxjs operators. To create a declarative state you can go with something as follows:

```tsx
@Injectable({
  providedIn: 'root',
})
export class StateSignalsDeclarativeService {
  private apiService = inject(ApiService);

  /** ----------------------Public Methods---------------------------- */

  public readonly addMessage$ = new Subject<Message>();
  public readonly removeMessage$ = new Subject<string>();
  public readonly setSelectUser$ = new Subject<User | null>();

  /** ---------------------(Public-Readonly) Exposed State----------- */

  state = toSignal(
    merge(
      // preload users
      this.apiService.getUsers().pipe(map(users => ({ users, action: 'preloadUser' as const }))),

      // preload messages
      this.apiService.getMessages().pipe(map(messages => ({ messages, action: 'preloadMessages' as const }))),

      // listen on WS random messages
      this.apiService.listenOnRandomMessages().pipe(map(message => ({ message, action: 'addMessage' as const }))),

      // define actions
      this.addMessage$.pipe(map(message => ({ action: 'addMessage' as const, message }))),
      this.removeMessage$.pipe(map(messageId => ({ action: 'removeMessage' as const, messageId }))),
      this.setSelectUser$.pipe(map(selectedUser => ({ action: 'selectUser' as const, selectedUser })))
    ).pipe(
      scan(
        (state, curr) => {
          if (curr.action === 'preloadUser') {
            return { ...state, users: curr.users };
          }

          if (curr.action === 'preloadMessages') {
            return { ...state, messages: curr.messages };
          }

          if (curr.action === 'addMessage') {
            return { ...state, messages: [curr.message, ...state.messages] };
          }

          if (curr.action === 'removeMessage') {
            return {
              ...state,
              messages: state.messages.filter(message => message.messageId !== curr.messageId),
            };
          }

          if (curr.action === 'selectUser') {
            return { ...state, selectedUser: curr.selectedUser };
          }

          return state;
        },
        {
          users: [] as User[],
          messages: [] as Message[],
          selectedUser: null as User | null,
        }
      ),
      // create selectors
      map(state => ({
        users: state.users,
        messages: state.messages,
        selectedUser: state.selectedUser,
        messagesPerSelectedUser: state.messages.filter(message => message.user.userId === state.selectedUser?.userId),
        getMessageById: (messageId: string) => state.messages.find(message => message.messageId === messageId),
      }))
    ),
    {
      initialValue: {
        users: [] as User[],
        messages: [] as Message[],
        selectedUser: null as User | null,
        messagesPerSelectedUser: [] as Message[],
        getMessageById: (messageId: string) => undefined as Message | undefined,
      },
    }
  );
}
```

Instead of mutating values into the signals on multiple places, now you have one variable (`state`), which value is changed only in one place.

You expose some public actions, like `addMessage$` that can be nexted outside of this service.

You also listen on these actions inside the `merge()` operator and every action (subject) is mapped into some data type, however all of them must contain the `action` key which holds a constant.

Finally inside the `scan()` section you accumulate all the new a previous values and create newly updated state.

It may be a bit confusing and overcomplicated at the first glance, however the more you think about it, this is exactly how NgRx and other state management libraries work.

- Selectors: the `state` property
- Actions: the exposed subjects (`addMessage$`, `removeMessage$` and `setSelectUser$`)
- Reducer: the `scan` section
- Side-Effects: you could put some `tap` operators here and there or just use the `effect` for signal changes

Why is this 3rd approach better than the 1st or 2nd? … It isn’t. It all depends on you and your team preferences. I could argue that the 3rd is better because the state is updated only in one place, inside the `scan` section, however for a new developers, the 3rd approach may be harder to read and understand.

## 4. NgRx - Signals

If you want to avoid custom implementation, which let’s be honest will inevitably fail, you may want to check out [ngrx docs](https://ngrx.io/guide/signals/signal-store).

Over the years NgRx went though multiple approaches of how to create/manage state in your app, but seems like in their latest approach they also prefer using signals. For this application example your NgRx implementation may be as follows:

```TS
export const StateNgrx = signalStore(
	// initial state
  withState({
    users: [] as User[],
    messages: [] as Message[],
    selectedUser: null as User | null,
  }),
  // public methods
  withMethods((store) => ({
    addMessage(message: Message) {
      patchState(store, { messages: [message, ...store.messages()] });
    },
    removeMessage(messageId: string) {
      patchState(store, {
	      messages: store.messages().filter((m) => m.messageId !== messageId)
		  });
    },
    setSelectedUser(user: User | null) {
      patchState(store, { selectedUser: user });
    },
    getMessageById(messageId: string) {
      return store.messages().find((m) => m.messageId === messageId);
    },
  })),
  // create selectors
  withComputed((store) => ({
    messagesPerSelectedUser: computed(() =>
      store.messages().filter(
	      (m) => m.user.userId === store.selectedUser()?.userId
	    )
    ),
  })),
  withHooks((store) => {
    const apiService = inject(ApiService);

    return {
      onInit() {
	      // preload users
        apiService.getUsers().subscribe((users) => {
          patchState(store, { users });
        });
        // preload messages
        apiService.getMessages().subscribe((messages) => {
          patchState(store, { messages });
        });
        // listen on WS new messages and save into the state
        apiService
          .listenOnRandomMessages()
          .pipe(takeUntilDestroyed())
          .subscribe((message) => {
            patchState(store, { messages: [message, ...store.messages()] });
          });
      },
    };
  })
);

```

I didn’t use to be a fan of NgRx, however with the latest signal state migration I kinda like how simple it is to work with this library.

You can create a state either inside a service or even outside of it, as a simple function, but then you have to include this state inside the component’s `providers` section as follows:

```tsx
@Component({
  selector: 'app-state-ngrx',
  standalone: true,
  template: ``,
  providers: [StateNgrx], // <-- state is included
})
export class StateNgrxComponent {
  /* ... */
}
```

## 5. SignalSlice - ngxtension

There is a library which is less common, however very useful, called [ngxtension](https://www.npmjs.com/package/ngxtension). It has many utility functions for manipulating signals and observables, but also other things worth checking out. One of those utilities is [signalSlice](https://ngxtension.netlify.app/utilities/signals/signal-slice/).

SignalSlice is similar how NgRx works. Same workflow of creating a state, actions, reducers, selectors, etc.

I wanted to mention this because, first, I like the library, and second, signalSlice was created by a great Angular developer [Joshua Morony](https://www.youtube.com/@JoshuaMorony) who I am watching for some time, so give him some credit and you may want to check out his [explanation of this utility](https://www.youtube.com/watch?v=z7zK2u4vBrA&t=71s).

To use signalSlice to create a state for this application feature, it may look something as follows:

```tsx
@Injectable({
  providedIn: 'root',
})
export class StateSignalSlice {
  private apiService = inject(ApiService);

  stateSignalSlice = signalSlice({
    // intial state
    initialState: {
      users: [] as User[],
      messages: [] as Message[],
      selectedUser: null as User | null,
    },
    sources: [
      // preload users
      this.apiService.getUsers().pipe(map(users => ({ users }))),
      // preload message
      this.apiService.getMessages().pipe(map(messages => ({ messages }))),
      // listen on WS new messages
      state =>
        this.apiService.listenOnRandomMessages().pipe(map(message => ({ messages: [message, ...state().messages] }))),
    ],
    // exposed methods to be called
    actionSources: {
      addMessage: (state, action$: Observable<Message>) =>
        action$.pipe(map(message => ({ messages: [message, ...state().messages] }))),

      removeMessage: (state, action$: Observable<string>) =>
        action$.pipe(
          map(messageId => ({
            messages: state().messages.filter(m => m.messageId !== messageId),
          }))
        ),

      setSelectedUser: (_, action$: Observable<User | null>) => action$.pipe(map(selectedUser => ({ selectedUser }))),
    },
    // additional state selectors
    selectors: state => ({
      getMessageById: () => (messageId: string) => state().messages.find(message => message.messageId === messageId),

      messagesPerSelectedUser: () =>
        state().messages.filter(message => message.user.userId === state().selectedUser?.userId),
    }),
  });
}
```

- `sources` - define sources from which the initial data may come - these are the initial API calls and websocket listeners.
- `actionSources` - are exposed methods that can be called to change the state
- `selectors` - additional state selectors

## Summary

In this article I wanted to highlight different approaches of how to manage an application state inside Angular. Whether you build a custom implementation or use 3rd party libraries, every approach have some advantage and disadvantage and as your application grows, managing state is one of the first issues you encounter, so choose wisely.

To play around with this example, look at the [stackblitz example](https://stackblitz.com/~/github.com/krivanek06/stackblitz-angular-state-managements) or [clone it from github](https://github.com/krivanek06/stackblitz-angular-state-managements). I hope you liked the article and feel free to share your thoughts, or connect with me on [dev.to](https://dev.to/krivanek06) | [LinkedIn](https://www.linkedin.com/in/eduard-krivanek).
