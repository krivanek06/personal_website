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

Recently I migrated one of my applications from a pure Angular project into NX monorepo and encountered an interesting example of passing environments variable into libraries where I had to use [InjectionToken](https://angular.io/api/core/InjectionToken) to solve my problem.

## Original Implementation In Angular

Initially, I had a `DataApiService` service, for calling API endpoints to retrieve data.

```TS
@Injectable({
	providedIn: 'root',
})
export class DataApiService {
	constructor(private http: HttpClient) {}

	getRandomData(ticker: string): Observable<DataSummary[]> {
		return this.http.get<DataSummary[]>(
			`${environment.myEndpoint}/search?symbol=${ticker}
		`);
	}

	// .... other api calls
}
```

As an Angular developer, you are most likely familiar with such an implementation. I want to highlight the part that later caused the problem, which is `environment.myEndpoint`, the url saved in `environments` because in prod it differs from development.

## Migration API call into NX Monorepo

Once I migrated my app into NX, I create an Angular library by NX under `libs/api` with the command `nx g @nx/angular:library api`.

The problem that happened by moving the `DataApiService` from the Angular project into its own library was that it no longer had access to the environment variable `environment.myEndpoint`.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/d4u6j24xxwivybgvgu6m.png)

Nx tried to resolve the missing dependency `environment.myEndpoint` by using a relative path, instead of an absolute one, which is not recommended using NX and can cause severe problems.

## Angular InjectionToken

Before I jump to the solution, on how I fixed this issue (yeah, by [InjectionToken](https://angular.io/api/core/InjectionToken)) I want to talk about what they are, because if you are not building a library, you may not even used them before (at least I didn’t).

In Angular, an [Injection Token](https://blog.angular-university.io/angular-dependency-injection/) serves as a unique identifier used by the dependency injection system to locate and provide instances of dependencies to requesting components. It acts as a key that bridges the gap between the provider and the consumer, allowing for seamless communication and decoupling of components.

Unlike string-based dependencies, which can lead to naming conflicts and make refactoring challenging, Injection Tokens provide a reliable way to refer to dependencies using a distinct, typed token. The main benefits are:

- Dependency Decoupling
- Code Reusability
- Avoiding Name Collisions
- Configuration Flexibility

Defining an Injection Token is a straightforward process by using the `InjectionToken` class.

## Injection Token in Libraries

To solve the outlined problem of passing environments from an `app` into a `lib` in NX, create an `InjectionToken` with the following syntax:

```TS
// create injection token - value can be anything
export const ENDPOINT_URL = new InjectionToken<string>('endpoint_url');

@Injectable({
	providedIn: 'root',
})
export class DataApiService {
	constructor(
		private http: HttpClient,
		// use injection token to resolve the endpoint
		@Inject(ENDPOINT_URL) private readonly endpointUrl: string
	) {}

	getRandomData(ticker: string): Observable<DataSummary[]> {
		return this.http.get<DataSummary[]>(
			`${this.endpointUrl}/search?symbol=${ticker}
		`);
	}

	// .... other api calls
}
```

And pass the `myEndpoint` url into it in the `app` level as follows:

```TS
bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: ENDPOINT_URL,
      useValue: environment.myEndpoint,
    },
  ],
}).catch((err) => console.error(err));
```

## Summary

Once you start building libraries you have to remember that you don’t know how the end user will consume it. There are some recommendations, such as making it three-shakable, not exporting unnecessary code, and using injection tokens to pass important data for your libraries.

Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
