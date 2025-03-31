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

Vue.js is a popular JavaScript framework that provides developers with various tools to create dynamic and reactive web applications.

One of the key features of Vue is its reactivity system, which enables the framework to efficiently update the view when the state changes. In this blog post, you’ll learn the different types of reactive objects, such as `ref` and `reactive`, when to use which, and ones that you maybe haven’t heard of like `shallowRef` and `shallowReactive`.

## What is Ref?

The `ref` function is used to create a reactive reference to a single value. This value can be a primitive type like a string or number or an object or array.

To access the value of the ref function, you need to use the `.value` keyword. By using reactive references, such as `ref`, Vue under the hood will track any changes made to this instance and update the DOM if the value of the variable changes. An example can be seen in the following code.

```Vue
<template>
  <div>
    <button @click="onButtonClick">Toggle Div</button>

    <!-- hidden text -->
    <div v-if="dataModel.showDiv">Here is some hidden text</div>

    <!-- counter value -->
    <div>🚀 Counter value: {{ dataModel.counter }} 🚀</div>
  </div>
</template>

<script setup lang="ts">
const dataModel = ref({ showDiv: false, counter: 0 });

const onButtonClick = () => {
  dataModel.value.showDiv = !dataModel.value.showDiv;
  dataModel.value.counter++;

  console.log(`counter: ${dataModel.counter}`);
};
</script>
```

Every time you click on the button, a div will be revealed/hidden, and a counter will be incremented. Such a real-world example, I know! In order to tell Vue that you want to make the `dataModel` reactive, you need to use `ref` otherwise, the DOM will receive no updates.

## What if I don’t use Ref?

Coming back to the above example, you may ask, _what would happen if I use a simple object instead of the ref function?_ Let’s try to execute the following code:

```Vue
<template>
  <div>
    <button @click="onButtonClick">Toggle Div</button>

    <!-- hidden text -->
    <div v-if="dataModel.showDiv">Here is some hidden text</div>

    <!-- counter value -->
    <div>🚀 Counter value: {{ dataModel.counter }} 🚀</div>
  </div>
</template>

<script setup lang="ts">
const dataModel = {
  counter: 0,
  showDiv: false
};

const onButtonClick = () => {
  dataModel.counter++;
  dataModel.showDiv = !dataModel.showDiv;

  console.log(`counter: ${dataModel.counter}`);
};
</script>
```

The only change is replacing the `ref` function with a normal object. However, with the simple change, the whole DOM will stop being reactive, so any change made to the object will not be reflected in the HTML.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ns5wy0q3grbcbsrf1pbm.gif)

## Reactive

The `reactive` function creates a reactive object that can hold any number of properties. However, `reactive` can't hold primitives. You will receive the following error:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/njv1t6fwvdso0ihkf8vx.png)

When the properties of this object are updated, the view is updated automatically. This powerful feature makes it easy to create complex reactive applications. Here’s an example of how to use `reactive`:

```Vue
<template>
  <div>
    <button @click="onButtonClick">Toggle Div</button>

    <!-- hidden text -->
    <div v-if="dataModel.showDiv">Here is some hidden text</div>

    <!-- counter value -->
    <div>🚀 Counter value: {{ dataModel.counter }} 🚀</div>
  </div>
</template>

<script setup lang="ts">
const dataModel = reactive({
  counter: 0,
  showDiv: false
});

const onButtonClick = () => {
  dataModel.counter++;
  dataModel.showDiv = !dataModel.showDiv;

  console.log(`counter: ${dataModel.counter}`);
};
</script>
```

> :warning: **Warning**
> When working with the `reactive` function, always access the object by its keys. When you try to change the `reactive` variable reference, the reactivity will break. In the following code, you can see an example of a broken reactivity

```JS
let dataModel = reactive({
  counter: 0
});

const onButtonClick = () => {
  dataModel = reactive({
    counter: dataModel.counter + 1
  });
};
```

### Should I use Ref or Reactive?

You will find in the documentation that ref is used mainly for primitives but also can be used for objects while reactive is only used for objects.

