GraphQL servers are becoming more and more popular. Backend developers recognize the added value of switching from traditional REST architecture to GraphQL, despite the higher application complexity.

This article will teach Angular developers the basics of implementing CRUD (create, read, update, delete) operations in the Apollo client. The result will be a movie application where you can create, update, or delete movies entities.

Skipping the UI section, we will be covering the following topics:

- Writing [queries & mutations](https://graphql.org/learn/queries/) using the Apollo client library
- Generating TypeScript types from the server-side schema by [graphql-code-generator](https://www.graphql-code-generator.com/)
- Updating Apollo’s [in-memory cache](https://www.apollographql.com/docs/react/v2/caching/cache-configuration/) and common mistakes to watch out for.

## Dependencies

Feel free to clone the application from the [GitHub repository](https://github.com/krivanek06/graphql_example) for a fully functional server. It covers the source code for this example and additional features. After cloning the application, launch the server by running `docker-compose up` at the root of the project. The backend will be available at `http://localhost:3001/graphql`.

If you are interested in how to build the server side of this application, check out the blog post on [How to Create a GraphQL Server with NestJS](https://dev.to/bitovi/creating-a-graphql-server-with-nestjs-3ap0).

Generate a new Angular application, and in the new Angular project, install the following:

```TS
ng add apollo-angular

npm install --save-dev @graphql-codegen/cli
@graphql-codegen/typescript
@graphql-codegen/typescript-apollo-angular
@graphql-codegen/typescript-operations
```

## What is Apollo Client?

Apollo Client is a state management library that enables the management of both local and remote data with GraphQL. Apollo includes [local state management](https://www.apollographql.com/docs/react/local-state/local-state-management), [error handling](https://www.apollographql.com/docs/react/data/error-handling), [optimistic responses](https://www.apollographql.com/docs/react/performance/optimistic-ui/), [testing](https://www.apollographql.com/docs/react/api/react/testing), [extending the server-side schema](https://www.apollographql.com/docs/react/why-apollo/#combining-local--remote-data), and [caching responses](https://www.apollographql.com/docs/react/caching/overview/#:~:text=Apollo%20Client%20stores%20the%20results,even%20sending%20a%20network%20request.&text=The%20Apollo%20Client%20cache%20is%20highly%20configurable.).

Apollo Client handles the HTTP request cycle from start to finish, including tracking, loading, and error states but also caching HTTP requests. Because every query dispatched by Apollo is just a plain string, which is eventually evaluated on the server side, the Apollo client can verify whether a query with a specific set of arguments was already executed or not. If the query has been already executed, then Apollo loads data from its InMemoryCache. If the query hasn’t been executed yet, Apollo sends the whole string to the GraphQL server for evaluation.

|                               Query data from the server                               |                               Query data from the cache                                |
| :------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------: |
| ![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hv5k52lj3wilz9gk67nn.png) | ![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/s493e7smyjfgdf34mk53.png) |

Apollo’s query caching mechanism is beneficial because it prevents users from loading the same data multiple times. On the other hand, caching brings a bit of complexity to our code. For example, if you have a cached list of objects and create a new object, you must manually add that newly created object to the rest of the objects in the cache; otherwise, they will not be grouped together.

We’ll describe an illustration of this problem below when we talk about creating a Movie entity in the Server interaction section.

## Set Up Connection to GraphQL Server

First, set up a connection to your GraphQL server from the Angular application. Apollo client needs to know which endpoint (`http://localhost:3001/graphql`) to target once it starts executing operations against the server, what kind of header information you want to attach to all the requests, and how you want to handle errors. Create a module named `graphql.module.ts` in `src/app/graphql`, or move the existing one if the `ng add apollo-angular` has already created one and add the following configuration.

```TS
// src/app/graphql/graphql.module.ts

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { ApolloModule, APOLLO_NAMED_OPTIONS, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { environment } from 'src/environments/environment';

const errorLink = onError(({ graphQLErrors, networkError, response }) => {
	// React only on graphql errors
	if (graphQLErrors && graphQLErrors.length > 0) {
		if (
			(graphQLErrors[0] as any)?.statusCode >= 400 &&
			(graphQLErrors[0] as any)?.statusCode < 500
		) {
			// handle client side error
			console.error(`[Client side error]: ${graphQLErrors[0].message}`);
		} else {
			// handle server side error
			console.error(`[Server side error]: ${graphQLErrors[0].message}`);
		}
	}
	if (networkError) {
        // handle network error
        console.error(`[Network error]: ${networkError.message}`);
	}
});

const basicContext = setContext((_, { headers }) => {
	return {
		headers: {
			...headers,
			Accept: 'charset=utf-8',
			authorization: `Bearer random token`,
			'Content-Type': 'application/json',
		},
	};
});
export function createDefaultApollo(httpLink: HttpLink): ApolloClientOptions<any> {
	const cache = new InMemoryCache({});

	// create http
	const http = httpLink.create({
		uri: 'http://localhost:3001/graphql',
	});

	return {
		connectToDevTools: !environment.production,
		assumeImmutableResults: true,
		cache,
		link: ApolloLink.from([basicContext, errorLink, http]),
		defaultOptions: {
			watchQuery: {
				errorPolicy: 'all',
			},
		},
	};
}

@NgModule({
	imports: [BrowserModule, HttpClientModule, ApolloModule],
	providers: [
		{
			provide: APOLLO_OPTIONS,
			useFactory: createDefaultApollo,
			deps: [HttpLink],
		},
	],
})
export class GraphQLModule {}
```

To configure the Apollo client, we use the [dependency injection](https://angular.io/guide/dependency-injection) token `APOLLO_OPTIONS`, which is generated before any services are instantiated. Passing a [factory function](<https://en.wikipedia.org/wiki/Factory_(object-oriented_programming)>) to the APOLLO_OPTIONS token describes how to handle the default GraphQL server endpoint. In createDefaultApollo, we return an object with five properties:

- `connectToDevTools` - allows the usage of [Apollo client devtools](https://chrome.google.com/webstore/detail/apollo-client-devtools/jdkknkkbebbapilgoeccciglkfbmbnfm) extension in the local development environment to see Apollo’s cache visually, what data has been already loaded
- `assumeImmutableResults` - not required. However, a useful way to prevent data mutation in the global store. By setting assumeImmutableResults to true, Apollo Client only allows [immutable updates](https://indepth.dev/posts/1381/immutability-importance-in-angular-applications) to the global store in Angular, enabling substantial performance optimizations
- `errorPolicy` in `defaultOptions.watchQuery` - using all is the best way to notify users about server-side errors because if set to all, then all errors are saved in the cache alongside the returned data (read more in [Error handling](https://www.apollographql.com/docs/react/v2/data/error-handling/))
- `link` - is a place where we set up handling HTTP requests sent to or received from the backend in a very similar manner as Angular interceptors work. In our example, we can also add `basicContext`. `basicContext` attaches additional HTTP header information to the dispatched requests and `errorLink`, which is where client or server-side errors are handled. The only exception is http, where we define the endpoint by which we expect to establish the connection
- `cache` - the most important configuration of the Apollo client is its [caching mechanism](https://www.apollographql.com/docs/react/caching/overview/#:~:text=in%20Apollo%20Client-,Overview,even%20sending%20a%20network%20request.). It can be configured how to handle local-only data, how to extend the server-side schema with additional information, how to identify objects, and [much more](https://www.apollographql.com/docs/react/caching/cache-configuration/), but for this example, we leave it empty

After creating apollo.module.ts file, add this module to the imports section of app.module.ts.

> **_NOTE:_** In real life, it may happen that you want to configure the Apollo client to connect to multiple GraphQL API servers. To accomplish that, use another injection token named `APOLLO_NAMED_OPTIONS`, where you define a key-value pair to endpoints you want to interact with, so it may look as follows.

```TS
// src/app/graphql/graphql.module.ts

export function createNamedApollo(httpLink: HttpLink)
: Record<string, ApolloClientOptions<any>> {
	return {
		spaceX: {
			name: 'spaceX',
			link: httpLink.create({ uri: 'https://api.spacex.land/graphql/' }),
			cache: new InMemoryCache(),
		},
	};
}

@NgModule({
	imports: [BrowserModule, HttpClientModule, ApolloModule],
	providers: [
		{
			provide: APOLLO_OPTIONS,
			useFactory: createDefaultApollo,
			deps: [HttpLink],
		},
		{
			provide: APOLLO_NAMED_OPTIONS,
			useFactory: createNamedApollo,
			deps: [HttpLink],
		},
	],
})
```

## Generating Schema from the Backend

One of the significant benefits of a GraphQL server is that it exposes its whole schema. You can choose any available operation, define the shape of data you expect to be returned and use a library such as [graphql-code-generator](https://www.graphql-code-generator.com/) that allows generating TypeScript types from the server schema.

Using the GraphQL code generator, you avoid manual handwriting of Interfaces, so when the server changes its schema, you can just run one line of code, and the code generator will regenerate all TypeScript types.

![Mind blow gif](https://www.bitovi.com/hs-fs/hubfs/apollo-1.gif?width=400&height=400&name=apollo-1.gif)

To generate types, list every query and mutation you intend to use in files like `{{name}}.graphql`. This example demonstrates basic CRUD operations (create, read, update, delete) for movies. Create a file in `graphql/graphql-custom-backend/movie.graphql` and paste the following code.

```graphql
# src/app/graphql/graphql-custom-backend/movie.graphql

fragment MovieInfo on Movie {
  id
  createdAt
  updatedAt
  title
  description
}

query GetAllMovies {
  getAllMovies {
    ...MovieInfo
  }
}

mutation CreateMovie($movieInputCreate: MovieInputCreate!) {
  createMovie(movieInputCreate: $movieInputCreate) {
    ...MovieInfo
  }
}

mutation EditMovie($movieInputEdit: MovieInputEdit!) {
  editMovie(movieInputEdit: $movieInputEdit) {
    ...MovieInfo
  }
}

mutation DeleteMovie($movieId: Int!) {
  deleteMovie(movieId: $movieId)
}
```

To generate TypeScript types, create a file named `codegen.yml` at the root of the application. codegen.yml is a configuration file for [graphql-code-generator](https://www.graphql-code-generator.com/), which describes the endpoints for inspecting the server-side schema, the places where you want to generate TypeScript types, the plugins you intend to use, and [much more](https://www.the-guild.dev/graphql/mesh/docs). In our case, the codegen.yml looks like the following.

```YAML
overwrite: true
generates:
  # where to generate file
  ./src/app/graphql/graphql-custom-backend.service.ts:
    schema:
      # where the server lives
      - http://localhost:3001/graphql
    documents:
      # where are our queries / mutations, etc.
      - src/app/graphql/graphql-custom-backend/*.graphql
    # necessary to properly generate types
    plugins:
      - typescript
      - typescript-operations
      - typescript-apollo-angular
    config:
      # used to disable lint rule: ts(4114) (override)
      addExplicitOverride: true

  # Defined other endpoints with similar logic as above
```

To generate the schema, register an NPM command

```TS
“generate-types”: “graphql-codegen --config codegen.yml”
```

into scripts in package.json. After registering the command and executing `npm run generate-types`, you will have a newly created, or in the future, updated `graphql-custom-backend.service.ts` file.

## Server Interaction

This is where the fun begins. You are going to use the generated GraphQL API calls you defined in `movie.graphql`. Create an Angular service in `core/api/movie-api.service.ts` and inject the generated types and API calls by Apollo-codegen.

```TS
// src/app/core/api/movie-api.service.ts

import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import {
  CreateMovieGQL,
  DeleteMovieGQL,
  EditMovieGQL,
  GetAllMoviesGQL,
} from 'src/app/graphql/graphql-custom-backend.service';

@Injectable({
	providedIn: 'root',
})
export class MovieApiService {
	constructor(
		private getAllMoviesGQL: GetAllMoviesGQL,
		private createMovieGQL: CreateMovieGQL,
		private editMovieGQL: EditMovieGQL,
		private deleteMovieGQL: DeleteMovieGQL,
		private apollo: Apollo
	) {}
	....
}
```

### Read

Before any operation, you must first fetch movies with the following code.

```TS
getAllMovies(): Observable<MovieInfoFragment[]> {
	return this.getAllMoviesGQL.watch().valueChanges.pipe(
		map((res) => res.data.getAllMovies ?? [])
	);
}
```

When executing any query, you can attach `watch()` or `fetch()` method on these API calls (also pass an object as an argument if you need to send some input data to the server).

he most significant difference between watch() and fetch() is that watch() is reactive. If you replace the old list of movies, getAllMovies, in the Apollo cache with the new list, then by attaching watch(), the content replacement will notify all subscribers. However, with fetch(), subscribers will not get the updated value.

Also, be careful from where you import [Observable](url) interface. You may accidentally import it from `@apollo/client`, but you end up with an error in this case. Always import it from `rxjs`.

When working with multiple GraphQL endpoints, you can use any other endpoint defined for the `APOLLO_NAMED_OPTIONS` injection token by the following approach.

```TS
@Injectable({
	providedIn: 'root',
})
export class SpaceXApiService {
	constructor(private apollo: Apollo) {}

	getLaunchesPast(): Observable<ApolloQueryResult<unknown>> {
		return this.apollo.use('spaceX').query({
			query: LaunchesPastDocument,
		});
	}
}
```

Where `LaunchesPastDocument` is a strongly typed generated query by Apollo-codegen that you could have defined, for example, in `spaceX.graphql` to fetch some data from [spaceX endpoint](https://api.spacex.land/graphql/). For the spaceX example, visit the provided [GitHub repository](https://github.com/krivanek06/graphql_example).

### Create

Creating a new movie is a bit more complicated. You do not just have to send the correct data to your backend server, but you also have to save the newly created movie into Apollo’s cache, to group the newly created movie with the already loaded ones.

Send the new movie’s `title` and `description` to the server, wait for the server’s response and save the returned `Movie` object into the `getAllMovies` array. We can better describe everything in the following code

```TS
createMovie({ title, description }: MovieInputCreate):
    Observable<FetchResult<CreateMovieMutation>> {
		return this.createMovieGQL.mutate(
			{
				movieInputCreate: {
					title,
					description,
				},
			},
			{
				optimisticResponse: {
					createMovie: {
						__typename: 'Movie',
						id: -1,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
						title: title,
						description: description,
					},
				},
				update: (store: DataProxy, { data }) => {
					const createdMovie = data?.createMovie as MovieInfoFragment;

					// query movies from cache
					const moviesQuery = store.readQuery<GetAllMoviesQuery>({
						query: GetAllMoviesDocument,
					});

					// movies haven't been loaded yet - no data in cache
					if (!moviesQuery?.getAllMovies) {
						return;
					}

					// update cache
					store.writeQuery<GetAllMoviesQuery>({
						query: GetAllMoviesDocument,
						data: {
							__typename: 'Query',
							getAllMovies: [
								...moviesQuery.getAllMovies, createdMovie
							],
						},
					});
				},
			}
		);
	}
```

I want to highlight the `update` method. The `update` method runs after the mutation has been successfully completed. When executing the `createMovieGQL` mutation, you receive back the object `MovieInfoFragment`, a [fragment](https://www.apollographql.com/docs/react/data/fragments/) of the Movie object that has been created.

However, one thing to remember is even if you have successfully created a `Movie`, it is not yet grouped with the rest of the already loaded `Movie` objects. When you take a look back at the `getAllMovies()` method, you can see that it returns an attribute called `getAllMovies`, which contains a list of all `MovieInfoFragment` objects.

When you create a new Movie, you have to check Apollo’s cache to see if `GetAllMoviesDocument` has already been executed to ensure we have loaded all movies from the server. If not, don’t do anything.

However, if `GetAllMoviesDocument` was already executed, then replace the content of `GetAllMoviesDocument` with all the previously cached movies and the newly created one:
`getAllMovies: [...moviesQuery.getAllMovies, createdMovie]`.

Finally, because we attached the `getAllMoviesGQL.watch()` method, all subscribers will be notified about the added element.

### Apollo Optimistic Response

When executing any mutation, the operation on the server side may take some time to complete. Usually, server-side operations are counted in milliseconds; however, there can be longer operations that take seconds to complete.

When you want to avoid displaying a “loading spinner” on the UI, you can implement the `optimisticResponse` option, where we define the shape of data we expect to be returned by the server.

In the above code example, the update method for `createMovieGQL.mutate` runs twice, first with the mocked data defined in the `optimisticResponse` option and the second time when the server returns the real data: the actual Movie object that has been created.

No need to worry about having the same object in the `getAllMovies` array twice—Apollo is smart enough to replace the old mocked data with the real object once the server finishes its operation and returns the result.

#### Cannot find namespace ‘JSX’

When working with Apollo client in Angular, you might encounter the error `Cannot find namespace‘JSX’`. This happens when you make a wrong import. Because Apollo client can be also used with React, you have to exactly specify the path from which you want to import interfaces in Angular. This error is present by the following import:

```TS
// wrong import
import { DataProxy, FetchResult } from ‘@apollo/client’;.
// correct import
import { DataProxy, FetchResult } from ‘@apollo/client/core’;
```

### Edit

Fortunately editing a Movie is much easier. Send the `Id, title, and description` attributes of the edited Movie object to the server as it is demonstrated in the following code snippet.

```TS
editMovie({id, title, description}: MovieInputEdit):
  Observable<FetchResult<EditMovieMutation>> {
	return this.editMovieGQL.mutate({
		movieInputEdit: {
			id,
			title,
			description
		},
	});
}
```

The reason why you don’t need to update `getAllMovies` array in the editing process is because of Cache Normalization. [Cache Normalization](https://www.apollographql.com/blog/apollo-client/caching/demystifying-cache-normalization/) is when an object has some identification key, such as ID, so instead of creating multiple copies of the same object, Apollo maintains references to the normalized object by its unique identifiers. This reference maintenance results in keeping the size of the cache as small as possible and preventing duplicate data. You can inspect this behavior by using [Apollo Client Devtools](https://chrome.google.com/webstore/detail/apollo-client-devtools/jdkknkkbebbapilgoeccciglkfbmbnfm).

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/134zuq7olxn2q3hst4h7.png)

Keeping only the Movie references in `getAllMovies` array solves the issue of why you don’t need to update getAllMovies array when editing a Movie. You update the Movie entity in one place and every object that keeps the reference will get the updated value.

You also don’t need to implement the `update` option in `editMovieGQL` because of Apollo’s default behavior in how it handles normalized data. When defining the `EditMovie` mutation back in **Generating schema from the backend**, you included that you expect a `MovieInfo` fragment to be returned.

```TS
mutation EditMovie($movieInputEdit: MovieInputEdit!) {
	editMovie(movieInputEdit: $movieInputEdit) {
		...MovieInfo
	}
}
```

It means once the `editMovieGQL` mutation successfully executes, you indeed receive an updated version of a Movie object back on the frontend. However, because Apollo has already cached an old version of that edited Movie object with the same `ID` in its `InMemoryCache`, after the successful operation execution, Apollo just replaces the old Movie object with the newly received one in `InMemoryCache`.

### Delete

Normalizing data greatly helps us to be consistent. An object can be edited in one place and for every other object, a list of objects or observers that keep a reference to the original one will get an updated value.

Data normalization is also beneficial when it comes to removing an object from the cache. Apollo provides methods for [Garbage collection and cache eviction](https://www.apollographql.com/docs/react/caching/garbage-collection/#cacheevict) such as `evict` that completely removes an object from the cache. So deleting a movie can be done in the following case.

```TS
deleteMovie(movieId: number): Observable<FetchResult<DeleteMovieMutation>> {
	return this.deleteMovieGQL.mutate(
		{
			movieId,
		},
		{
			update: (store: DataProxy, { data }) => {
				this.apollo.client.cache.evict({id: `Movie:${data?.deleteMovie}` });
			},
		}
	);
}
```

## Summary

This article served as the first part of working with Apollo client in Angular. Executing each implemented method in MovieApiService, you can see the result in [Apollo Client Devtools](https://chrome.google.com/webstore/detail/apollo-client-devtools/jdkknkkbebbapilgoeccciglkfbmbnfm). You went through how to generate TypeScript types from the server-side schema, how to configure the Apollo module, how to work with mutations, and how to add an object to an already loaded list of objects. Apollo client is a massive library with lots of options, and for this reason, we will come back to it in the future to try out most of its available features. Until then check the [GitHub repository](https://github.com/krivanek06/graphql_example) of this example.

Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
