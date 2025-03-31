---
title: 'Angular Rxjs - CatchError Position Matter!'
seoTitle: 'Angular Rxjs - CatchError Position Matter!'
seoDescription: 'Using rxjs you have many occurrences when you want to catch the errors from your streams, handle them...'
slug: 23_angular-rxjs-catcherror-position-matter
tags: angular, rxjs, tutorial
order: 23
datePublished: 29.12.2023
readTime: 3
coverImage: 23_angular-rxjs-catcherror-position-matter.webp
---

Using rxjs you have many occurrences when you want to catch the errors from your streams, handle them and return an arbitrary value. Examples may be include http calls, logical operations, calculations, etc. However did you know that the position of you `catchError` operator does matter ?

## Problem Overview

The [catchError](https://rxjs.dev/api/operators/catchError) operator starts to be tricky when you also introduce a higher-order observable such as [switchMap](https://rxjs.dev/api/operators/switchMap). Let’s have an example that you expect the user’s input and based on it you want to fetch some data. Here is the code describing this use-case.

```jsx
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section>
      <h2>Write something to the input</h2>
      <input [formControl]="searchControl" placeholder="write" />
    <section>
  `,
})
export class App implements OnInit {
  searchControl = new FormControl('', { nonNullable: true });

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        switchMap(() =>
          this.mockApiRequest()
        )
      )
      .subscribe();
  }

  /**
   * mock API request with some delay
   */
  private mockApiRequest(): Observable<unknown> {
    return of({}).pipe(
      delay(3000),
      switchMap(() => throwError(
        () => new Error('I have failed you'))
      )
    );
  }
}
```

The method `mockApiRequest()` should model a HTTP call to a server, which, ask you see, will fail. Alright, let’s just add `catchError` you may say, however the question is, on which position should the `catchError` be added to ?

## First Solution

Your initial solution may be adding `catchError` at the end of the stream as follows:

```jsx
ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        filter((x) => x.length > 3)
        switchMap(() =>
          this.mockApiRequest()
        ),
        catchError(() => {
			// todo: handle the error
          return EMPTY;
        })
      )
      .subscribe();
  }
```

At the first glance there is no problem with the code. When the `mockApiRequest()` throws an error, you catch it and handle it. However what if you received this error just for this specific string value sent to the backend and you want to continue listening on the user’s input and sent it to the backend ?

Quite a normal use case, which, in this case, will not work. In this example you put the `catchError` at the end of the stream and even if the `mockApiRequest()` throws the error, you still handle it at the end, therefore rxjs will treat it as the whole stream has an error an your stream will stop working.

Look at the below example where we console log each user’s input value, however after receiving an error, the console logs will no longer work.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ogfuh5ly4596thc6aurh.gif)

As this may not be your desired behaviour and if you still want to keep listening on the user’s input, here is a solution for you.

## Second Solution

In this example, to keep still listening of the user’s input, let’s place the `catchError` operator on the `mockApiRequest()` , instead of the end.

```jsx
ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        filter((x) => x.length > 3)
        switchMap(() =>
          this.mockApiRequest().pipe(
	        catchError(() => {
	          // todo: handle the error
              return EMPTY;
	    })
	  )
        )
      )
      .subscribe();
  }
```

With this change, you tell rxjs to return an arbitrary value if the API request fails, but not for the whole stream. Here is the result that you achieve by this simple change.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ivtw4iucv0if4n2f609a.gif)

## Summary

This short blogpost describe how the `catchError` operator can influence the behaviour of your application. You should always catch and handle application errors, but the position of the operator also matters, therefore if you know that your higher-order observables can error out, put the `catchError` operator on them too, not just at the end of you stream.

If you want to play around with this example visit the [stackblitz example](https://stackblitz.com/edit/stackblitz-starters-kfhtfs) connect with me on the following sites:

Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
