---
title: '5 Tips To Improve Angular Performance'
seoTitle: '5 Tips To Improve Angular Performance'
seoDescription: 'As an Angular developer, you understand the importance of building high-performing web apps...'
slug: 8_5-tips-to-improve-angular-performance
tags: javascript, angular, tutorial, beginner
order: 8
datePublished: 25.04.2023
readTime: 8
coverImage: 8_5-tips-to-improve-angular-performance.png
---

As an Angular developer, you understand the importance of building high-performing web apps. Slow loading times, sluggish UI, and poor user experience can all harm your website's reputation and deter users from returning.

Fear not—there is a better way! In this blog post, you’ll learn five actionable tips that you can use immediately to boost your web application's performance. From avoiding memory leaks to running analytics outside of NgZone, let’s cover a variety of strategies to give your customers the best experience.

## 1. Prevent Memory Leaks

A memory leak in an Angular application occurs when objects in the application's memory are no longer needed but are not released by the garbage collector because they are still being referenced.

In the context of observables, if subscription is not unsubscribed when the component is destroyed or removed from the DOM, the observable and its associated resources will continue to exist in memory, even though they are no longer needed. Over time, this can cause a buildup of unused memory, which can slow down the application, reduce its performance, and even crash the application in extreme cases.

Suppose a user uploads an image. The application stores the image data in memory until it can be saved to a database. To do this, the application uses a `Subject` to which it subscribes when an image is uploaded. However, suppose the application does not unsubscribe from the Subject when the image has been saved to the database. In that case, the `Subject` will continue to hold a reference to the image data in memory.

```TS
@Component({})
export class ImageUploaderComponent implements OnInit {
  imageSubject = new Subject();

  ngOnInit() {
    // Subscribe to imageSubject to store uploaded images in memory
    this.imageSubject.subscribe(imageData => {
      this.saveImageToDatabase(imageData);
    });
  }

  uploadImage(imageData: any) {
    // Emit imageData to imageSubject
    this.imageSubject.next(imageData);
  }

  saveImageToDatabase(imageData: any) {
    // Save image data to database
    // ...
  }

  ngOnDestroy() {
    // Memory leak occurs if we don't unsubscribe
    // Unsubscribe from imageSubject to prevent memory leaks
    this.imageSubject.unsubscribe();
  }
}
```

Additionally, as memory leaks are often difficult to diagnose, they can be frustrating for developers to troubleshoot and resolve. Therefore, Angular developers must proactively prevent memory leaks by adequately unsubscribing from observables when they are no longer needed.

