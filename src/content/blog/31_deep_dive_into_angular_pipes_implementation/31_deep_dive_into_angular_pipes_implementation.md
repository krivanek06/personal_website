---
title: 'Dive Into Angular Pipes Implementation'
seoTitle: 'Dive Into Angular Pipes Implementation'
seoDescription: 'Dive Into Angular Pipes Implementation'
slug: 31_deep_dive_into_angular_pipes_implementation
tags: javascript, angular, rxjs, tutorial
order: 31
datePublished: 11.10.2024
readTime: 8
coverImage: 31_deep_dive_into_angular_pipes_implementation.png
---

One of the first things you learn about Angular is to avoid executing function calls in a template, and instead, use [Angular pipes](https://v17.angular.io/guide/pipes-overview).

The tldr about functions calls are, that for each change detection, Angular can’t predict whether the return value of the executed function in the templated has changed or not, so Angular will re-execute that function again and again for every change detection, until the end of eternity. For more information read about - [Why you should never use function calls in Angular template expressions](https://medium.com/showpad-engineering/why-you-should-never-use-function-calls-in-angular-template-expressions-e1a50f9c0496).

Now back to the topic. You replace your functions with pipes and call it a day, however a junior dev visits you and ask you:

- junior: “Why are Angular pipes fine to use in the template?”
- you: “Because pipes cache the input value and until the input value doesn’t change, they just return the already computed returning value.”
- junior: “Ok…but can you prove it?”

And that brings us to the deeper exploration of how Angular pipes work, along with introducing a technique for safely executing function calls within templates.

**Note**: The inspiration for this article came from [It’s ok to use function calls in Angular templates!](https://itnext.io/its-ok-to-use-function-calls-in-angular-templates-ffdd12b0789e) by Enea Jahollari, which I highly recommend for further reading.

## Application Example

Consider a scenario where using a pipe might be beneficial. We have a search input that retrieves entities from a server based on the user's input. For each selected item, we need to calculate additional data, which is displayed in a `custom` column. However, this calculation is performed on the server, requiring an API call. Therefore we use a pipe a make this API call.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/btchn9fk8j512h62iivs.gif)

Here is the code for the above GIF

```jsx
// ... imports ...

@Component({
  selector: 'app-example-pipe',
  template: `
    <h2>Pipe call component</h2>

    <!-- search anime -->
    <app-search-anime [formControl]="animeSearchControl" />

    <!-- table header -->
    <app-table-header />

    <!-- table body -->
    <div *ngFor="let data of loadedAnime$ | async" class="...">
      <div>{{ data.title_english ?? data.title }}</div>
      <div>{{ data.source }}</div>
      <div>{{ data.duration }}</div>
      <div>{{ data.score }}</div>
      <div>{{ data | hardMathEquasionPipe | async }}</div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ /* ... imports ... */  ],
})
export class ExamplePipeComponent {
  private apiService = inject(ApiService);

  animeSearchControl = new FormControl<AnimeData>(
	  {} as AnimeData, { nonNullable: true }
	);

  loadedAnime$ = this.animeSearchControl.valueChanges.pipe(
	  scan((acc, curr) => [...acc, curr], [] as AnimeData[])
	);
}
```

We are using the `hardMathEquasionPipe` pipe to send an API request to calculate some additional data for each item.

```jsx
@Pipe({
  name: 'hardMathEquasionPipe',
  standalone: true,
})
export class HardMathEquasionPipe implements PipeTransform {
	private apiService = inject(ApiService);

  transform(anime: AnimeData): Observable<number> {
    console.log(`Pipe running for ${anime.title}`);
    return this.apiService.hardMathEquasionAsync(anime);
    // ^^ API request to the server
  }
}