At first glance, the main difference is just using the .value keyword when accessing the value of the ref property. However, another thing is with the implementation. Taking a look at the ref [implementation from Github](https://github.com/vuejs/core/blob/main/packages/reactivity/src/ref.ts), you can see the following code:

```JS
class RefImpl<T> {
  private _value: T
  private _rawValue: T

  public dep?: Dep = undefined
  public readonly __v_isRef = true

  constructor(value: T, public readonly __v_isShallow: boolean) {
    this._rawValue = __v_isShallow ? value : toRaw(value)
    this._value = __v_isShallow ? value : toReactive(value)
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newVal) {
    const useDirectValue =
      this.__v_isShallow || isShallow(newVal) || isReadonly(newVal)
    newVal = useDirectValue ? newVal : toRaw(newVal)
   if (hasChanged(newVal, this._rawValue)) {
     this._rawValue = newVal
     this._value = useDirectValue ? newVal : toReactive(newVal)
     triggerRefValue(this, newVal)
   }
  }
}
```

Every time you create a reactive variable by `ref`, passing an object into its constructor, on line 10, it is treated as you would use the `reactive` keyword. So should I use `ref` or `reactive` for objects?

This is a personal preference, but I use `ref` almost all the time. Despite tediously writing the `.value` to access the ref’s value, the Vue team is aware of the problem, and the open [RFC - Reactivity Transform](https://github.com/vuejs/rfcs/discussions/369), was aiming to solve this issue, however, seems like it was abandoned.

Reactivity transform is not yet part of the official Vue.js package, however, you can install [Vue Macros](https://vue-macros.sxzz.moe/), that enrich your VueJS experience with the following configuration:

```TS
// vite.config.ts
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    vue({
     // used to enable tranctivity transform
     reactivityTransform: true
    }),
  ]
});
```

And use reactivity transformation from `Vue Macros` in the following way:

```TS
<template>
 ...
</template>

<script setup lang="ts">
const dataModel1 = $ref({
  counter: 0
});

const dataModel2 = ref({
  counter: 0
});

const onButtonClick = () => {
  dataModel1.counter++;

  dataModel2.value.counter++;
};
</script>
```

## Reactivity API

Vue provides additional functions to achieve reactivity with high performance in your application. You can learn more about them on the [official documentation](https://vuejs.org/api/reactivity-advanced.html), however, it is worth highlighting two of them, which are `shallowRef` and `shallowReactive`.

### ShallowRef

The `shallowRef` function is similar to `ref`, but with one key difference: the changes made to its properties will trigger a change only if you change the memory reference. It is used for performance optimizations of large data structures or integration with external state management systems. Looking at the official documents, the Vue community provides us with the following example.

```JS
const state = shallowRef({ count: 1 })

// does NOT trigger change
state.value.count = 2

// does trigger change
state.value = { count: 2 }
```

Examples of when you should prefer using `shallowRef` instead of `ref` can be working with chart data, where you want to exclude basic reactivity for application optimization but still have reactivity if you change the data reference. Another example can be working with dynamic components, such as the following example.

```TS
<template>
  <section>
    <!-- display buttons for dynamic component -->
    <button @click="dynamicComponent = Comp1">Comp1</button>
    <button @click="dynamicComponent = Comp2">Comp2</button>

    <!-- dynamic component -->
    <keep-alive>
      <component :is="dynamicComponent" />
    </keep-alive>
  </section>
</template>

<script setup lang="ts">
import Comp1 from "../shared/Comp1.vue";
import Comp2 from "../shared/Comp2.vue";

const dynamicComponent = shallowRef();
</script>
```

### ShallowReactive

The `shallowReactive` function is similar to `reactive`, without nested objects, because changes made to the properties of nested objects or arrays will not trigger the update of the view. One may consider using it to get minor performance, instructing Vue that nested properties don’t have to be reactive. However, even the Vue.js team gives a warning about its usage.

> **_NOTE:_** Shallow data structures should only be used for root level state in a component. Avoid nesting it inside a deep reactive object as it creates a tree with inconsistent reactivity behavior which can be difficult to understand and debug.

Here is an example of using `shallowReactive`:

```TS
<template>
  <div>
    <button @click="onButtonClick">Toggle Div</button>

    <!-- hidden text -->
    <div v-if="dataModel.showDiv.value">Some hidden text</div>

    <!-- counter value -->
    <div>🚀 Counter value: {{ dataModel.counter }} 🚀</div>
  </div>
</template>

<script setup lang="ts">
const dataModel = shallowReactive({
  counter: 0,
  showDiv: {
    value: false
  }
});

const onButtonClick = () => {
  // trigger reactivity
  dataModel.counter++;

  // doesn't trigger reactivity
  dataModel.showDiv.value = !dataModel.showDiv.value;

  console.log(`counter: ${dataModel.counter}`);
};
</script>
```

## Summary

In this blog post, you learned the differences between `ref` and `reactive` in Vue.js. In conclusion, there are small minor differences between both of them. However, when it comes to production applications, you can use either of them.

Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
