Are you still building your web application as an SPA? What is this, 2020? Nowadays, everybody is doing SSR.
We have great tutorials for Next.js & Nuxt.js; however, we lack a bit of information about SSR in the Angular ecosystem.

I believe you are familiar with [Benefits of SSR](https://solutionshub.epam.com/blog/post/what-is-server-side-rendering) and you've check the [Angular Universal Guide](https://angular.io/guide/universal). You followed some tutorials and maybe even check out [Brandon Robert’s Angular v16 SSR example](https://github.com/brandonroberts/angular-v16-universal-standalone/tree/main). However, as we know, nothing ever goes as planned, so an error that you may encounter with SSR is `Cannot read properties of undefined (reading 'Core/Chart/Chart.js')` .

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/cimy18rt96ytmkcq6v8j.png)

## Why Is The Error Happening?

You are rendering charts in your application, however the main issue is that you are running SSR with NodeJS. Rendering charts requires accessing the DOM object. Most likely you use libraries for that, such as charts.js, highcharts, ect., but the main issue is that there is no DOM object on the server side.

Accessing `window` or `document` objects on the server side will result to an error, as they don’t exist and the received values will be `undefined`. There are multiple solutions to prevent rendering charts on the server side, but the one quick fix that work for me was a [StackOverflow solution](https://stackoverflow.com/questions/64278463/how-do-i-run-chart-js-with-angular-10-ssr-universal), where a suggestion was to mock the DOM object with the [domino library](https://www.npmjs.com/package/domino).

## Mock The DOM

For this example I am using standalone components and the implementation goes as follows. Install the [domino package](https://www.npmjs.com/package/domino) by `npm i --save-dev domino` or `yarn add -D domino` and then add the following code to your `main.server.ts`:

```tsx
import { bootstrapApplication } from '@angular/platform-browser';
import * as fs from 'fs';
import * as path from 'path';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config);

// --------------------------------------
/**
 * Section used to mock window object on server side,
 * as it is not available
 *
 * preventing the error:
 * - Cannot read properties of undefined
 *  (reading 'Core/Chart/Chart.js')
 */
const domino = require('domino');

const template = fs.readFileSync(path.join('dist/apps/<appName>/browser', 'index.html')).toString();

const window = domino.createWindow(template);
(global as any).window = window;
(global as any).document = window.document;

// --------------------------------------

export default bootstrap;
```

Of course in `readFileSync` replace the location for your build, but with this small change the DOM element will be mock on the server and the command `npm run <appName>:serve-ssr` will work.
