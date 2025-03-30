Recently I have deployed one of my application into Google Play. I had a few problems so I thought I could try to write down a step-by-step guide, especially for my future self. This article will have an example Angular application connected to firebase, which we will deploy to Google Play, however, these steps are framework independent, so I guess it will be very similar for react, svelte, etc.

With this article I assume that you already have a web application with a mobile design ready. You most likely use a client side firebase SDK like `@angular/fire` and the only missing step is to deploy into Google Play for which we will use [Capacitor](https://capacitorjs.com/docs).

## Final Application

Check out the [Github repo](https://github.com/krivanek06/angular-capacitor-example) for the application example. It is also accessible on the website https://angular-capacitor-example.web.app/ , and if Google approves it I will share the link to download the app.

The application is fairly simple, you are shown with random quotes, which you can like and are saved into the Firestore. I also use firebase rules so that every user can access only their data.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nvzhw2emary3z5cvpjah.gif)

### 1. Install Necessary Packages

The time writing this article there is a package called [@capacitor/angular](https://www.npmjs.com/package/@capacitor/angular) however it was updated around 2021, hard to say if it still supported, so we will go with the official capacitor libraries. Inside your project install the following libraries:

```jsx
npm install -D @capacitor/core
npm install -D @capacitor/andoird
npm install -D @capacitor/ios
npm install -D @capacitor/cli
```

### 2. Inicialize Capacitor

After installing dependencies, you can run the following command `npx cap init` or manually create a `capacitor.config.ts` on the root level, with the following configuration

```jsx
// file: capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // unique app id
	appId: 'angular_capacitor_example.krivaneda.app',
  // name of you app
	appName: 'Angular Capacitor Example',
  // location of the build files
	webDir: 'dist/angular-capacitor-example/browser',
	server: {
		androidScheme: 'https',
	},
};

export default config;
```

The `appId` is a valid java [package ID to configure for Android](https://capacitorjs.com/docs/android/configuration). It has to be unique per your Google Play account, so I usually put the project name with some identification.

### 3. Adding Android Platform

Next, you want to inicialize android specific boilerplate code which will be wrapping your javascript application. The following command creates an `android` folder.

```jsx
npx cap add android
```

### 4. Build & Sync Angular

Build you application and then sync with the native platform.

```jsx
> ng build
> npx cap sync
```

### 5. Verify Build In Android Studio

You need to [download Android studio](https://developer.android.com/studio) in order to test your app and make some final configurations. After that, run the command `npx capacitor open android` to open up Android studio and launch your application with a green arrow on the top right corner.

### 6. Generate SSH Key

If you have never run an Android application locally, you may need to create a local fingerprint, which you will (in the next step) upload to firebase, to enable interaction from you local emulator, otherwise firebase will reject every request. How to create fingerprint, visit a guide from [Capacitor docs - create site association file](https://capacitorjs.com/docs/guides/deep-links#add-associated-domain).

### 7. Enable Firebase On Android

When you created your Firebase project, you probably only created it for a web platform. Verify it in `project settings -> your apps`. You have to create a platform specific configuration to enable Firebase on Android. The guide if describe in the [official firebase website](https://firebase.google.com/docs/android/setup).

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/s1y8smz5eowsx4joni9o.png)

Click on `add app` and choose `android` . In `register app` copy `appId` and `appName` from `capacitor.config.ts` and to get your ssh key click in Android Studio on `Gradle -> Tasks ->  android -> signingReport` which in the console will generate a SSH-1 key that you can copy.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rxet8py5g1r4ux30clev.png)

You need the local ssh key to enable firebase communication from you local machine. After clicking on `register app`, download your `google-service.json` key. Open VSCode and put this file into the folder `android -> app -> google-service.json` and run `npx cap sync`.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/a0vchcy4bur4isq0ca8l.png)

You can click on `next` for the 3rd and 4rd step and with these steps, you should have an android app in Firebase configuration.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ccn6a3cw07dgzu5uesqz.png)

### 8. Enable Firebase Authentication on Android

This is the point which cause the most frustration to web developers. What you may experience is that authentication is working on the web version, however you just can not log to your app in android / ios platform.

There is still an open issue [AngularFire not working on Android and IOS](https://github.com/angular/angularfire/issues/3087) regarding [@angular/fire](https://www.npmjs.com/package/@angular/fire) not working on Android. When you try google, or other oauth2, authentication, nothing will happen. What is the problem you ask? It is indeed a question in [stack overflow](https://stackoverflow.com/a/62996887) and in summary:

> Web-based firebase social authentication won't work with the capacitor. It is because the app tries to open the popup or redirect and it fails. In the case of phone authentication, it fails because the window object is not available in the app which is needed for ReCaptcha.

The solution I used to fix this problem is a library [@capacitor-firebase/authentication](https://www.npmjs.com/package/@capacitor-firebase/authentication). It is useful because it “encapsulates the Firebase JS SDK and enables a consistent interface across all platforms”, so you don’t have to manually check each platform and use different firebase SDK.

```jsx
npm install @capacitor-firebase/authentication firebase
```

Inside `capacitor.config.json` add the following:

```jsx
// file: capacitor.config.json
plugins: {
		FirebaseAuthentication: {
			skipNativeAuth: false,
			providers: ['google.com'],
		},
	},
```

After installing `@capacitor-firebase/authentication`, you have to adjust your authentication service to make your imports from `@capacitor-firebase/authentication`, instead of `@angular/fire/auth`, since it can resolve the right firebase SDK for each platform.

```jsx
import { Injectable, computed, signal } from '@angular/core';
import {FirebaseAuthentication, User} from '@capacitor-firebase/authentication';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginUserInput, RegisterUserInput } from '../models';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationAccountService {
	private authUserSignal = signal<User | null>(null);

	getCurrentUser = computed(() => this.authUserSignal());

	constructor() {
		FirebaseAuthentication.addListener('authStateChange', (change) => {
			console.log('Auth state change', change);
			this.authUserSignal.set(change.user);
		});
	}

	getLoadedAuthentication(): Observable<boolean> {
		return this.loadedAuthentication$.asObservable();
	}

	async signIn(input: LoginUserInput): Promise<void> {
		await FirebaseAuthentication.signInWithEmailAndPassword({
			email: input.email,
			password: input.password,
		});
	}

	async register(input: RegisterUserInput): Promise<void> {
		await FirebaseAuthentication.createUserWithEmailAndPassword({
			email: input.email,
			password: input.password,
		});
	}

	async removeAccount(): Promise<void> {
		const user = await FirebaseAuthentication.getCurrentUser();
		if (user) {
			FirebaseAuthentication.deleteUser();
		}
	}

	async signInGoogle(): Promise<void> {
		const result = await FirebaseAuthentication.signInWithGoogle();
	}

	async signOut(): Promise<void> {
		await FirebaseAuthentication.signOut();
	}
}
```

Now, when you build you Angular app (`ng build`), sync it (`npx cap sync`), and launch it on Android studio you may experience **Application Crashing**. The problem is described on a [github issue](https://github.com/capawesome-team/capacitor-firebase/issues/60#issuecomment-1087069893). Go to `variables.gradle` and inside the `ext` section add a new variable.

```jsx
// file: variables.gradle
ext {
		// ... other
    rgcfaIncludeGoogle = true
}
```

After using the `@capacitor-firebase/authentication` library and setting up `rgcfaIncludeGoogle` variable, your authentication should be working 🤗 .

### 9. Firebase Rules - Authentication Glitch

If you are using firebase rules, you may experience a very weird glitch. I have the following rules:

```jsx
 rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own document
    match /quotes-user/{userId}/{document=**} {
      allow read, write: if isOwner(userId);
    }

    // Deny access to everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }

  function isOwner(userId) {
    return request.auth != null && request.auth.uid == userId;
  }
}
```

which means, every authenticated user can access their own document, that match their userId, inside the`quotes-user`collection, and everything else is denied.

What weird is that, these rules work as they should on the web, however, when I launch the app on Android, I am indeed able to log in, but I don’t receive any data back 😮. Instead I am getting the error: `FirebaseError: [code=permission-denied]: Missing or insufficient permissions.`

Seems like `request.auth.uid` object does not exists? I am not sure to be honest and I wasn’t able to fix this. I had to put

```jsx
match /{document=**} {
  allow read, write: if true;
 }
```

which is not ideal, you don’t want to go in production with this, so if you know the answer, leave a comment, thx.

### 10. Deploy to Google Play

Visit your [Google Play Console](https://play.google.com/console/u/0/developers), which should display your list of applications. If you are reading this, most likely you have 0. Click `create app` and fill the form asking some basic questions.

Every time your are going to deploy a new build to Google Play you have to do the following steps:

Inside `build.gradle` you have to increment the `versionCode` and occasionally the `versionName`. When you try re-deploy a different build with the same `versionCode` , Google will reject it. I personally put my application version (i.e 1.2.12 as `versionName`) and just increment `versionCode`.

To make a deployable build, go to `build -> Generate Signed Bundle / APK` choose `Android App Bundle` . There is a `key store path` option. It allows you to create a local certificate by which you always have to sign your app. Save this certificate, as it is once lost, you will not be able to change your existing application version, since the certification will be different.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ghembv21t5iak61i4pg6.png)

Click on generating a `release` version and it should create a `app-release.aab` file.

In Google Play Console, go to `Production -> Edit Release`. You will see a warning saying “To upload a bundle, you must provide a signing key or generate one using Play app signing”. Click on `Choose signing key` and `Use Google-generated key`

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/d5n289dd01vik0r4w18o.png)

After the key is generated, you can upload your `app-release.aab` into the `App Bundle` section.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ldq2ocdqgloq9rm6mmqx.png)

Clicking on the `next button` you will be redirected to making this release as a production one, however before that you may see some error messages.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ydc0ir5nb360pvspww23.png)

As annoying as it is, these steps have to be completed only once. Once you are done go back to you production release, you will send your changes for review.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/w0ymt1yemqbjos77sr43.png)

Now you only wait for kind people from Google to approve your app.

### 11. Save Google Play Console Certificate

This step is very similar what we did in step 7. Previously we saved our local SHA-1 key into firebase to enable interaction with firebase from our local Android environment. Now, have to copy the SHA-1 key from Google Play Console into firebase.

In Google Play Console go to `settings -> App signing key certificate` , copy the `SHA-1 certificate fingerprint` into Firebase `Project settings -> Your Apps -> Android App`

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tfmlqsaaog3ofy9qvc85.png)

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/sa0azwga7zos8ejbaqxm.png)

## Summary

Putting your frontend application into Google Play can be a pain if you do it for the first time. All the forms you have to fill in Google Play, setup correct firebase authentication, SSH keys, configurations, etc. For me it was a bit overwhelming so I tried to create a smaller guide how to do it next time.

Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
