---
title: 'Angular & Apollo Client: Apollo Cache Configuration'
seoTitle: 'Angular & Apollo Client: Apollo Cache Configuration'
seoDescription: 'Apollo-client might be a go-to library for connecting a frontend application to a GraphQL server;...'
slug: 6_angular-apollo-client-apollo-cache-configuration
tags: angular, graphql
order: 6
datePublished: 02.01.2023
readTime: 8
coverImage: 6_angular-apollo-client-apollo-cache-configuration.png
---

[Apollo-client](https://www.apollographql.com/docs/react/) might be a go-to library for connecting a frontend application to a GraphQL server; however, it was initially built as a comprehensive state management library. The Apollo client’s cache allows persisting local data both with reactive variables and client cache queries and can extend server-side objects with local properties.

By the end of this post, you will have a solid understanding of how Apollo client cache works, but if you are unfamiliar with Apollo, check out [Angular & Apollo Client: Getting Started with GraphQL in Angular](https://www.bitovi.com/blog/angular-and-apollo-client-get-started-with-graphql-in-angluar) or [go through the source code on GitHub](https://github.com/krivanek06/graphql_example).

## Extending GraphQL Schema with Local Data

To store client-side information in objects received from a GraphQL server, you can use a [local-only field](https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies).

Let’s have an example for extending a server-side Movie object, which has fields like Id, title, etc., with an additional isSelected property, allowing selecting any movie to perform some logical operation on the chosen entities.

```graphql
# Original Movie type provided by the server

type Movie {
  id: Int!
  createdAt: String!
  updatedAt: String!
  title: String!
  description: String
  movieComment: [MovieComment!]!
}
```

### Generating Types

Create a `{{name}}.graphql` file where you tell [graphql-code-generator](https://www.graphql-code-generator.com/) how you want to extend the server-side schema. Include your file location into the codegen.yml file under the schema section which instructs graphql-code-generator to inspect locally-defined GraphQL types and merge them with the server-side schema.

In this example, you create a local.schema.graphql file in which you extend a Movie type with an isSelected: MovieSelectType! field. The isSelected field will be a local attribute for the Movie object that doesn’t initially exist when you first fetch a list of Movie objects from the server side.

Despite that, you mark the isSelected field as required using the exclamation mark (!), and you will configure the Apollo client to always return some value for it. You include the local.schema.graphql file location under the schema property in codegen.yml.

```graphql
# src/graphql/graphql-local-schema/local.schema.graphql

enum MovieSelectType {
  SELECTED
  UNSELECTED
}

extend type Movie {
  isSelected: MovieSelectType!
}
```

```yaml
# codegen.yml

generates:
  # where to generate file
  ./src/app/graphql/graphql-custom-backend.service.ts:
    schema:
      # where the server lives
      - http://localhost:3001/graphql
      # where is our local schema
      - src/app/graphql/graphql-local-schema/*.graphql
    ...
```

Running the script `npm run generate-types` ("generate-types": "graphql-codegen --config codegen.yml") will generate an additional isSelected field on the Movie type.

Simply querying the isSelected field would throw an error Cannot query field "isSelected" on type "Movie", because the Apollo client expects isSelected to be provided by the server.

You must add the `@client` decorator, which tells Apollo-client to skip server-side validation.

```graphql
fragment MovieInfo on Movie {
  id
  ...isSelected @client
}
```

### Reading Local Only Fields

Though you no longer get an error after registering `isSelected` as a local-only field, inspecting the server-side Movie objects by [Apollo Client Devtools](https://chrome.google.com/webstore/detail/apollo-client-devtools/jdkknkkbebbapilgoeccciglkfbmbnfm), you see that they do not contain the `isSelected` property.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ljietmaa9f1vjqmpvm4d.png)

If you had called Movie.isSelected you would get undefined. To customize how a particular field is read, you use the [field policy](https://www.apollographql.com/docs/react/caching/cache-field-behavior/) field in Apollo’s InMemoryCache.

The right place to define a return value for local-only fields is to implement a [read(...) function](https://www.apollographql.com/docs/react/caching/cache-field-behavior/#the-read-function), that the Apollo client always executes by default when you call a specific GraphQL object property. The read(...) function in its argument provides the actual object’s property value and it must return the same data type as the property.

In this example, the `selectType` for `read(selectType?: MovieSelectType)` at its initial state is `undefined`, since the server doesn’t resolve any data for that field, so you return a default `MovieSelectType.Unselected` value. However, if you later set the `selectType` property for a Movie object, you return the current value.

```TS
const cache = new InMemoryCache({
	typePolicies: {
		Movie: {
			fields: {
				title: {
					read(title: string) {
						return title.toUpperCase();
					},
				},
				isSelected: {
					read(selectType?: MovieSelectType) {
						return selectType ?? MovieSelectType.Unselected;
					},
				},
			},
		},
	},
});
```

## Client-Side Schema

Another common use case for cache manipulation is storing local, client-side data in the Apollo client cache as a single source of truth. Use cases might include:

- Storing system configuration
- Storing edited form state
- Storing filtered table state

A practical use for Angular developers is to persist local data in Apollo’s cache using one of two approaches:

- Directly [write and read](https://www.apollographql.com/docs/react/caching/cache-interaction) from the cache
- Use [reactive variables](https://www.apollographql.com/docs/react/local-state/reactive-variables)

Let’s take a look at both of these methods

### Extending Type Query

You first need to provide a [client-side schema](https://www.apollographql.com/docs/react/local-state/client-side-schema), meaning you register queries, which will be used only on the client side of the application. Registering additional queries can be achieved by extending the global Query type in GraphQL.

You create two queries in local.schema.graphql since you have already configured graphql-code-generator to generate TypesScript types from this file. Query getAllLocalMovies will return Movie objects from the Apollo cache, while getAllLocalMoviesReactiveVars will use reactive variables.

```graphql
# src/graphql/graphql-local-schema/local.schema.graphql

extend type Query {
  # for Apollo cache query
  getAllLocalMovies: [Movie!]!
  # for reactive variables
  getAllLocalMoviesReactiveVars: [Movie!]!
}
```

To use these queries, you have to attach the @client decorator, telling Apollo-client to resolve them on the client side and prevent executing them against the server.

```graphql
# src/graphql/graphql-custom-backend/movie-local.graphql

query GetAllLocalMovies {
  getAllLocalMovies @client {
    ...MovieInfo
  }
}

query GetAllLocalMoviesReactiveVars {
  getAllLocalMoviesReactiveVars @client {
    ...MovieInfo
  }
}
```

Finally, regenerate the TypeScript schema by `npm run generate-types`, which will create executable `GetAllLocalMoviesReactiveVarsGQL` and `GetAllLocalMoviesGQL` API calls.

### Client Queries

To update local application data using client queries, you must implement the following steps:

1. Inject private apollo: Apollo to the service or component for Apollo client cache reference

2. Create a data type you want to save into the cache

3. Update query data by the writeQuery methods. Example: calling `this.apollo.client.cache.writeQuery({...})`, which can be seen in MovieLocalService in the code snippet below, line 22, with the following arguments:

a.) query - TypeScript constant that wraps the whole client-side query we want to update. By using graphql-code-generator, you define GraphQL queries in `{{name}}.graphql` file and generate constants by the registered npm script npm run generate-types. For example:

```TS
export const GetAllLocalMoviesDocument = gql`
	query GetAllLocalMovies {
		getAllLocalMovies @client {
			...MovieInfo
		}
	}
	${MovieInfoFragmentDoc}
`;
```

b.) data - An object where you set the properties to what \_\_typename you want to change. In most cases, you are updating a Query type, and the second attribute is the name of the query, defined in `{{name}}.graphql`, that returns data you want to overwrite. For example:

```TS
data: {
	__typename: 'Query',
	getAllLocalMovies: movie,
},
```

c.) id - Object’s identification key when you update only one specific object, optional parameter

4.) Implementing merge and read functions in the InMemoryCache.Query, if you intend to add additional logic for updating or reading client queries

Let’s take a look at the following code snippet on how you would create and store local Movie entities in the local getAllLocalMovies query.

```TS
export class MovieLocalService {
	constructor(
		..
		private apollo: Apollo
	) {}
	....

	onMovieAddToApolloCache({title, description}: MovieInputCreate): void {
      const rightNow = new Date();
      // create object
		const movie: MovieInfoFragment = {
			__typename: 'Movie',
			id: rightNow.getTime(), // fake ID
			title,
			description,
			createdAt: rightNow.toISOString(),
			updatedAt: rightNow.toISOString(),
			isSelected: MovieSelectType.Unselected, // local only field
		};

      // update cache
      this.apollo.client.cache.writeQuery({
			query: GetAllLocalMoviesDocument,
			data: {
				__typename: 'Query',
				getAllLocalMovies: movie,
			},
		});
	}
}
```

GetAllLocalMoviesDocument is a generated constant variable by graphql-code-generator from GetAllLocalMovies query defined in movie-local.graphql file. In the method onMovieAddToApolloCache(...) you create a new Movie object and save it into getAllLocalMovies array.

However, by saving a new Movie into getAllLocalMovies array, it is possible to overwrite its already existing list of values with just a single object. To avoid losing the stored list of Movie values, implement merge and read functions in InMemoryCache, Query type.

```TS
const cache = new InMemoryCache({
	typePolicies: {
		Movie: {
			...
		},
		Query: {
			fields: {
				getAllLocalMovies: {
					read(data?: MovieInfoFragment[]) {
						return data ?? [];
					},
					merge(
						existing: MovieInfoFragment[] = [],
						incoming: MovieInfoFragment | MovieInfoFragment[]
					) {
						// if array is passed, rewrite already saved movies
						if (Array.isArray(incoming)) {
							return [...incoming];
						}
						return [incoming, ...existing];
					},
				},
			},
		},
	},
});
```

As mentioned previously read(...) function is executed when getAllLocalMovies query is called. The initial read(...) execution would return undefined because no data had yet been saved into the cache, so instead, we return an empty array.

Function merge(...) is executed when you write something into getAllLocalMovies array in Apollo cache, like in the previous code snippet by getAllLocalMovies: movie, where you instruct Apollo cache to store the newly created movie object alongside the already stored ones.

Working with client queries can be tedious. You have to update Apollo cache by writeQuery, using the right query document and in its data change the correct field, and also implement merge(...) and read(...) functions. On the other hand, its major benefit is the ability to inspect the local state by Apollo Client Devtools and the option of adopting libraries such as [Apollo-cache-persist](https://www.npmjs.com/package/apollo-cache-persist) to persist the cache state in client-side storage on application reload.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3wivrlskz32hwqlhtsui.png)

### Reactive variables

When you don’t care about storing the application’s local state in the Apollo cache, you can adopt the [reactive variables](https://www.apollographql.com/docs/react/local-state/reactive-variables/) approach. Create a reactive variable with the `makeVar<T>()` function.

```TS
export const localMoviesReactiveVars = makeVar<MovieInfoFragment[]>([]);
```

You have already generated a getAllLocalMoviesReactiveVars query from movie-local.graphql, so you also have to tell Apollo’s InMemoryCache how to perform the read() operation on this query.

```TS
const cache = new InMemoryCache({
		typePolicies: {
			Movie: {
				...
			},
			Query: {
				queryType: true,
				fields: {
					getAllLocalMoviesReactiveVars: {
						read() {
							return localMoviesReactiveVars();
						},
					},
					getAllLocalMovies: {
						...
					},
				},
			},
		},
	});
```

Use getAllLocalMoviesReactiveVars generated query in MovieLocalService, to return data from localMoviesReactiveVars() reactive variable or push data into it.

```TS
export class MovieLocalService {
	constructor(
		private getAllLocalMoviesReactiveVarsGQL: GetAllLocalMoviesReactiveVarsGQL,
		...
	) {}

    // get current state of reactive variable
	get allLocalMoviesReactiveVars(): MovieInfoFragment[] {
		return localMoviesReactiveVars();
	}

	// subscribe on state change
	getAllLocalMoviesReactiveVars(): Observable<MovieInfoFragment[]> {
		return this.getAllLocalMoviesReactiveVarsGQL.watch()
		.valueChanges.pipe(
			map((res) => res.data.getAllLocalMoviesReactiveVars)
		);
	}

    // add new Movie to reactive variables
	onMovieAddToReactiveVariables({title, description}: MovieInputCreate): void {
        const rightNow = new Date();
		const movie: MovieInfoFragment = {
			__typename: 'Movie',
			id: rightNow.getTime(), // fake ID
			title,
			description,
			createdAt: rightNow.toISOString(),
			updatedAt: rightNow.toISOString(),
			isSelected: MovieSelectType.Unselected,
		};

		// save movie to reactive variables
		localMoviesReactiveVars([movie, ...localMoviesReactiveVars()]);
	}

	....
}
```

As an Angular developer, you may be asking, what is the difference between reactive variables provided by Apollo client compared to [RxJs BehaviorSubject](https://www.learnrxjs.io/learn-rxjs/subjects/behaviorsubject)? Honestly, not much. Using reactive variables, you lose the option to inspect your local state in the Apollo cache with Apollo client devtools, compared to client-side queries. In the end, reactive variables and BehaviorSubjects behave the same way, and you lose debugging opportunities.

## Summary

Apollo client can be a valuable tool to cache client-side data without bringing additional external libraries into the picture. In this example, you learned how to extend the server-side schema with a local-only field and two ways to store local data with the help of the Apollo client library.

Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
