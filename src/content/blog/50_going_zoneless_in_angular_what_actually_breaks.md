---
title: 'Going Zoneless in Angular: What Actually Breaks'
seoTitle: 'Going Zoneless in Angular: What Actually Breaks'
seoDescription: 'Zoneless change detection removes Zone.js and the global tick. Here is what breaks in a real Angular app and how to fix it before you ship.'
slug: 50_going_zoneless_in_angular_what_actually_breaks
tags: angular, signals, performance
order: 50
datePublished: 23.08.2026
readTime: 16
coverImage: article-cover/angular_cover_image.webp
---

You know that feeling when you change a value inside a callback and Angular updates the view all by itself? That magic has a name. Zone.js. For years it quietly patched setTimeout, promises, and event listeners so that any async work ended with a change detection pass across the whole app. It worked. Most of the time.

Then you flip on zoneless and a counter that has counted up for three years simply stops. No error. No warning. The number just never moves. That is the exact moment every team hits during the migration. The magic was never free, and once you remove it, you can see precisely where your app was leaning on it.

This post is a practical walkthrough of what breaks when you go zoneless, why it breaks, and the patterns that fix it. No theory for its own sake. Just the things that bite.

## What Zone.js did for you

Before you can see what breaks, you need to know what you are removing. Zone.js monkey patched the async APIs of the browser. setTimeout, setInterval, Promise, fetch, XHR, addEventListener. All of them. Angular then watched for the moment the microtask queue emptied and ran change detection over the entire component tree.

The practical result was that you could do almost anything from almost anywhere and the view would eventually catch up. Subscribe to an HTTP call and assign a plain field. Fire a timer and increment a number. Add a raw DOM listener and flip a boolean. It all worked because the global tick always came after you.

That convenience had a cost. Every tick could touch the whole tree, and the triggers were hard to predict. But cost aside, here is the part that matters: your app holds years of code that only renders because of those accidental ticks.

There is a second cost people forget. When a bug appears, the cause is often invisible. You change a value, the view updates, and you have no idea which of the fifty async things in flight actually triggered it. Zone.js made things work without making them understandable, and that debt shows up the moment you try to migrate.

## Why Angular is dropping Zone.js

The Angular team did not wake up one morning and decide to break everyone. This has been building for a while. Signals arrived first, and signals do not need a zone, because a write is explicit. The framework also kept paying the tax Zone.js introduced: a third party library schedules a timer, and your whole app gets checked for no reason. As apps grew, the global tick became a cost that was hard to remove while Zone.js was still in charge.

Zoneless is the logical end of the signals direction. The team shipped it as stable in Angular 20 and is steering the ecosystem toward it, with Zone.js now on the path out. That does not mean you must migrate tomorrow. It does mean new code should stop assuming the old magic exists, so the eventual switch is not a surprise.

## What replaces it

Zoneless inverts the model. Angular no longer patches anything. Instead it schedules change detection from a small set of known entry points:

- template events like (click)
- signal writes
- AsyncPipe emissions
- Angular subsystems like the router, HttpClient, and forms
- explicit markForCheck calls

A change detection scheduler queues these updates and coalesces them. Instead of a tick after any async work, you get an update when Angular knows something changed.

When several things change in the same moment, the scheduler does not run change detection once per change. It batches the work and flushes it in a single pass, usually on a microtask or an animation frame. That is why signals and markForCheck scale better than calling detectChanges yourself: the framework can fold ten updates into one render, while a manual detectChanges forces a render every single time you call it.

That is the whole mental model. Angular updates when Angular knows. If you mutate state outside one of those entry points, Angular does not know, and the view does not change. That single sentence explains about ninety percent of what goes wrong.

NgZone does not disappear. It still exists for libraries that need it, and runOutsideAngular still works. What changes is that NgZone no longer drives change detection, so code that waited for the zone to become stable behaves differently.

## How the scheduler batches work

One of the easiest ways to understand zoneless is to watch how it batches. Say a single click sets three signals. Under Zone.js you might see several passes. Under zoneless, the three writes mark three small parts of the view dirty, and the scheduler flushes them together in one pass.

