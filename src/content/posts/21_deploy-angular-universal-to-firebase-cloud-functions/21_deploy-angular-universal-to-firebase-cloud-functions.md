You’ve finally finished your first, releasable version of your Angular Universal application and you are ready to deploy it! So where to deploy? Honestly, there are many options. DigitalOcean, Heroku, Vercel, etc. But, in this article, we will take a look at deploying Angular Universal into Firebase Functions.

## Disclaimer

The reason for writing this article is to update already existing resources, such as [Angular Universal with Firebase from Fireship](https://www.youtube.com/watch?v=wij2-gyG12E&t=583s&ab_channel=Fireship) or [Server Side Rendering with Angular from Codeible](https://www.youtube.com/watch?v=k7pLxaKkHYs&t=531s&ab_channel=Codeible), and provide an updated step-by-step guide.

## Introduction

In this example, I am using [NX monorepo](https://nx.dev/). I have my Angular Universal as one application and cloud functions as another application. If you don’t use NX or even some time has passed since publishing this blog post, you may want to visit [Integrate web frameworks with Hosting from Firebase](https://firebase.google.com/docs/hosting/frameworks/frameworks-overview), however, there is an existing issue on [Unable to detect the web framework in use when using angular app within nx monorepo](https://github.com/firebase/firebase-tools/issues/6049).

Also in my project, I don't use any server-side DOM mocking library, such as [domino](https://www.npmjs.com/package/domino) to solve [Angular SSR problems](https://dev.to/krivanek06/angular-ssr-cannot-read-properties-of-undefined-reading-corechartchartjs-3j05), rather I decided to restrict some [components to be rendered only on the client side](https://stackoverflow.com/questions/71475433/client-side-render-some-components-when-using-angular-universal) such as charts.

### 1. Check File Replacement in `project.json`

This is an optional step, but in my case, in `project.json` I haven’t had a production file replacement to change `environment.ts` into `environment.prod.ts` so this can also happen to you. You want to add the following lines to the `server` and `build` sections.

```tsx
"configurations": {
   "production": {
     "fileReplacements": [
        {
         "replace": "apps/<app-name>/src/environments/environment.ts",
          "with": "apps/<app-name>/src/environments/environment.prod.ts"
         }
      ],
      "outputHashing": "media"
    },
  }
```

### 2. Update **`server.ts`**

We need to update the `server.ts` file (or `ssr.server.ts`), especially two parts. First, you don’t want to execute the `run()` function, so that your application will listen on a specific port. Port listening and application execution will be taken care of by cloud functions. Second, you want to update where your `distFolder` is located.

```tsx
// used because of firebase functions
// url: https://fireship.io/lessons/angular-universal-firebase/
(global as any).WebSocket = require('ws');
(global as any).XMLHttpRequest = require('xhr2');

// imports

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  // .....

  const websiteFileLocation = environment.production ? 'browser' : 'dist/apps/<app-name>/browser';
  const distFolder = join(process.cwd(), websiteFileLocation);
  // ^^ step 2.

  // ....

  return server;
}

// commented out because of firebase functions
function run(): void {
  const port = process.env['PORT'] || 4200;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// .....

if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  // in production, the server is run via firebase functions
  if (!environment.production) {
    run();
  }
  // ^^ step 1.
}

export * from './main.server';
```

In the above snippet, when we run the production build, we change the location of the `browser` file in the variable `websiteFileLocation`. The reason is once we build our Universal application (my-app) we create a script that will copy the `browser` and `server` folders into the cloud-functions folder which is eventually deployed.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h2w13zzydzqbln86bwc4.png)

### 3. Build the Angular Application

You may want to consider registering a new `script` into your `package.json` to build your Angular Universal application, which is the following:

```tsx
"mm:build:ssr": "nx build <app-name> --configuration=production && nx build <app-name>:server --configuration=production",
```

### 4. Copy Angular Build into Cloud Functions

In the root directory, create a `cp-angular.js` file and add the following content:

```tsx
const fs = require('fs-extra');

// Copy Angular build to functions folder
(async () => {
  const src = './dist/apps/<app-name>';
  const copy = './dist/apps/<cloud-functions>';

  await fs.copy(src, copy);

  console.log('Angular build copied to functions folder');
})();
```

You may want to also install `fs-extra`. What you have is a script that will copy the built Angular Universal application folders (`browser` and `server`) into the folder where your deployable cloud functions are located so that in the end the Angular Universal will be able to be served via cloud functions. To execute the script, run `node cp-angular`.

### 5. Server Angular Universal By Firebase Function

Now in the root `index.ts`, create a new HTTP firebase function, that will execute the Angular server-side code, the `main.js`, and return the page content.

```tsx
// function for SSR
const universal = require(`${process.cwd()}/server/main`).app();
export const ssr = onRequest(universal);
```

Then by building the cloud functions (`nx build <cloud-functions>`) and running the firebase emulator `firebase emulators:start --only functions`, you should have an `ssr` http endpoint that will serve the SSR application.

### 6. Update Firebase Hosting

In `firebase.json` you want to update the `hosting` section, rewriting all HTTP requests to first target the `ssr` cloud function, which serves the SSR, and then client-side hydration will take care of the user interaction.

```tsx
"hosting": [
    {
      "public": "./dist/apps/<app-name>/browser",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "function": "ssr"
        }
      ]
    }
  ],
```

The `rewrites` section means that every time you try to access a specific page (like `/dashboard`) for the first time, your request will be redirected to cloud functions, to the `ssr` function, where Angular Universal will take care of the first page rendering.

### 7. Verify SSR Rendering Before Deployment

To verify if firebase functions serve the Angular Universal correctly via the `ssr` endpoint, you want to build your cloud functions and run the `cp-angular.js` file. Register a new `script` into `package.json`.

```tsx
"mm:cloud-function:build": "nx build <cloud-functions> --prod && node cp-angular",
```

Then run the firebase emulator via `firebase emulators:start --only functions`, and now by clicking on the `ssr` endpoint your application should be served. There is one small problem tho.

When you access any page in your app like `/dashboard`, the page will be served by SSR, however, the client-side routing will not work. Angular Universal can serve only a specific page and then the client-side hydration has to take care of the rest to behave like an SPA. We only emulate Firebase functions, not hosting, so client hydration failing is fine. However, when we deploy Firebase functions, we also need to host our client somewhere, such as on Firebase hosting.

### 8. Deploy Firebase Functions and Hosting

Once you go through the above configuration, deploying your SSR application via firebase functions is as simple as running `firebase deploy --only hosting:<app-name>,functions` command.

## Limitations of Cloud Functions

The benefit of using cloud functions is that if you have no interaction with your web app, your cloud functions go into a “hibernation” state. They consume almost zero resources and you don’t pay for no usage. However, once you want to start using them, you will experience a [cold start](https://cloud.google.com/functions/docs/concepts/execution-environment#cold_starts) until everything is initialized for the first time.

The cold start depends on how many dependencies you have on your first initialization. Things start to get worse if one of your dependencies is Firestore. There is a closed, but not resolved issue about [Unacceptable cold start get() performance](https://github.com/googleapis/google-cloud-node/issues/2942).

The problem is that it takes a few seconds to initialize Firestore which adds extra seconds to the cold start. To see cold start in action, I measured my Angular Universal website, deployed Firebase functions, and access performance.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7g479sgjruyyt30pz275.jpg)

In the above image, you can clearly see that when the cloud function, which servers the SSR app, experiences a cold start, it takes around 13 seconds to respond and then it is around 2 seconds per request.

There are some options for how to decrease cold start, such as configuring [minimal instances of a function](https://cloud.google.com/functions/docs/configuring/min-instances). By this you will always have some warm instances of the function that serves the SSR part, however, nothing comes without a cost. Configuring only 3 minimal instances will amount to ~30$ per month.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wfk4vlb7td6f6ah49caz.png)

Other options to fix cold start may be introducing service works to cache some javascript on the client side, removing the Firestore dependency or creating a scheduler that will periodically ping some cloud functions to make them constantly warm, which eventually is a cheaper option than configuring minimal instances.

There is also some exploration of deploying [Angular Universal into Cloud Run service](https://ngserve.io/dev-log-deploying-an-angular-universal-app-to-cloud-run/), however when I personally tried to dockerize the same app and deploy it into cloud run, by experience cold start, it amounted to the same ~13second first response so I stuck with firebase functions.

## Summary

We look into how to deploy an Angular Universal application inside NX monorepo via firebase functions. This article serves as an updated version from Firebase and Codeible as those tutorials are a few years old.

Now if everything is set up correctly you should be able to deploy your Angular Universal application into firebase functions by running the following scripts:

```YAML
yarn mm:build:ssr
yarn mm:cloud-function:build
firebase deploy --only hosting:market-monitor-prod,functions

// equivalent to
nx build <app-name> --configuration=production && nx build <app-name>:server --configuration=production
nx build <app-name>-cloud-functions --prod && node cp-angular
firebase deploy --only hosting:market-monitor-prod,functions
```

I hope this post was useful to accomplish your goal of deployment. If you have any question, feel free to ask them below or connect with me on:

Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