The most recommended way of subscribing to an observable is to use the [Async Pipe](https://angular.io/api/common/AsyncPipe) or the [rxjs takeUntil](https://www.learnrxjs.io/learn-rxjs/operators/filtering/takeuntil) operator.

## 2. Change Detection Strategy

In Angular, components have two change detection strategies: Default and OnPush. The Default change detection strategy checks for changes in all components and their children on every change detection cycle, such as on any user event, typing into the form, clicking on buttons, you name it. This can be resource-intensive, especially in large applications with many components, leading to performance issues.

On the other hand, the [OnPush change detection strategy](https://angular.io/api/core/ChangeDetectionStrategy) only checks for changes in components if the component's input properties have changed or if an event has been triggered by the component or one of its children. This can significantly reduce the number of change detection cycles and improve the application's performance.

The differences between the two strategies are demonstrated in the following pictures, where on the left, we see the Default strategy, and on the right, the OnPush change detection strategy.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ovwkp9n4d039bajsa4zx.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zn3uj7fgwj4k3wrozup7.png)

In general, using the OnPush change detection strategy for components is recommended whenever possible, especially in larger applications. This can help to improve the performance and scalability of the application. Even if the Default change detection strategy may be appropriate in smaller applications or in situations where the performance impact is negligible, it is still not recommended, as it may lead to bad development practices in the long run.

## 3. Memoize Function Calls

In Angular, function calls in the template are prohibited because they can cause performance issues. When a function is called in the template, it is re-executed every time change detection runs, like for every triggered user event, which can be very frequent in complex applications and lead to a lot of unnecessary processing and application slowdown.

Consider the following scenario of having two components allowing to search for entities on the server and displaying them while calculating additional data on the frontend.

```TS
@Component({
	selector: 'app-example-function-call',
	template: `
  <!-- search anime -->
  <app-search-anime [formControl]="animeSearchControl"></app-search-anime>

  <!-- table body -->
  <div *ngFor="let data of loadedAnime$ | async">
    <!-- .... -->
    <div>{{ hardMathEquasionFunctionCall(data) }}</div>
  </div>`,
})
export class ExampleFunctionCallComponent {

	animeSearchControl = new FormControl<AnimeData>({});
	loadedAnime$!: Observable<AnimeData[]>;

	ngOnInit(): void {
		this.loadedAnime$ = this.animeSearchControl.valueChanges.pipe(
			scan((acc, curr) => [...acc, curr], [] as AnimeData[])
		);
	}

    // this function is re-executed every time an user event happens
	hardMathEquasionFunctionCall(anime: AnimeData): number {
		console.log('Function call')
		return hardMathEquasion(anime.score);
	}
}
```

Here is a example of the above mentioned problem.

<img width="100%" style="width:100%" src="https://www.bitovi.com/hs-fs/hubfs/function-calls-the-template.gif?width=1440&height=810&name=function-calls-the-template.gif"/>

Unlike functions, which are re-executed every time change detection runs, Angular pipes are only executed when their input value changes. This means that pipes can help reduce unnecessary processing and improve the application's overall performance. Additionally, pipes are reusable and can be shared across different components, which can help to reduce code duplication and improve code maintainability.

<img width="100%" style="width:100%" src="https://www.bitovi.com/hs-fs/hubfs/using-angular-pipes-in-template.gif?width=1440&height=574&name=using-angular-pipes-in-template.gif"/>

One quick trick to solve all your function calls in a template without rewriting them as Pipes is using Memoization. Without going deep into the topic, memoization stores the previously calculated result of the subproblem. It uses the stored result for the same subproblem, removing the extra effort to calculate again for the same problem.

By understanding the concept of memorization, you can create a custom function decorator, as it is in the following code snippet, and apply it to all function call in the template so that the will behave exactly as Angular Pipes.

```TS
export function customMemoize() {
 // Value cache stored in the closure
 const cacheLookup: { [key: string]: any } = {};

 return (target: any, key: any, descriptor: any) => {
   const originalMethod = descriptor.value;

   descriptor.value = function () {
     // arguments can be object -> stringify it
     const keyString = JSON.stringify(arguments);

     // cached data
     if (keyString in cacheLookup) {
       return cacheLookup[keyString];
     }

     // call the function with arguments
     const calculation = originalMethod.apply(this, arguments);
     // save data to cache
     cacheLookup[keyString] = calculation;
     // return calculated data
     return calculation;
   };

   return descriptor;
 };
}
```

<img width="100%" style="width:100%" src="https://www.bitovi.com/hs-fs/hubfs/memoization-example.gif?width=1440&height=720&name=memoization-example.gif"/>

For more information on how memoization can be used in Angular, check out one of our [open-source examples](https://github.com/krivanek06/example_projects/blob/main/angular_memo/src/app/example-memo/memo.ts).

## 4. Use RxJS Pipes for Frequent Data Updates

It’s not a secret that we must react to user input in our application and modify, load, or send some data to the backend. The problem starts to arise when we frequently update a large data set. Let’s look at some examples and how RxJs pipes can help us.

### DistinctUntilChanged & DebounceTime

The `distinctUntilChanged` operator filters out consecutive duplicate values emitted by an observable. The debounceTime operator filters out values emitted by an observable that occur too frequently by ignoring values emitted too close together in time.

```TS
@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <input type="text" [formControl]="searchInput">
    <ul>
      <li *ngFor="let result of searchResults$ | async">
        {{ result }}
      </li>
    </ul>
  `
})
export class SearchBoxComponent implements OnInit {
  searchResults$!: Observable<string[]>;
  searchInput = new FormControl<string>('');

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    // Create an observable from the search input element
    this.searchResults$ = this.searchInput.valueChanges.pipe(
      // Apply the operators to the search input
      debounceTime(300),
      distinctUntilChanged(),
      // Call the search service to perform a search using the search term
      switchMap(value => this.searchService.search(value))
    );
  }
}
```

### BufferTime

When having an observable that emits a large collection of values multiple times per second and causes application slowdown because of frequent UI rendering, we can opt for the `bufferTime` operator. A real-life use case may be connected to a stock market web socket API that frequently emits data. However, we catch incoming data for `5000 milliseconds` and then update the UI.

```TS
@Component({
  selector: 'app-stock-updates',
  template: `
    <h2>Stock Updates</h2>
    <div *ngFor="let update of updates">{{ update }}</div>
  `
})
export class StockUpdatesComponent implements OnInit {
  updates$!: Observable<string[]>;

