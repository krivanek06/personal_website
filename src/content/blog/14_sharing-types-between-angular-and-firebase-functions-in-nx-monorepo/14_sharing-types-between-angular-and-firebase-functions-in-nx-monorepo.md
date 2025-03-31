---
title: 'Setup Angular, Firebase Functions and Shared TS types in NX Monorepo'
seoTitle: 'Setup Angular, Firebase Functions and Shared TS types in NX Monorepo'
seoDescription: 'Recently I started to work on a new project and after a considerable amount of time spent choosing...'
slug: 14_sharing-types-between-angular-and-firebase-functions-in-nx-monorepo
tags: nx, angular, firebase, monorepo
order: 14
datePublished: 14.06.2023
readTime: 5
coverImage: 14_sharing-types-between-angular-and-firebase-functions-in-nx-monorepo.png
---

Recently I started to work on a new project and after a considerable amount of time spent choosing the tech stack, I decided to go with Angular, Firebase Cloud Functions, and NX Monorepo.

I want to share how I integrated Firebase Cloud Functions into an NX Monorepo and shared TS types between them because It took me a while to figure it out, so I hope it may help somebody.

## Setup Project in Firebase

I won’t go into detail about how to set up a project in Firebase, it is a straightforward process that you can google, however, what I will include is that you will want to export your **private key** from Firebase to access your database

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/b5443pzcuqoo3yo4o66v.png)

## Add Firebase to an NX project

If you don’t have an NX project, follow [its documentation on how to create one](https://nx.dev/packages/angular/generators/application), however just by running `nx g @nx/angular:application test-app` it will create a Monorepo for you.

Once an NX app is generated you want to install the following package:

`npm install -g firebase-tools`

Which is a tool that can be used to test, manage, and deploy your Firebase project from the command line - [link to NPM](https://www.npmjs.com/package/firebase-tools/v/10.9.2).

### Install Angular/Fire

To enable the interaction between our Angular application and Firebase, you want to install [@angular/fire](https://www.npmjs.com/package/@angular/fire). Using NX, you have to specify which application you want to target to communicate with Firebase, so the end command will be similar to:

```JS
nx g @angular/fire:ng-add --project=test-app
```

### Angular/Fire Problem with Standalone Project

If you are using standalone components in Angular, you most likely don’t have a `app.module.ts` file. In this case, the above command will fail with the message:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/j0oka4n68lxhs4zmfolr.png)

My workout was to create an empty `app.module.ts` file as follows:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/o459kyjl0bgefl71d5h2.png)

Once this is done and you run the `@angular/fire` command again, it will output a successful initialization message:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lvb27dksnz5yjtywt5ih.png)

Then you can copy the generated providers from `app.module.ts` into `apps/test-app/src/app/app.config.ts` as follows:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/17uc1250uenc5abe7bkt.png)

## Adding Firebase Cloud Functions

This is a section where things started to get a bit complicated. There is no clear guideline from NX or Firebase on how to integrate cloud functions together. However, I was able to [nx-firebase](https://github.com/simondotm/nx-firebase) repo on Github, and by following its docs the integration is not that complicated so let’s take a look.

Head over to [quick-start](https://github.com/simondotm/nx-firebase/blob/main/docs/quick-start.md) and install the package `npm install @simondotm/nx-firebase`.

Then run the following command to generate a new application only for cloud functions:

```JS
nx g @simondotm/nx-firebase:app test-app-functions
```

Which will generate the below folder structure:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vt9ginau9pheacgm62p3.png)

### Missing @nx/node

I the process of adding cloud function I encountered the error of `missing @nx/node`, so I went to the [NX docs website](https://nx.dev/packages/node) and manually installed `npm install -D @nx/node` the library.

## Cloud functions - Sharing TS types

Most likely you will want to share some typescript types/interfaces between your libraries and cloud-functions. For that, create an [nx node library](https://nx.dev/packages/node/generators/library) by `nx g @nx/node:library shared-types`,

It creates a `shared-types` folder under `libs` directory and updates the root `tsconfig.base.json`. Now you can create an interface and use this interface in your cloud function app: `test-app-functions`.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1onmt47f4zuidak6qpk9.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/l23llr8v1qayeb5d7iy6.png)

## Cloud functions - Serving & Deployment

When you created your cloud function directory: `test-app-functions` (mine is called market-monitor-cloud-functions) it contains a `package.json` with some scripts to run the app.

I personally had trouble running those script from the cloud-function app directory so instead of that I introduced 2 scripts into the root `package.json` file. Those are:

```jsx
"mm:cloud-function:serve": "nx build test-app-functions && firebase emulators:start --only functions --config firebase.test-app-functions.json",
"mm:cloud-function:deploy": "nx build test-app-functions && firebase deploy --only functions --config firebase.test-app-functions.json"
```

When serving your app by the local emulator what you also may want to do is to update the `firebase.test-app.json` file at the root directory, precisely the `emulators` part. I only wanted to emulate the functions, so I removed the rest of the options and ended up with the following configuration:

```jsx
// firebase.test-app.json
"emulators": {
    "functions": {
      "port": 5001
    },
    "singleProjectMode": true
  }
```

### Initiaze Functions to Firebase

The first thing you have to do when it comes to deploying cloud functions is to enable your project to pay-as-you-go:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z2rv49l07jcwzn3xpgna.png)

If you have ever worked with firebase functions outside of nx, most of the times you connect your functions to your firebase app, is by exporting the private key (as suggested at the beginning), importing your key into the folder and the initializing the app as follows:

```jsx
import * as admin from 'firebase-admin';
import { DATABASE_URL } from './environments';

const serviceAccount = require('../firebase_key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: DATABASE_URL,
});
```

The config however didn’t work for me. I was having some weird path resolving errors so I ended up just by copying the `firebase_key.json` content directly into the `credential` part (which is not the ideal solution), as follows:

```jsx
const serviceAccount: admin.ServiceAccount = {
  projectId: 'whatever-id',
  privateKey: '-----BEGIN PRIVATE KEY-----',
  clientEmail: 'firebase-adminsdk-knos0@something.gserviceaccount.com',
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: DATABASE_URL,
});
```

After that I run the deployment command: `yarn mm:cloud-function:deploy`, it will successfully deploy my cloud functions to Firebase.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/y8p6w57ftuflylkwx9z2.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2ilniugibyeov938404u.png)

## Summary

Honestly, the longer I am a developer the more technologies I have to use, however, once everything is set up I greatly appreciate the productivity it gives me.

Firebase is a great BAAS solution and NX had proven its usefulness throughout the years. Choose your frontend framework based on your preferences, however, I believe this stack is great for a side project that is intended to fail in the near future. Have fun 👋.

Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
