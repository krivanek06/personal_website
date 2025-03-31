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

Not that long ago I bumped into an interesting problem. I wanted to implement a “search user” dropdown. When you select a user's name, you make an API call to load more data, meanwhile the loading happens, you display a “loading…” message and once the user details are back from the server, you display those.

Kinda like the following GIF on which I will be describing the two approaches (declarative and imperative) that I used.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kxwpyxeuoefurxyvj9is.gif)

## The Problem Description

This is a small representation of the problem which you’ve probably bumped into many times. You have a dropdown and every time you select a value, you want to load more details about the selected item from the backend.

You display a loading message until the data is not there, maybe some fancy animation, and once the data arrives you display it.

We don’t need a server for this example, it’s enough to have a mock data service as follows:

```tsx
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export type DataItem = {
  id: string;
  name: string;
};

export const dataItems: DataItem[] = [
  { id: 'id_1', name: 'item_1' },
  { id: 'id_2', name: 'item_2' },
  { id: 'id_3', name: 'item_3' },
  { id: 'id_4', name: 'item_4' },
  { id: 'id_5', name: 'item_5' },
];

@Injectable({
  providedIn: 'root',
})
export class DataService {
  /**
   * simulate fake API call to the server
   */
  getDataFakeAPI(itemId: string): Observable<DataItem> {
    return of(itemId).pipe(
      map(() => dataItems.find(d => d.id === itemId)!),
      delay(1000)
    );
  }
}
```

The `dataItems` are items which will be displayed inside the select dropdown and every time you change the value, you will call `getDataFakeAPI` that returns the same value with some delay - mocking API call.

## Imperative Solution

The following solution is the solution that I used initially. I will post the whole code and then go over some parts which are important in this example.

```tsx
import { Component, inject, signal } from '@angular/core';
import { DataItem, DataService, dataItems } from './data-service.service';

@Component({
  selector: 'app-select-imperative',
  standalone: true,
  template: `
    <!-- dropdown of users -->
    <select (change)="onChange($event)">
      @for (item of displayData; track item.id) {
        <option [value]="item.id">{{ item.name }}</option>
      }
    </select>

    <h3>Selected Items</h3>

    <!-- displayed selected options -->
    @for (item of selectedItems(); track item.id) {
      <div class="item-selected" (click)="onRemove(item)">
        {{ item.name }}
      </div>
    }

    <!-- display loading state -->
    @if (isLoadingData()) {
      <div class="item-loading">Loading ...</div>
    }

    <!-- reset button -->
    @if (selectedItems().length > 0) {
      <button type="button" class="remove" (click)="onReset()">Reset</button>
    }
  `,
})
export class SelectImperativeComponent {
  private dataService = inject(DataService);

  displayData = dataItems;

  /**
   * displayed data on the UI - loaded from the BE
   */
  selectedItems = signal<DataItem[]>([]);

  isLoadingData = signal(false);

  /**
   * on select change - load data from API
   */
  onChange(event: any) {
    const itemId = event.target.value;

    // check if already saved
    const savedIds = this.selectedItems().map(d => d.id);
    if (savedIds.includes(itemId)) {
      return;
    }

    // set loading to true
    this.isLoadingData.set(true);

    // fake load data from BE
    this.dataService.getDataFakeAPI(itemId).subscribe(res => {
      // save data
      this.selectedItems.update(prev => [...prev, res]);
      // set loading to false
      this.isLoadingData.set(false);
    });
  }

  /**
   * removes item from selected array
   */
  onRemove(item: DataItem) {
    this.selectedItems.update(prev => prev.filter(d => d.id !== item.id));
  }

  onReset() {
    this.selectedItems.set([]);
  }
}
```

Overall it’s not that complicated and it may be close to a solution that you yourself would write. First of all, there is nothing significantly wrong with this solution, but why exactly do I call this an imperative approach ?

In short, this is imperative, because your signals - `selectedItems` and `isLoadingData` - can be changed all over the places which leads to two major problems - debugging and multiple properties.

Right now the `selectedItems` is changed in 3 places and `isLoadingData` is changed in 2 places, however once the complexity of this feature grows, debugging may become an issue to figure out how the data flow happens in this feature. What if `selectedItems` and `isLoadingData` will be used in 10 places each, suddenly it is not that easy to understand what’s happening.

Also with the growing complexity, you may want to introduce another properties like `isError = signal(false)` .

Now let’s think a bit and ask the question, could we combine the `selectedItems` , `isLoadingData` and potentially a new property `isError` into only one property which would look something like:

```tsx
{
 data: DataItem[];
 isError: boolean;
 isLoading: boolean;
}
```

## Declarative Solution

The result what we want to achieve with the declarative solution is that we want to have only one property (object), which will have the data and loading keys and we want to change the values for this property only in one place.

Here is the solution that I came up with:

