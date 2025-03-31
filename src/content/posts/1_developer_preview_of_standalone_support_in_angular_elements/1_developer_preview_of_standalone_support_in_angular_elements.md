---
title: 'Developer Preview of Standalone Support in Angular Elements'
seoTitle: 'Developer Preview of Standalone Support in Angular Elements'
seoDescription: 'Have you seen it already? Angular version 14.2 is here with new features and improvements! One of the...'
slug: 1_developer_preview_of_standalone_support_in_angular_elements
tags: javascript, angular, rxjs
order: 1
datePublished: 06.09.2022
readTime: 5
coverImage: 1_developer_preview_of_standalone_support_in_angular_elements.png
---

Have you seen it already? Angular version [14.2 ](https://github.com/angular/angular/releases/tag/14.2.0)is here with new features and improvements! One of the merged PRs includes [creating custom elements without NgModule](https://github.com/angular/angular/pull/46475). In this post, we will take a look at how to create Angular elements in Angular v14.2.

The source code for the examples in this post is available on [GitHub here](https://github.com/krivanek06/example_projects/tree/main/angular-elements).

## What Are Angular Elements?

[Angular Elements](https://angular.io/guide/elements) allow Angular Components to be consumed outside of the Angular ecosystem. Angular Elements are shipped in a single JavaScript file and behave just as regular HTML elements. They instantiate automatically when they are added to the DOM and destroy themselves when they are removed. The developer doesn’t need any prior knowledge of the Angular framework to use them.

## Creating Angular Elements (The Old Way)

Let’s say you have created a custom component `VotingOldComponent` which you want to include in your non-Angular application. For the purpose of this blog post, it is not important what the component itself does, however, the following code is an example of how you would have created Angular elements before Angular v14.2.

```typescript
// app.module.ts

import { DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { VotingOldComponent } from './voting-old/voting-old.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VotingOldModule } from './voting-old/voting-old.module';

@NgModule({
  declarations: [],
  imports: [BrowserModule, BrowserAnimationsModule, VotingOldModule],
  providers: [],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {}

  ngDoBootstrap(): void {
    const votingOld = createCustomElement(VotingOldComponent, { injector: this.injector });
    customElements.define('voting-old', votingOld);
  }
}
```

```typescript
// main.ts

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

After running the commands `ng build `and `cat ./dist/angular-elements/runtime*.js ./dist/angular-elements/polyfills*.js  ./dist/angular-elements/main*.js > ./custom-voting-element.js` you would end up with a `custom-voting-element.js` file, which if you include in the `script` tag to one of your other web applications, we can use a custom HTML tag `voting-old `and it will render a component.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>AngularElements</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script defer src="./custom-voting-element.js"></script>
  </head>
  <body>
    <voting-old></voting-old>
  </body>
</html>
```

## Creating Angular Elements in Version 14.2

However, since the introduction of [standalone components ](https://angular.io/guide/standalone-components)in version 14.0, Angular developers are able to slowly move away from modules. Let’s say you have created a standalone component [VotingNewComponent](https://github.com/krivanek06/example_projects/tree/main/angular-elements/src/app/voting-new).

```typescript
// voting-new.component.ts

@Component({
	selector: 'app-voting-new',
	templateUrl: './voting-new.component.html',
	styleUrls: ['./voting-new.component.scss'],
	standalone: true,
	imports: [CommonModule, ...]
	encapsulation: ViewEncapsulation.ShadowDom,
})
export class VotingNewComponent implements OnInit {
    ...
}
```

All you need to do to create an Angular element from the `VotingNewComponent` standalone component is to modify the main.ts file to include an application instance by `createApplication()` function, create one or multiple Angular elements by `createCustomElement()`, and define [autonomous custom elements](https://angular.io/guide/elements#transforming-components-to-custom-elements) by `customElements()` function with unique keys.

```typescript
// main.ts

// get a hand on the `ApplicationRef` to access its injector
createApplication({ providers: [] }).then(appRef => {
  // create a constructor of a custom element
  const votingNew = createCustomElement(
    // component for Angular element
    VotingNewComponent,
    // used to inject the component to the DOM
    { injector: appRef.injector }
  );

  // register in a browser
  customElements.define('voting-new', votingNew);
});
```

**Important Note:** `createApplication` is on [Developer Preview](https://angular.io/guide/releases#developer-preview). Features on Developer Preview might change APIs without notice. If you decide to use `createApplication` on production, be aware when updating your application.

Without bootstrapping any components, the [createApplication](https://angular.io/api/platform-browser/createApplication) method produces an instance of the application. Its strength resides in its ability to delay or decouple the rendering of components with various injector trees. Changing the `main.ts` file, generating a `custom-voting-element.js`, and including this script to whatever web application, you can use your custom `voting-new` element in the following way:

```HTML
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>AngularElements</title>
		<base href="/" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<script defer src="./custom-voting-element.js"></script>
	</head>
	<body>
		<voting-new></voting-new>
	</body>
</html>
```

### How to Create an Angular Element from a Standalone Component in Angular v14.2

In summary, here’s how to create an Angular element from a Standalone Component in Angular v14.2:

1. Include all standalone components in the application’s `main.ts` entry point to instantiate them after `createApplication()` is resolved
2. Build all Angular elements by running `ng build`
3. Concat generated files into one by running the script `cat ./dist/angular-elements/runtime*.js ./dist/angular-elements/polyfills*.js  ./dist/angular-elements/main*.js > ./custom-voting-element.js`
4. Include the script `custom-voting-element.js` in any other web application to use Angular standalone elements as standard HTML tags

## Mistakes to Watch Out For

When creating standalone Angular elements, you might think to follow the old approach (before version 14.2) to implement `DoBootstrap` interface in `app.component.ts` and include `AppComponent` in `bootstrapApplication` in `main.ts` as the [official documentation](https://angular.io/guide/standalone-components) dictates. If you did that in this example, you could end up with the following:

```typescript
// app.component.ts

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, VotingNewComponent],
})
export class AppComponent implements DoBootstrap {
  // PR: https://github.com/angular/angular/pull/46475
  async ngDoBootstrap(): Promise<void> {
    // get a hand on the `ApplicationRef` to access its injector
    const applicationRef = await createApplication();

    // create a constructor of a custom element
    const votingNew = createCustomElement(VotingNewComponent, { injector: applicationRef.injector });

    // register in a browser
    customElements.define('voting-new', votingNew);
  }
}
```

```typescript
// main.ts
bootstrapApplication(AppComponent, {
  providers: [],
}).catch(err => console.error(err));
```

However, this approach would lead to an error

```
The selector "app-root" did not match any element.
```

By using `bootstrapApplication(AppComponent)` Angular tries to initialize and load our compiled application in whatever framework we are including our built script. This will result in an error because, in this context where `VotingNewComponent` is an Angular element, `AppComponent` doesn't exist.

## Conclusion

Angular 14.2 has introduced some amazing new features and improvements, including the ability to create Angular elements from standalone components. Check out the other posts in this series for more information and Angular v14.2 tutorials.

Need help upgrading your Angular project to the latest version to take advantage of awesome new features? Contact us for [Angular Consulting](https://www.bitovi.com/frontend-javascript-consulting/angular-consulting) or check out our [Bitovi Academy](https://www.bitovi.com/academy/).

Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