```

All in all this is something you know how to do. Now, we are going to examine why pipes behave as they do and why they don’t recompute on every change detection. We will look at what actually happens when you build the app.

## Building The Application

To have a readable build format, we are using the following command:

- `ng build --output-hashing=none --optimization=false --named-chunks=true`

In the outputted file (`main.js`) we search for the`ExamplePipeComponent` component. We are looking for this component, because it uses the `HardMathEquasionPipe` pipe in the template.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wrtling39hdq5aqf8t73.png)

**Note:** You may see a symbol `\u0275\u027` before every function, but for readability purposes I removed it.

The component (function) is divided into two blocks by the Renderer Flag (`rf`), where the first (`rf & 1`) section executes on the component creation, and the second (`rf & 2`) executes for every change detection. More information can be found on: [Overview of Angular’s Change Detection operations in Ivy](https://angular.love/overview-of-angulars-change-detection-operations-in-ivy).

What we are interested here is the last part:

- `textInterpolate(pipeBind1(12, 7, pipeBind1(11, 5, data_r1)))`

which for every change detection will re-execute our pipe logic

- `pipe(11, "hardMathEquasionPipe")`

and bind (interpolate) the pipe’s returning value to the DOM (see the number `11` as it creates some sort of reference between `hardMathEquasionPipe` and `pipeBind1`.

## Further Investigation

Diving deeper into how Angular pipes work, we look at `pipeBind1` function. It binds the pipe (`hardMathEquasionPipe`) into some data (in our case the selected anime data) in the template The `pipeBind1` is an internal Angular function, so you see this same code:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yq7z66egvir3gs2qvpjw.png)

Our `hardMathEquasionPipe` is a pure pipe (by [default all of them are](https://v17.angular.io/api/core/Pipe)), so we check out the `pureFunction1Internal` . You should see this exact code:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/why293mir2wgmin5zpnx.png)

What’s happening is that the function `bindingUpdated` checks (for every change detection) whether the old value provided to the pipe is the same as the new value.

If they are not the same, the `updateBinding` will recompute the pipe’s logic and update the DOM with the new value that the `hardMathEquasionPipe` returned.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yay04e3ir549r0ctrxr5.png)

However in our case, the input value (the anime data) hasn’t changed, so we are more curious about the `getPureFunctionReturnValue` function.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/j037j2ol5lgi8l151fvo.png)

More or less the `getPureFunctionReturnValue` just returns the last (already computed) value by the `hardMathEquasionPipe` pipe and updates the view. As I understand the view is always updated whether the pipe logic is executed or the cached value is returned.

### What Does This All Mean?

In short it means that pipes are executed for every change detection (user events), however Angular internally compares the new inputed value to (with all it’s arguments) the pipe and if the input values are the same as for the previous computation, the pipe returns the already computed (cached) value.

On the other hand if the input value or its arguments have changed, the pipe’s logic will be re-executed, however in both cases the `textInterpolate(...)` function is executed that updates the DOM with the pipe’s returned value.

Here is a code example of the `textInterpolate()` function:

```jsx
function textInterpolate1(prefix, v0, suffix) {
  const lView = getLView();
  const interpolated = interpolation1(lView, prefix, v0, suffix);
  if (interpolated !== NO_CHANGE) {
    textBindingInternal(lView, getSelectedIndex(), interpolated);
  }
  return textInterpolate1;
}

function textBindingInternal(lView, index, value) {
  const element = getNativeByIndex(index, lView);
  // ^^ which DOM element should be updated

  updateTextNode(lView[RENDERER], element, value);
  // ^^ updates the DOM element with the value
}

function updateTextNode(renderer, rNode, value) {
  renderer.setValue(rNode, value);
}
```

Given that pipes are re-executed on every change detection cycle, with cached input values and consistent returning results, it's possible to create utilities to transforming component's functions into pipe-like behaviour. These utilities are particularly valuable in scenarios where numerous function calls occur within the template, but a full refactor into pipes isn't feasible.

## Pure Pipe

One way how to allow executing (async or normal) function calls in the template with improved performance, is to create a `pure pipe` as follows:

```jsx
@Pipe({
  name: "pure",
  standalone: true,
})
export class PurePipe implements PipeTransform {
  /**
   * @Inject(ChangeDetectorRef) prevents:
	 *   NullInjectorError: No provider for EmbeddedViewRef!
   */
  constructor(
    @Inject(ChangeDetectorRef)
    private readonly viewRef: EmbeddedViewRef<unknown>
  ) {}

  /**
   * @param fn - function executed in the template
   * @param args - list of arguments for the function
   * @returns - transformed function into a pipe behaviour
   */
  transform<T extends (...args: any) => any>(
    fn: T,
    ...args: [...Parameters<T>]
  ): ReturnType<T> {
    return fn.apply(this.viewRef.context, args);
  }
}
```

And you can use this `pure` pipe as follows

```jsx