```tsx
import { Component, inject, signal } from '@angular/core';
import { DataItem, DataService, dataItems } from './data-service.service';
import { Subject, map, merge, scan, startWith, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-select-declarative',
  standalone: true,
  template: `
    <!-- dropdown of users -->
    <select (change)="onChange($event)">
      @for (item of displayData; track item.id) {
        <option [value]="item.id">{{ item.name }}</option>
      }
    </select>

    <h3>Selected Items</h3>

    <!-- displayed selected options -->
    @for (item of selectedItems().data; track item.id) {
      <div class="item-selected" (click)="onRemove(item)">
        {{ item.name }}
      </div>
    }

    <!-- display loading state -->
    @if (selectedItems().isLoading) {
      <div class="item-loading">Loading ...</div>
    }

    <!-- reset button -->
    @if (selectedItems().data.length > 0) {
      <button type="button" class="remove" (click)="onReset()">Reset</button>
    }
  `,
})
export class SelectDeclarativeComponent {
  private dataService = inject(DataService);

  displayData = dataItems;

  private removeItem$ = new Subject<DataItem>();
  private addItem$ = new Subject<string>();
  private reset$ = new Subject<void>();

  /**
   * displayed data on the UI - loaded from the BE
   */
  selectedItems = toSignal(
    merge(
      // create action to add a new item
      this.addItem$.pipe(
        switchMap(itemId =>
          this.dataService.getDataFakeAPI(itemId).pipe(
            map(item => ({
              item,
              action: 'add' as const,
            })),
            startWith({
              item: null,
              action: 'initLoading' as const,
            })
          )
        )
      ),
      // create action to remove an item
      this.removeItem$.pipe(
        map(item => ({
          item,
          action: 'remove' as const,
        }))
      ),
      // create action to reset everything
      this.reset$.pipe(
        map(() => ({
          item: null,
          action: 'reset' as const,
        }))
      )
    ).pipe(
      scan(
        (acc, curr) => {
          // add reset state
          if (curr.action === 'reset') {
            return {
              isLoading: false,
              data: [],
            };
          }

          // display loading
          if (curr.action === 'initLoading') {
            return {
              data: acc.data,
              isLoading: true,
            };
          }

          // check to remove item
          if (curr.action === 'remove') {
            return {
              isLoading: false,
              data: acc.data.filter(d => d.id !== curr.item.id),
            };
          }

          // check if already saved
          const savedIds = acc.data.map(d => d.id);
          if (savedIds.includes(curr.item.id)) {
            return {
              isLoading: false,
              data: acc.data,
            };
          }

          // add item into the rest
          return {
            isLoading: false,
            data: [...acc.data, curr.item],
          };
        },
        { data: [] as DataItem[], isLoading: false }
      )
    ),
    {
      initialValue: {
        data: [],
        isLoading: false,
      },
    }
  );

  /**
   * on select change - load data from API
   */
  onChange(event: any) {
    const itemId = event.target.value;
    this.addItem$.next(itemId);
  }

  /**
   * removes item from selected array
   */
  onRemove(item: DataItem) {
    this.removeItem$.next(item);
  }

  onReset() {
    this.reset$.next();
  }
}
```

Yes, this is longer than the previous solution, however is it more complex or simpler than the previous one?

What needs to be first highlighted that instead of changing the `selectedItems` on multiple places, you now have 3 subjects, each of them representing an action that can happen.

```tsx
private removeItem$ = new Subject<DataItem>();
private addItem$ = new Subject<string>();
private reset$ = new Subject<void>();
```

Next inside the `selectedItems` you use these subjects and map them into format you want to work with. For me the following format suited the most

```tsx
item: DataItem;
action: 'add' | 'remove' | 'initLoading' | 'reset';
```

For the `addItem$` you want to use the `startWith` operator at the end of the pipe chain. This will allow that the first action which will be emitted when selecting a new value is `initLoading` and only when the API call (`dataService.getDataFakeAPI`) finishes, it will emit again with the action `add`.

You wrap each pipe mapping with the `merge` operator, because you want to perform some common logic despite of which one of these subjects emit.

Lastly you have the giant `scan` section. The `scan` operator is similar to `reduce` , however `scan` remembers the last computation that happened and if the `scan` happens again, it will use the data from the last computation - [read more about scan](https://www.learnrxjs.io/learn-rxjs/operators/transformation/scan) .

Inside the `scan` section, you create conditions what should happen based on the action of current value that is being processed.

It may reassemble how NgRx works. You have some actions (add, remove and reset subjects) and you create reducers to updated the state of only one property.

## Final Thoughts

Overall it’s up to you, the developer, which approach you choose to solve this problem. Both have some advantages and shortcomings.

If you want to play around with this example, you can [find it on stackblitz](https://stackblitz.com/edit/stackblitz-starters-ingyij). Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
