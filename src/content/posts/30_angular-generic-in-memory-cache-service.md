---
title: 'Angular: Generic In-Memory Cache Service"'
seoTitle: 'Angular: Generic In-Memory Cache Service"'
seoDescription: 'When manage application state in you Angular projects, you create a service to handle a specific...'
slug: 30_angular-generic-in-memory-cache-service
tags: angular, rxjs, beginner
order: 30
datePublished: 09.09.2024
readTime: 3
coverImage: article-cover/30_angular-generic-in-memory-cache-service.webp
---

When [manage application state](https://dev.to/krivanek06/angular-state-management-how-to-keep-your-sanity-1oin) in you Angular projects, you create a service to handle a specific feature state, such as booking state, user state, groups, etc.

However there are cases where you have such a little data that it’s not worth creating a separate service, but rather have one service where you keep some general application information, and maybe synchronize with local storage.

You want to have a strongly typed service where you can save pieces of data under specific keys and sync it with local storage, so how to go around it? First create you types and initial late:

```typescript
export type LocalStorageData = {
  /** user's demo account */
  demoAccount?: {
    email: string;
    password: string;
    createdDate: string;
  };
  /** true if should show loader on the whole app */
  loderState?: {
    enabled: boolean;
  };
  theme?: {
    isDarkMode: boolean;
  };
};

export const storageInitialData: LocalStorageData = {
  demoAccount: undefined,
  loderState: undefined,
  theme: undefined,
};
```

in this case `LocalStorageData` represents what data type we want to save into the store service and `storageInitialData` is the initial store data. Then to create a storage service, you can go as follows:

```typescript
@Injectable({
  providedIn: 'root',
})
export class StorageLocalService {
  /** key under which the data is saved in local storage */
  private readonly STORAGE_MAIN_KEY = 'APPLICATION_NAME';

  private readonly updateData$ = new Subject<LocalStorageData>();

  /** current version of the data saved - if changed, all data will be removed */
  private readonly currentVersion = 1;

  /** readonly value from local storage */
  readonly localData = toSignal(
    this.updateData$.pipe(startWith(this.getDataFromLocalStorage())),
    {
      initialValue: this.getDataFromLocalStorage(),
    }
  );

  /**
   * saves data also into local storage
   *
   * @param key - key to save data
   * @param data - data to be saved
   */
  saveDataLocal<T extends keyof LocalStorageData>(
    key: T,
    data: LocalStorageData[T]
  ): void {
    try {
      const newData = this.saveAndReturnState(key, data);

      // can happen that too many data is saved
      localStorage.setItem(this.STORAGE_MAIN_KEY, JSON.stringify(newData));
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * saves data into local internal variable
   * @param key
   * @param data
   */
  saveData<T extends keyof LocalStorageData>(key: T, data: LocalStorageData[T]): void {
    this.saveAndReturnState(key, data);
  }

  private saveAndReturnState<T extends keyof LocalStorageData>(
    key: T,
    data: LocalStorageData[T]
  ): LocalStorageData {
    // all local storage data saved for this app - different keys
    const savedData = this.getDataFromLocalStorage();

    // updated data for this specific key
    const newData = {
      ...savedData,
      [key]: data,
    };

    // notify all subscribers
    this.updateData$.next(newData);

    return newData;
  }

  /** returns stored app state or initial data if versions do not match */
  private getDataFromLocalStorage(): LocalStorageData {
    const data = localStorage.getItem(this.STORAGE_MAIN_KEY) ?? '{}';
    const dataParsed = JSON.parse(data) as LocalStorageKeysVersion;

    // if version matches, return data
    if (dataParsed.version === this.currentVersion) {
      return dataParsed;
    }

    // create new initial data since version is different
    const updatedData = {
      ...storageInitialData,
      version: this.currentVersion,
    };

    // update local storage
    localStorage.setItem(this.STORAGE_MAIN_KEY, JSON.stringify(updatedData));

    return updatedData;
  }
}
```

Couple of things to mention about the above service:

The use of `currentVersion` is important because it may happen that you want to change the data structure for a specific key or completely reset the local storage data. The method `getDataFromLocalStorage()` checks if the version that is in the local storage matches the version of the service and if not, it will reset the whole stored data. You also may want to introduce a version for each specific key to not remove all the stored data.

You need to have two methods - `saveData()` that will only save some data into the in-memory state, but also a method that will persist the data, like `saveDataLocal()` . Keep in mind that you may have more data than the [maximum capacity of the local storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) (~10MB) so don’t save everything in the local storage.

Using generics we can achieve a strongly typed service with the following `<T extends keyof LocalStorageData>`. For example for when I use the `saveData()` method, I choose a key from the `LocalStorageData` type and TS will tell me what data type I can save

Finally the exposed signal `localData` that has the current state value. Use signals rather than observables to handle state.

```typescript
@Component({
  selector: 'app-page-menu',
  standalone: true,
  imports: [
    /* .... */
  ],
  template: `
    @if (loading()) {
      show loader
    }
  `,
})
export class PageMenuComponent {
  private storageLocalService = inject(StorageLocalService);
  loading = computed(() => !!this.storageLocalService.localData()?.loader?.enabled);
}
```

Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
