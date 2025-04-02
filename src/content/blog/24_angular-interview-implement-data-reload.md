---
title: 'Angular Interview - Implement Data Reload'
seoTitle: 'Angular Interview - Implement Data Reload'
seoDescription: 'When interviewing into Angular related jobs, one question I used to get asked, is “Demonstrate a...'
slug: 24_angular-interview-implement-data-reload
tags: angular, rxjs, interview, tutorial
order: 24
datePublished: 31.01.2024
readTime: 4
coverImage: article-cover/24_angular-interview-implement-data-reload.webp
---

When interviewing into Angular related jobs, one question I used to get asked, is “Demonstrate a simple data reloading when user clicks on a button” (demonstrated on the gif).

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nfejshzdmijhx0l58zki.gif)

This question is tricky, because instead of jumping into the code, as a more experienced developer, you should as back “Do you want the solution to be imperative or declarative? 🤔”

This question will throw them off, increasing your perceived value in their eyes. Let’s describe what is the difference between these two approaches.

All the source code can be found on a [stack blitz example](https://stackblitz.com/edit/stackblitz-starters-hlnvxn).

## API Layer

About the API, I am using a very nice little Quote API - https://github.com/lukePeavey/quotable

```jsx
@Injectable({
  providedIn: 'root',
})
export class QuotesApiService {
  private url = 'https://api.quotable.io';
  private http = inject(HttpClient);

  getRandomQuote(): Observable<QuoteData> {
    return this.http
      .get<QuoteData[]>(`${this.url}/quotes/random`)
      .pipe(map((response) => response[0]));
  }
}
```

## Imperative Approach

Imperative approach is the most common one, and probably the one that you follow. The idea is that when you click on then button you trigger the `(click)` event, call an `onDataReload()` method, issue API call, subscribe on the stream and pass the received result to some internal property / signal. The example is demonstrated below.

```jsx
@Component({
  selector: 'app-button-click-normal',
  template: `
    <div class="wrapper">
      <div class="wrapper-text">
        Loaded Quote: {{ loadedQuoteSignal()?.content }}
      </div>

      <div class="wrapper-action">
        <button type="button" (click)='onQuoteLoad()'>Load Quote</button>
      </div>
    </div>
  `,
  standalone: true,
  styles: [],
})
export class ButtonClickNormalComponent implements OnInit {
  private quotesApiService = inject(QuotesApiService);

  loadedQuoteSignal = signal<null | QuoteData>(null);

  ngOnInit() {
    this.onQuoteLoad();
  }

  onQuoteLoad() {
    this.quotesApiService.getRandomQuote().subscribe((res) => {
      this.loadedQuoteSignal.set(res);
    });
  }
}
```

This is called “imperative approach”, because you “provide step-by-step” guide what to do.

- Using the `ngOnInit` you preload a data
- On every button click you call the `onQuoteLoad`.
- Create manually a new Http call
- Manually subscribe and pass data into the signal

Now, by all means, this approach is not bad. It very readable, easily debuggable, and every developer will know what is going on. This is the approach I personally tend use…. However on interviews you have to flex, you have to show who is the boss here and that you can demonstrate different solutions for the same problem and you are able to describe the benefits of each of them.

## Declarative Approach

In a nutshell, declarative programming consists of ”instructing a program on what needs to be done, instead of telling it how to do it” ← Yes, I copied this from google.

Let’s take a look how could we change the same example into a declarative approach.

```jsx
@Component({
  selector: 'app-button-click-reactive',
  template: `
    <div class="wrapper">
      <div class="wrapper-text">
        Loaded Quote: {{ (loadedQuote$ | async)?.content }}
      </div>

      <div class="wrapper-action">
        <button #loadQuoteButton type="button">Load Quote</button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class ButtonClickReactiveComponent {
  private quotesApiService = inject(QuotesApiService);

  @ViewChild('loadQuoteButton', { static: true, read: ElementRef })
  loadQuoteButton!: ElementRef<HTMLButtonElement>;

  loadedQuote$ = defer(() =>
    fromEvent(this.loadQuoteButton.nativeElement, 'click').pipe(
      startWith(null),
      switchMap(() => this.quotesApiService.getRandomQuote())
    )
  ).pipe(share());
}
```

Okey, this is a little bit weird, if you have never tried creating event listeners. To briefly describe what’s going on:

- You create viewChild reference on your button, setting the `{static: true}`, to resolve reference only once, before the first change detection happens. This can be a separate post, so for more info [read here](https://stackoverflow.com/questions/56359504/how-should-i-use-the-new-static-option-for-viewchild-in-angular-8).
- You want to create an Observable which will emit every time the user clicks on the button so you use `fromEvent(this.loadQuoteButton.nativeElement, 'click')`
- You apply `startWith(null)` so that your stream has some initial value and you go straight to loading data with `switchMap(() => this.quotesApiService.getRandomQuote())`
- What is `defer` ? - It creates an Observable only when the Observer subscribes. Not using defer, the application will throw an error `Cannot read properties of undefined (reading 'nativeElement')` . In my understanding, it creates an Observable when the view is initialized, meaning it already passed the `AfterViewInit` lifecycle, but I can be wrong .Click here to [read more about it](https://stackoverflow.com/a/57278481).
- Finally applying `pipe(share())` to allow multiple subscriptions without triggering data reload for each subscription, only if user clicks

## Summary

Being a developer involves being able to come up with multiple solutions on the same problem. This is a simple problem which can involve two different solutions. I personally am the fan of imperative approach. The declarative one looks “more fancy”, but I haven’t seen it being used on any production project. Still, it is good to know something like that exists.

Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
