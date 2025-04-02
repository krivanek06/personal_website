---
title: 'Why Am I Switching To Signals In Angular?'
seoTitle: 'Why Am I Switching To Signals In Angular?'
seoDescription: 'Angular version 16 released a feature, that, I would say wasn’t really expected to come and shocked...'
slug: 16_why-am-i-switching-to-signals-in-angular
tags: javascript, angular, beginner, opinion
order: 16
datePublished: 22.06.2023
readTime: 8
coverImage: article-cover/16_why-am-i-switching-to-signals-in-angular.png
---

Angular version 16 released a feature, that, I would say wasn’t really expected to come and shocked most of the developers. Yes, I am talking about [Angular Signals](https://angular.io/guide/signals). There are lots of already made great articles from developers, such as [Angular & Signals. Everything you need to know](https://dev.to/this-is-angular/angular-signals-everything-you-need-to-know-2b7g), from [Robin Goetz](https://dev.to/goetzrobin) (kudos to him), however with this article I want to give my experience working with them.

## Initial Confused Feelings

I think it is safe to say that some developers were initially confused as the Angular team announced that instead of using RxJs more and more, they will switch to something else - signals. You know, using rxjs in Angular sometimes feels like being in a never-ending toxic relationship. It's that rollercoaster of emotions where, when it doesn't work, you're left scratching your head, searching for the problem, having no idea about the data flow.

On the other hand, when it does work, oh boy, it's like deciphering an ancient code, where only you possess the secret knowledge to understand the mystical dance of operators, observables, and subscriptions. It's a love-hate affair that keeps you on your toes, with moments of frustration and enlightenment.

I personally learned RxJs just because I started to use Angular (haven’t heard about it before that) and developers who survived being long enough in the Angular ecosystem, also started to worship the library.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pt41zm3xkw1xfet46u8b.jpeg)

That being said, I want to talk why I am switching to signals in components to render data in the DOM. If you can think about something else, feel free to drop a comment, but here are my key takeaways.

## Synchronous vs Asynchronous Data Manipulation