  ngOnInit() {
    // Connect to the WebSocket endpoint that emits stock market updates
    const socket = webSocket('wss://example.com/updates');

    // Apply the bufferTime operator to the WebSocket observable
    this.updates$ = socket
      .pipe(
        bufferTime(5000),
        // Concatenate the buffered updates and add them to the updates array
        scan((acc, curr) => [...acc, ...curr], [])
      );
  }
}
```

Other RxJs operators that can be useful to worth with frequent data emotions are:

- [auditTime](https://www.learnrxjs.io/learn-rxjs/operators/filtering/audittime) - ignores the source observable for a given amount of time
- [throttleTime](https://www.learnrxjs.io/learn-rxjs/operators/filtering/throttletime) - ignores subsequent source values for provided milliseconds

### RunOursideAngular

The runOutsideAngular method is helpful when short-lived heavy computations need to be executed within an Angular application, such as when performing data processing, rendering large datasets, or working with complex algorithms.

By executing these computations outside the Angular zone, the application can remain responsive and provide a smooth user experience.

A real-world use case for `ngZone.runOutsideAngular` might be a large file upload or download or a complex data processing task that requires significant processing time. By running these tasks outside Angular's change detection, we can ensure that the application remains responsive and doesn't freeze up.

```TS
@Component({
  selector: 'app-my-component',
  template: `
    <input type="file" (change)="onFileChange($event)">
    <button (click)="uploadImage()">Upload Image</button>
    <div *ngIf="uploadResult">Result: {{ uploadResult }}</div>
  `
})
export class MyComponent {
  uploadResult: string;

  constructor(
    private ngZone: NgZone,
    private imageUploadService: ImageUploadService,
    private cd: ChangeDetectorRef
  ) {}

  onFileChange(event) {
    // Get the selected file from the input element
    const file = event.target.files[0];

    // Pass the file to the image upload service to prepare for upload
    this.imageUploadService.prepareImageForUpload(file);
  }

  uploadImage() {
    // Call the image upload service to upload the prepared image
    this.ngZone.runOutsideAngular(() => {
      // uploading images <-- blocking operation, may freez up the UI
      this.imageUploadService.uploadImage().subscribe(result => {
        // Update the component state with the upload result
        this.ngZone.run(() => {
          this.uploadResult = result;
          // Manually trigger change detection
          this.cd.detectChanges();
        });
      });
    });
  }
}
```

> **_NOTE:_** It is essential to note that any changes made during the execution of the heavy computation will not trigger change detection, and developers will need to trigger change detection if necessary manually.

## 5. Web Workers for Heavy Computation

For heavy computation that may run through the whole lifecycle of the application, we can opt for web workers. Web workers are designed to execute heavy computations in separate threads, which can significantly improve the performance and responsiveness of the application and user experience.

However, using web workers requires more setup and coordination than using `runOutsideAngular`, as developers must manage multiple threads and handle communication between them.

```TS
// my-worker.ts

// Define a function that will be executed in the web worker
function doHeavyComputation(input: number): number {
  // Perform some heavy computation here
  return input * input;
}

// Set up a message listener to receive messages from the main thread
addEventListener('message', event => {
  // When a message is received, extract the data from the event
  const data = event.data;

  // Call the function and return the result to the main thread
  const result = doHeavyComputation(data.input);
  postMessage(result);
});
```

```TS
// my-component.component.ts
@Component({
  selector: 'app-my-component',
  template: `Result: {{ result }}`
})
export class MyComponent {
  result: number;

  constructor() {
    // Create a new instance of the Worker class
    const worker = new Worker('./my-worker.ts', { type: 'module' });

    // Set up a message listener to receive messages from the web worker
    worker.addEventListener('message', event => {
      // When a message is received, extract the data
      // from the event and update the component state
      const data = event.data;
      this.result = data;
    });

    // Send a message to the web worker
    worker.postMessage({ input: 5 });
  }
}
```

If you are writing a web worker that uses CommonJS modules instead of ES modules, you can specify this by setting `{ type: 'classic' }` instead of `{ type: 'module' }`. However, ES modules are generally recommended unless you have a specific reason to use CommonJS modules.

> **_NOTE:_** Note that web workers have some restrictions on what APIs are available to them (for example, they don't have access to the DOM), so you may need to modify your code accordingly. Additionally, you may want to handle errors and other edge cases to ensure that your web worker is robust and reliable.

## Summary

In this blog post, you learned how to identify common issues in your Angular application and saw potential solutions. Angular is a large ecosystem. It provides lots of features, hovewer it is very easy to make a mistake a build up the tech debt that may eventually slow down your release and competitive advantage.

Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