The scheduler runs on a microtask by default, or on an animation frame when animations are involved. That detail rarely matters day to day, but it explains two things. First, why a signal write followed by a DOM read in the same tick can still see the old DOM. Second, why sprinkling detectChanges is worse than markForCheck. detectChanges runs synchronously and right now, while markForCheck just marks the view and lets the scheduler decide when to flush.

The practical takeaway is simple. Prefer signals and markForCheck, let the scheduler do its job, and only reach for a synchronous detectChanges when a test or a very specific imperative path truly needs it.

![Change Detection Compare](./article-images/50_zoneless.jpeg)

## How to turn it on

Turning it on is small. Add the provider at bootstrap and remove zone.js from your polyfills:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [provideZonelessChangeDetection()],
});
```

The API name changed while the feature matured. Older versions exposed provideExperimentalZonelessChangeDetection. On current Angular the provider is provideZonelessChangeDetection, and it is stable. Angular also ships a migration schematic to handle the mechanical parts for you, so you do not have to do this by hand.

Do the bootstrap change and the polyfill removal together. If you remove the polyfill but forget the provider, change detection never runs. If you add the provider but keep the polyfill, you are still shipping zone.js for nothing.

## Patterns that just work

Before the breakages, it helps to know what keeps working, because these are the patterns you should move toward:

- Signals for local state. A signal write is always noticed, so anything you can express as a signal is safe.
- AsyncPipe for streams. Bind the observable directly and Angular handles the subscription and the refresh for you.
- Template event bindings. A (click) handler marks the view dirty, so plain fields updated inside a handler still render.
- The router, HttpClient, and forms. These are Angular managed, so their updates flow through the scheduler.

If a piece of state can be a signal or an AsyncPipe binding, make it that. The fewer plain fields you mutate from callbacks, the fewer surprises the migration will have.

## What actually breaks

Here are the breakages I see most often, in roughly the order they appear.

### Timers and promises that set plain fields

The first thing to break is usually a timer. Here is the classic example:

```typescript
count = 0;

ngOnInit() {
  setInterval(() => this.count++, 1000);
}
```

This counted up under Zone.js. Under zoneless it sits at zero forever. The callback runs and the field changes, but nobody tells Angular. The fix is a signal, because a signal write is an entry point:

```typescript
count = signal(0);

ngOnInit() {
  setInterval(() => this.count.update(c => c + 1), 1000);
}
```

If you cannot convert to a signal yet, call markForCheck after the mutation:

```typescript
private cdr = inject(ChangeDetectorRef);

ngOnInit() {
  setInterval(() => {
    this.count++;
    this.cdr.markForCheck();
  }, 1000);
}
```

The exact same rule applies to promises. A then block that assigns a plain field no longer refreshes anything. Use a signal or call markForCheck.

This is the breakage that feels the most unfair, because the code looks completely innocent. There is no lint rule that flags it. The view just stops, and the only clue is that a value changed in a callback.

### Manual subscriptions

HttpClient still works, but only when you let Angular see the value. This is fine:

```typescript
data$ = this.http.get<Data>('/api/data');
```

The AsyncPipe marks the view dirty on every emission. But if you subscribe by hand and assign a plain field, the view goes quiet:

```typescript
this.http.get<Data>('/api/data').subscribe(d => {
  this.data = d;
  this.cdr.markForCheck();
});
```

The subscribe callback is not an Angular entry point. The markForCheck at the end is what brings the view back. The cleaner version is toSignal, which turns the stream into a signal and makes every emission explicit.

The same goes for long lived streams like a BehaviorSubject you combine with combineLatest. If the final subscribe writes to a plain field, that field will not render until something else happens to tick the view. toSignal or AsyncPipe removes the whole class of bug.

### Raw listeners and third party callbacks

This is the biggest hotspot in a real app. WebSocket messages, postMessage handlers, MutationObserver and ResizeObserver callbacks, chart libraries, analytics SDKs. Anything that calls you back from outside an Angular template binding.

Under Zone.js those callbacks triggered change detection by accident. Under zoneless Angular does not notice them. The fix is the same two options. Write to a signal inside the callback:

```typescript
data = signal<string | null>(null);