Most of the things that happen on the front end is asynchronous. We don’t know when the user will log in to the application, when he fills out the form and submit it, when he clicks on the buttons and loads some data from the server. It is just obvious we should treat each data asynchronously, where Observables are the best examples. Every subscriber will be notified of the last pushed values into the observer - read more about [what is an observable](https://rxjs.dev/guide/observable).

The problem with Observables starts to arise as your app grows. Everything that consumes an Observable and creates a new data structure is an Observable, so slowly, but surely, your whole app will become a mess of Observables (a mess that we just love ❤️ ).

There are of course other small [problems with Observables](https://angular.io/guide/comparing-observables), such as subscription, subscription cancelation, preventing memory leaks, error handling, [diamond problem](https://dev.to/this-is-angular/i-changed-my-mind-angular-needs-a-reactive-primitive-n2g), etc.

## Async Pipe vs toSignal

Using [async pipe](https://angular.io/api/common/AsyncPipe) is the best way how to issue a subscription to an Observable, because you can be sure, the pipe will cancel your subscription once you navigate away. Angular in version 16 however introduced a function named `toSignal` to help convert an Observable into a reactive Signal.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/60lh0d56ik3zwzldwztp.png)

So instead of the old `async` pipe, you can use `toSignal` function as follows:

```jsx
@Component({
  selector: 'my-app',
  standalone: true,
  imports: [ /* ... */ ],
  template: `
    <h4>Rxjs</h4>
    <div *ngFor="let data of displayDataSource$ | async">
      {{ data }}
    </div>

    <h4>Signals</h4>
    <div *ngFor="let data of displayDataSourceSignal()">
      {{ data }}
    </div>
  `,
})
export class App {
  // think that this is coming from the server
  private dataSourceOne$ = of(['one-1', 'one-2', 'one-3']);

  // display values with rxjs
  displayDataSource$ = this.dataSourceOne$;
	// display values with signal
  displayDataSourceSignal = toSignal(this.dataSourceOne$);
}
```

Great! But let’s be honest, who cares, right? Whether I use the `async` pipe or the `toSignal` function, I will achieve the desired result nevertheless, so what is the point of switching to `toSingal`?

## Removing zone.js in the Future

There are some great articles on [reverse-engineered zone.js](https://indepth.dev/posts/1135/i-reverse-engineered-zones-zone-js-and-here-is-what-ive-found) and [zone.js to zoneless Angular](https://indepth.dev/posts/1513/from-zone-js-to-zoneless-angular-and-back-how-it-all-works) which are worth a read, however, this section is just pure hypothesis. ZoneJS is a signaling library to help Angular detect when the application state might have changed. The problem is how it works. Even if you use [change detection OnPush](https://blog.angular-university.io/onpush-change-detection-how-it-works/), whenever your child component triggers a user event - button clicks, form typing, etc. Angular will mark every parent component as dirty and compare their old state with the new one, whether they should be rendered. Here is an illustration:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wtcmag77i4qplw42kj0c.png)

Every time the user click on the button in the `ButtonComponent`, Angular will issue a `tick` notification from the child component `ButtonComponent` to each and every parent component, until it reach the root `AppRef` and by that zone.js marks every component as dirty and Angular performs change detection on all of them, because Angular just doesn’t know whether by clicking on a button something may have changed on other components. Kudos to [Joshua Morony](https://www.youtube.com/@JoshuaMorony) and his [explanation](https://www.youtube.com/watch?v=lmrf_gPIOZU&ab_channel=JoshuaMorony).

## Angular Signals and Vue Ref ?

You know RxJs … is not that easy. The first thing is that, the whole data manipulation is asynchronous and the second thing is that you have to learn a bunch of [RxJs operators to be efficient](https://www.learnrxjs.io/learn-rxjs/operators), otherwise you can shoot yourself to the foot.

My proposition is to treat HTTP operation still as Observables, however, once you import you services to the component and you want to display data in the HTML, convert all your observables into signals.

The whole idea of removing zone.js from Angular and making it “not-reactive” reminds me how [reactivity works in VueJS](https://vuejs.org/guide/extras/reactivity-in-depth.html). VueJs is by default not reactive. You have to use `ref` or `reactive` functions to make a variable reactive to manipulate with the DOM. An example is the following.

```jsx
<template>
  <section>
    <button @click="onShowHiddenDiv">Show div</button>

    <div v-if="showHiddenDiv">this is hidden</div>
  </section>
</template>

<script setup lang="ts">
let showHiddenDiv = false;

const onShowHiddenDiv = () => {
  showHiddenDiv = !showHiddenDiv;
};
</script>
```

The above example will not work, because `showHiddenDiv` is not a reactive variable and when we click on the button, the `onShowHiddenDiv` will execute, the `showHiddenDiv` will change, however, the DOM will not react on the changed value. You will have to use `ref` to make `showHiddenDiv` reactive as follows:

```jsx
<template>
    <button @click="onShowHiddenDiv">Show div</button>

    <div v-if="showHiddenDiv">this is hidden</div>
  </section>
</template>

<script setup lang="ts">
// now it will work 😁
const showHiddenDiv = ref(false);

const onShowHiddenDiv = () => {
  showHiddenDiv.value = !showHiddenDiv.value;
};
</script>
```

Since signals in Angular are in the early stage, I believe there is much to come. What I believe we will receive is a library similar to [VueUse](https://vueuse.org/) something like RxJs operator for signals.

## Keeping the state of a subscription

A use-case may arise we have an Observable, we use the async pipe for subscription to show data in the HTML. The subscription however is inside an `NgIf` section which is initially `false` (doesn’t exist) and only when the user displays the section, only then we subscribe to that observable. Let me demonstrate the following problem:

```tsx
// imports

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [
    /* imports */
  ],
  styles: [
    /* styles */
  ],
  template: `
    <button
      type="button"
      mat-flat-button
      color="primary"
      cdkOverlayOrigin
      (click)="showOverlaySignal.set(!showOverlaySignal())"
      #origin="cdkOverlayOrigin">
      show modal
    </button>

    <span class="text-display"> is checkbox checked: {{ showTwo.value }} </span>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="showOverlaySignal()">
      <div class="overlay-body">
        <div class="overlay-body-head">
          <h3>
            <ng-container *ngIf="showTwo.value"> Show Two </ng-container>
            <ng-container *ngIf="!showTwo.value"> Show One </ng-container>
          </h3>
          <mat-checkbox color="primary" [formControl]="showTwo"> Show Number TWO </mat-checkbox>
        </div>

        <div class="overlay-body-grid">
          <div>
            <h4>Rxjs</h4>
            <div *ngFor="let data of displayDataSource$ | async">
              {{ data }}
            </div>
          </div>

          <div>
            <h4>Signals</h4>
            <div *ngFor="let data of displayDataSourceSignal()">
              {{ data }}
            </div>
          </div>
        </div>
      </div>
    </ng-template>
  `,
})
export class App {
  showOverlaySignal = signal(false);

  private sourceOne$ = of(['one-1', 'one-2', 'one-3']);
  private sourceTwo$ = of(['two-1', 'two-2', 'two-3']);

  showTwo = new FormControl<boolean>(false, {
    nonNullable: true,
  });

  // approach is problematic because we subscribe in overlay
  displayDataSource$ = this.showTwo.valueChanges.pipe(
    startWith(this.showTwo.value),
    tap(d => console.log('rxjs', d)),
    switchMap(isChecked => iif(() => isChecked, this.sourceTwo$, this.sourceOne$))
  );

  displayDataSourceSignal = toSignal(
    this.showTwo.valueChanges.pipe(
      startWith(this.showTwo.value),
      tap(d => console.log('signal', d)),
      switchMap(isChecked => iif(() => isChecked, this.sourceTwo$, this.sourceOne$))
    )
  );
}
```

CSS and some small code section is removed, however I do include the [stackblitz example](https://stackblitz.com/edit/stackblitz-starters-rusmig?file=src%2Fglobal_styles.css,src%2Fmain.ts), where you can play around with the code snippet. Lets describe what is happening. In short, each time you click on a button an overlay will appear, and we display the values from the `displayDataSource$` observable and also from the `displayDataSourceSignal`, take a look below:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zmbgycr9f5irumhutcib.gif)

I want to highlight a two things. First, because we using `toSignal`, angular immediately subscribed to `showTwo.valueChanges` to create the `displayDataSourceSignal` and our `tap((d) => console.log('signal', d))` is executed right away when the application started.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7x8e5x9g59jbgtuqkzmi.png)

Second, there is bug that is happening. The `displayDataSource$` is subscribed in the template by `displayDataSource$ | async` only if when the overlay is visible, meaning, each time the overlay is opened, a subscription to `displayDataSource$` is created and then destroyed as the overlay is closed. This undesirable outcome happens by the following steps:

1. open the dialog
2. click the checkbox in the overlay to show list of **two-N**
3. close the overlay
4. open it again

A new subscription is created to the `displayDataSource$` and it no longer remembers it old state that the checkbox was checked and results to disparate value with `displayDataSourceSignal`.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/e0648gr6rxpmg1myaf03.png)

It is an easy mistake to make and hard to spot. Fortunately it can be fixed by attaching [shareReplay](https://www.learnrxjs.io/learn-rxjs/operators/multicasting/sharereplay) to the `displayDataSource$`:

```tsx
displayDataSource$ = this.showTwo.valueChanges.pipe(
  startWith(this.showTwo.value),
  tap(d => console.log('rxjs', d)),
  switchMap(isChecked => iif(() => isChecked, this.sourceTwo$, this.sourceOne$)),
  // shareReplay fix the value incompatibility with signals
  shareReplay({ refCount: false })
);
```

It is importance to ensure that the `refCount` parameter is set to `false` to preserve the `displayDataSource$` inner observable value. By doing so, even when the reference count drops to zero (the overlay is closed), the inner observable remains intact and unsubscribed, retaining the last emitted value. For a more information you may be interested in reading [How shareReplay Saved My Angular Project](https://dev.to/krivanek06/the-real-usage-of-sharereplay-in-angular-4fpa) and [RXJS ShareReplay Explained With Examples](https://huantao.medium.com/rxjs-sharereplay-explained-with-examples-3d9add51575f).

However, it is worth noting that while the `refCount: false` solution resolves the initial issue, it introduces a subsequent concern. It will maintain the last emitted values from `displayDataSource$` in the application (browser) memory, even if we navigate away from the component. The ramifications of this behaviour may be subject to debate, but it is an unintended side-effect.

## Summary

Signals were definitely a surprised feature in Angular and made us ask the question “why?”. As time goes I believe more and more developers will be comfortable with them and Angular will start to pick up some similarities on how reactivity works in other frameworks, like VueJS for example.

I am personally starting to use signals more often in components to subscribe to an observable and only using signals in the template. I am looking forward what new feature Angular will bring us.

Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