@Component({
  selector: "app-example-pipe",
  template: `
    <!-- rest of component -->

    <!-- table body -->
    <div *ngFor="let data of loadedAnime$ | async" class="...">
      <!-- rest of table -->
      <div>
        {{ equasionAsyncFunction | pure : data | async }}
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [/* ... */, PurePipe],
})
export class ExamplePipeComponent {
	/* ...... */

  equasionAsyncFunction(anime: AnimeData): Observable<number> {
    console.log(`%c [Async] Function call ${anime.title}`);
    return this.apiService.hardMathEquasionAsync(anime);
  }
  /* ^^ function call in the template making an API call */
}
```

The end result of this behaviour is presented on the GIF below. You may observe that even when multiple items are selected and we use function calls in the template (`equasionAsyncFunction`), the logic inside the function (the API call) is not being re-executed for every user event (typing to the input form), which is usually the case if you just blindly call functions in the template.

On the other hand, the function behaves as a Pipe, meaning for every change detection, we compare the old input value with the new one, and if there is no change (the selected anime items remain the same) then the logic inside the function is not re-executed, instead the cached value is returned.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fanmyetujuzptfxeb7di.gif)

Lastly if you are already using the ngxtension library, there is a pipe called [CallPipe / ApplyPipe](https://ngxtension.netlify.app/utilities/pipes/call-apply/) which have a very similar functionality to the `pure` pipe above.

## Memoization Decorator

If you want to be a little bit fancy, instead of the `pure` pipe, you can create a memoizable decorator and apply it to functions executed within the template.

### What’s a Decorator?

A decorator, simple put, is a function ([closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)) that modifies the behaviour of an another function. While you can create your own memoization decorator, here’s an example of what it might look like:

```jsx
import { first, tap, of } from "rxjs";

export function customMemoize() {
  // cache already executed function calls in the template
  const cacheLookup: { [key: string]: any } = {};

  return (target: any, key: any, descriptor: any) => {
   // store the original method behaviour
    const originalMethod = descriptor.value;

    // overwrite the original method
    descriptor.value = function () {
      // arguments can be an object -> stringify it
      const keyString = JSON.stringify(arguments);

      // already cached data
      if (keyString in cacheLookup) {
        console.log("reading from cache");
        return cacheLookup[keyString];
      }

      // call the function with arguments
      const calculation = originalMethod.apply(this, arguments);

      // save data to cache
      cacheLookup[keyString] = calculation;

      // return calculated data
      return calculation;
    };

    // return the overwritten function behaviour
    return descriptor;
  };
}
```

### Key Considerations

The most critical aspect of the memoization decorator is creating the `cacheLookup` outside of the inner function. This ensures that results are stored across multiple function calls.

The inner function returns a modified version of the method to which the decorator is applied on. To cache the results of function calls within the template, we need a unique key under which the computed result will be stored. In this case, the best approach is to `stringify` the arguments passed to the function, since they can be objects.

Initially, the function runs and computes the result via `originalMethod.apply(this, arguments)`. This result is then stored in the cache. On subsequent executions triggered by change detection (such as user events), the function will first check if a result for the same input is already cached, and if so, it returns the cached value.

```jsx
@Component({
  selector: "app-example-pipe",
  template: `
    <!-- rest of component -->

    <!-- table body -->
    <div *ngFor="let data of loadedAnime$ | async" class="...">
	    <!-- rest of table -->
        <div>{{ equasionAsyncFunctionMemo(data) | async }}</div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [/* ... */],
})
export class ExamplePipeComponent {
	/* ...... */

  @customMemoize()
  equasionAsyncFunctionMemo(anime: AnimeData): Observable<number> {
    console.log(`%c [Async] Function call ${anime.title}`);
    return this.apiService.hardMathEquasionAsync(anime);
  }
  /* ^^ function call in the template */
}
```

The following GIF shows the behaviour of this decorator:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/u2tpjdcg7udw2ctxpiqw.gif)

You see many prints `reading from cache` because the decorator is executed for every change detection (on every user event), however since the input value haven’t changed, the decorator will not re-execute the function call used in the template.

## Summary

In this article, we've explored the hidden behaviour of Angular pipes and their performance benefits. Now we understand how pipes cache the computed results and only re-executing when input values change.

Additionally, we've looked on two alternative approaches for achieving pipe-like behaviour: the Pure Pipe utility and the Memoization Decorator. These utilities allow using function call in the template by caching the computed result, which overall improves application performa

If you want to explore and play around the code, visit the [github repo](https://github.com/krivanek06/stackblitz-angular-pipe-and-memo) or the [stackblitz](https://stackblitz.com/~/github.com/krivanek06/stackblitz-angular-pipe-and-memo) example. I hope you liked the article and feel free to share your thoughts, or connect with me on [dev.to](https://dev.to/krivanek06) | [LinkedIn](https://www.linkedin.com/in/eduard-krivanek).
