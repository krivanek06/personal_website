---
title: ''
seoTitle: ''
seoDescription: ''
slug:
tags: javascript, angular, rxjs, opinion
order:
datePublished:
readTime:
coverImage: ''
---

When I first started in Angular and saw the RxJS library, I was like: _whut is this_? After some crying days, reading RxJs docs, and youtube tutorials, I started to get my hands on it, understand it, and appreciate it…. or as I thought.

## Introducing the Problem

In my free time, I have been working on a money-tracking application called [spendmindful.com](http://spendmindful.com), where users can track their incomes and expenses and see a visual representation of their data.

One of the functionalities is to filter out historical data by the selected month. You select a month in a year, the historical data is loaded into the table, an expense chart is calculated, and a tag aggregation is performed (i.e., how much money you once again spend in Starbucks). An example can be seen in the following illustration:

![End Result](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/a33dwvoqskrxpshtg90n.gif)

Loading data from the server is an async operation, so while we perform loading, it is a nice UX to show some sort of skeleton loader. Here is where the problem starts.

## How was it Implemented

In the following snippet, you will see the initial implementation and, under it, a brief explanation.

```TS
// all daily data for a period
const totalDailyDataForTimePeriod$ = this.dateSource$.pipe(
	tap(() => {
          // displaying the skeleton loading
          this.filteredDailyDataLoaded$.next(false);
	}),
	switchMap((dateFilter) =>
          // get data from API
         this.service.getPersonalAccountDailyData(dateFilter)
	),
	tap(() => {
          // removing the skeleton loading
	     this.filteredDailyDataLoaded$.next(true);
	}),
);


// creating another observable from totalDailyDataForTimePeriod$
this.accountFilteredState$ = totalDailyDataForTimePeriod$.pipe(
	/* modifying data */
);

// creating another observable from totalDailyDataForTimePeriod$
this.filteredDailyData$ = combineLatest([
  totalDailyDataForTimePeriod$,
  this.selectedTagIds$
]).pipe(
	/* modifying data */
);
```

To understand what is happening, here is the summary:

1. Everything starts with `this.dateSource$`, which is just a `FormControl` that emits a value every time the user switches to a different month.
2. When `this.dateSource$` emits, we set the `this.filteredDailyDataLoaded$` to `false`, which will show that fancy skeleton loading on the UI.
3. The `switchMap` is a higher-order observable that takes an observable (the selected month) and returns a new observable (the API call to load daily data `getPersonalAccountDailyData()`)
4. Once the API call finishes, we set the `this.filteredDailyDataLoaded$` to `true`, which will remove the skeleton loading from the UI and show the components with the new data.
5. We save the 1-4 steps into a variable `totalDailyDataForTimePeriod$` because this variable is then **used to create other observables** (some data formatting) to which we already subscribe in the template (see the image below).

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/k7d5zv30qtzx8qo0tvsh.png)

## Where Did It Go Wrong?

At first glance, everything looks alright. Lots of RxJs, the implementation is very declarative, and we subscribe to observables only in the template with the `async` operator, so what is wrong? Take a look at what the implementation resulted in:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7cfy9ns4sv9jpnqeuoq3.gif)

The problem is that there is no loading screen even if the `filteredDailyDataLoaded$` is set to `false`. Moreover, instead of the loading screen, we almost have a blocking operation, where once the date is selected, nothing happens on the screen for ~2 seconds, and only when the data arrives from the BE, the UI is re-rendered.

I started doing some debugging around the loading screen, as you may guess by `console.log` everything everywhere all at once ;).

The two main places I was the most curious about were when the date `formControl` emitted a value and where the API returned the request. I was surprised to see the following outcome:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/03mxcsvzsh4othljc2wn.gif)

The inner observable, the `totalDailyDataForTimePeriod$` logic was getting executed multiple times. Why was this happening?

To understand the problem, we have to talk about [hot vs cold observables](https://www.decodedfrontend.io/hot-vs-cold-observable-in-rxjs/). In my logic, from the observable `totalDailyDataForTimePeriod$`, additional observables are created to which I subscribe in the template with the `async` pipe.

The `totalDailyDataForTimePeriod$` is a cold observable, meaning every time a subscription is issued to this observable or to observables that are created from this one, a new instance of the `totalDailyDataForTimePeriod$` in the memory is generated.

So we end up with multiple instances of the `totalDailyDataForTimePeriod$`, all of them modifying the `filteredDailyDataLoaded$` for showing/hiding the skeleton loaders, and all of the code is just a big race condition when the loader is displayed and when not.

What we want is to create a hot observable, which will compute `totalDailyDataForTimePeriod$` body only once and share its most recent value with any new subscriptions.

## Introducing the Fix

Making a cold observable to a hot one is, to be honest, it is quite straightforward. You have to use the RxJs [share](https://rxjs.dev/api/operators/share) or [shareReplay](https://rxjs.dev/api/operators/shareReplay) operator. I opted in for `shareReplay` because it allows broadcasting the latest computed value for any new subscriber (something like if you have used `behaviourSubject`). So the end fix was the following:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0yfgcd7t6a2o42i44yx3.gif)

## Summary

Angular with RxJs is one of the best combinations I have ever experienced as a frontend dev. It is a very declarative approach. An observable emits a new value, and every subscriber is notified. However, all of us make mistakes. This was one of mine, and I felt it is a good example to share to avoid it in the future.

Hope you liked this example. Feel free to follow me on [eduardkrivanek.com](https://eduardkrivanek.com/), [Github](https://github.com/krivanek06), [Linkedin](https://www.linkedin.com/in/eduard-krivanek-714760148/).