connect(ws: WebSocket) {
  ws.onmessage = (ev) => {
    this.data.set(ev.data);
  };
}
```

Or end the callback with markForCheck if you are not ready to refactor. The same applies to browser observers. A ResizeObserver that sets a plain field will not refresh anything until you write to a signal or call markForCheck. I hit this exact case with a chart that measured its container, and the fix was one signal write inside the observer callback.

One thing to watch: teardown. Zone removal does not create leaks, but it does remove the incidental stability you may have leaned on, so make sure you unsubscribe and complete your streams.

### In place mutations with OnPush

Zoneless pushes you toward OnPush as the default. That is a good thing, but it resurfaces an old trap. If you mutate a value in place, Angular may never see it.

With a signal, pushing into the inner array mutates the array without writing the signal, so nothing notifies:

```typescript
items = signal<string[]>([]);

add(item: string) {
  this.items().push(item); // the signal never notifies
}
```

Write a new value instead:

```typescript
add(item: string) {
  this.items.update(list => [...list, item]);
}
```

The same trap exists with plain arrays under OnPush. If the reference does not change, the input comparison sees nothing new. Return a new array or call markForCheck.

The same logic applies to objects. If you mutate a property on an object that OnPush already compared, the reference is the same and the view will not know. New object, new array, or a signal write. Pick one and stay consistent.

### Your tests

Zone removal is most visible in the test suite, because a lot of the old helpers were built on Zone.js:

- fakeAsync and tick
- flush and flushMicrotasks
- waitForAsync
- fixture.whenStable

In a fully zoneless setup, fakeAsync can break because there is no zone to intercept the timers. The reliable path is async and await with explicit fake timers, plus your own detectChanges calls:

```typescript
it('updates after a timer', () => {
  jest.useFakeTimers();
  const fixture = TestBed.createComponent(CounterComponent);
  fixture.detectChanges();

  jest.advanceTimersByTime(1000);
  fixture.detectChanges();

  expect(fixture.nativeElement.textContent).toContain('Count: 1');
});
```

If you used whenStable to wait for the app to settle, note that without a zone the idea of stable changes. In many zoneless setups whenStable resolves quickly or behaves differently than you remember. The more predictable habit is to call detectChanges explicitly and mock time with fake timers, so your assertion waits on data, not on a framework notion of idle.

The same logic applies to fakeAsync. It worked by intercepting the zone, and without a zone there is nothing to intercept. Some setups still make it work by providing a zone only for tests, but that recreates the exact gap you are trying to close. Running the suite zoneless, with plain async and fake timers, keeps production and CI on the same page.

The trap to avoid: if you keep Zone.js in tests but remove it in production, Zone masks the missing markForCheck calls. Run at least part of your CI zoneless so the tests see the same world as production.

### Web components and custom elements

If you use custom elements, events emitted outside Angular template bindings may not mark views dirty. The rule is the same. Wire the event through an Angular binding, or call markForCheck in the callback. Direct DOM changes do not need change detection, but component state updates from a MutationObserver or ResizeObserver do.

### Libraries that assume Zone.js

Some older libraries import zone.js or rely on its patched globals. Validate them early. If a chart or an SDK stops rendering after the migration, it is usually because it was leaning on the global tick. Wrap its callbacks in signals or markForCheck, or find a zoneless compatible build.

![Dashboard App Example](./article-images/50_dashboard.jpeg)

## How to migrate without breaking everything

Here is the order I would use on a real project:

1. Audit for incidental ticks. Search for setTimeout, setInterval, requestAnimationFrame, raw addEventListener, WebSocket, and SDK callbacks that mutate component fields.
2. Make reactivity explicit. Convert local state to signals. Convert subscriptions to AsyncPipe or toSignal.
3. Standardize manual notification. For anything you cannot convert, end the callback with markForCheck.
4. Enable zoneless at bootstrap and remove zone.js from polyfills.
5. Fix the tests last, with fake timers and explicit detectChanges calls.

## A real migration, feature by feature

Let me make this concrete with a feature most apps have: a dashboard that polls the server.

The old component looked roughly like this. A plain field held the data, and ngOnInit called a service that set the field inside a setInterval callback. Zone.js made it render. Under zoneless it renders nothing, because the callback is not an Angular entry point.

The migration for that one feature goes in three small steps.

First, move the polling state into a signal. The service can still own the timer, but it writes to the signal instead of a plain field. The view updates, and you have removed one incidental dependency.

Second, if the service must stay imperative, have it call markForCheck after each update. That is the escape hatch for code you are not ready to rewrite yet.

Third, look at the tests. Replace any fakeAsync or whenStable wait with fake timers and explicit detectChanges. This is usually where the migration takes the most time, not the components themselves.

Do that for one feature, ship it with Zone.js still enabled, and repeat. Because signals and markForCheck work in both worlds, each feature you convert makes the eventual flip smaller and safer. By the time you remove zone.js, there is almost nothing left to break.

## What you win

It is easy to focus on the breakages and forget why you are doing this at all. The wins are real:

- Smaller bundles. zone.js is a meaningful chunk of JavaScript you no longer ship.
- Predictable updates. A view changes because a signal, an event, or an AsyncPipe said so, not because some timer you forgot about fired.
- Better performance. No more full tree passes triggered by unrelated async work. The scheduler coalesces updates and touches only what changed.
- One less framework magic trick. New team members can reason about when and why a view updates, which is worth a lot on a growing codebase.
- Easier debugging. When a view does not update, the reason is usually obvious: nobody wrote a signal, emitted through AsyncPipe, or called markForCheck.

## Trade offs and when not to do it

Zoneless is not free. The main cost is discipline. Every state change now has to be explicit, and if your team is not ready for that, you will ship frozen UI. The other cost is third party risk. Any library that assumed Zone.js becomes your job to wrap.

If you are not in a hurry, the honest path is to keep Zone.js for now and start converting state to signals. Signals work in both worlds, so you can do most of the hard migration before you flip the switch. When the audit shows nothing left leaning on incidental ticks, enabling zoneless is a one line change.

Also avoid the trap of replacing one global tick with many manual detectChanges calls. That can be worse than Zone.js. Prefer signals and markForCheck, which the scheduler can coalesce.

## Common mistakes to avoid

A few things I see teams do after the switch that make things worse:

- Calling detectChanges everywhere. It is synchronous and easy to abuse. markForCheck schedules the check and lets Angular coalesce it.
- Keeping Zone.js in tests while removing it in production. Your tests pass and your users see frozen UI. Run a zoneless CI job.
- Converting every field to a signal in one giant refactor. Do it feature by feature, and ship the signal changes while Zone.js is still on, because signals work in both worlds.
- Ignoring third party SDKs until the last minute. They are usually the hardest part, so audit them first, not last.

## Questions I get asked

### Will zoneless make my app faster?

Usually yes, but do not expect magic. The win comes from fewer and smaller change detection passes, plus a smaller bundle once zone.js is gone. The size of the win depends on how much your app relied on the global tick. A huge app with many timers often sees a real improvement. A tiny app might see almost none.

### Do I have to rewrite everything to signals first?

No. You can keep plain fields as long as you notify Angular with markForCheck. Signals are the cleaner long term answer, but markForCheck is a valid bridge, and it is exactly what the framework offers for imperative code.

### Can I keep Zone.js for a while?

Yes. Zone.js is still supported, and Angular lets you keep it while you convert. The sane path is to convert features while the zone is on, then flip when the audit is clean. You do not have to do it in one weekend.

### What about NgZone.run and runOutsideAngular?

They still exist and still work for libraries that need them. The difference is that NgZone no longer drives change detection. Code that waited for the zone to become stable, or that assumed any async work would tick, is the code you need to revisit.

### Is this related to OnPush?

Kind of. Zoneless does not force OnPush, but it pushes the same mental model: update when something tells you to, not because a global timer ran. If you are already disciplined with OnPush, signals, and AsyncPipe, the migration will feel easy.

## Conclusion

Zoneless does not really break your app. It reveals it. Every frozen counter and silent dropdown is a spot where you were leaning on a global tick you never thought about. The migration is boring in the best way: find the incidental ticks, make the state explicit, and the rest follows.

If you want to start today, audit one feature. Search it for timers and raw listeners. Convert the plain fields to signals. Then flip just that feature and watch it in production for a week. The app wide switch can wait until the audit comes back clean.

## Further reading

- Angular zoneless guide: https://angular.dev/guide/zoneless
- Angular signals guide: https://angular.dev/guide/signals
