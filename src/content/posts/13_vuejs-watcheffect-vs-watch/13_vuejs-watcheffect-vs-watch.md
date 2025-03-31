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

In Vue 3, there are two main ways to observe changes to reactive data: `watch` and `watchEffect`. While both accomplish the same goal of re-running code in response to changes in reactive data, they differ in important ways.

In short, `watch` is a function that allows you to observe changes to specific reactive data and perform actions in response to those changes. On the other hand `watchEffect` is a reactive function that automatically tracks any reactive dependencies used inside it.

Vue’s `watch`
When using `watch`, you provide two arguments. A reactive dependency which changes we want to track and a callback function that will be executed whenever the dependency change. This callback function is passed two arguments: the new value of the data and the old value of the data.

### The `deep` & `immediate` Options

The `watch` provides two optional options that you can use to customize its behavior: `deep` and `immediate`.

The **`deep`** option allows you to recursively watch all nested properties of an object. By default, `watch` only watches the reference of an object, not its properties. This means that if you change a property of an object, the reference to the object itself will not change, and therefore the callback function for `watch` will not be executed.

The `immediate` option allows you to execute the callback function immediately after the watcher is created. By default, `watch` does not execute the callback function when it's first created.

Consider the following example:

```Vue
<template>
  <main>
    {{ product.price }} = {{ product.quantity }} * 10
    <input v-model="product.quantity" type="number" />
  </main>
</template>

<script lang="ts">
export default {
  name: "ProductComponent",
  data() {
    return {
      product: {
        price: 10,
        quantity: 1
      }
    };
  },
  watch: {
    product: {
      handler: function (newVal, oldVal) {
        this.product.price = newVal.quantity * 10;
      },
      deep: false,
      immediate: true
    }
  }
};
</script>
```

We want to compote the `product.price` value based on the `product.quantity` chosen by the user. The `watch` function will run immediately and the `product.price` will be 10. However the `watch` function won’t run ever again, because it is dependent on the whole `product` object and we don’t change its reference.

To solve the above problem, use `deep: true`, or you can refactor the watcher to be dependent on the `quantity` field, such as:

```TS
watch: {
    "product.quantity": {
      handler: function (newVal, oldVal) {
        this.product.price = newVal * 10;
      }
    }
  }
```

Using [Composition API](https://vuejs.org/api/), we no longer need to use the `deep` option, since we can make the watcher observing the refs value-change, such as:

```Vue
<template>
  <main>
    {{ product.price }} = {{ product.quantity }} * 10
    <input v-model="product.quantity" type="number" />
  </main>
</template>

<script setup lang="ts">
const product = ref({
  price: 10,
  quantity: 1
});

watch(product.value,
  (newVal, oldVal) => {
		product.value.price = newVal.quantity * 10;
  },{ immediate: true });
</script>
```

## Vue’s watchEffect

Unlike `watch`, `watchEffect` does not require you to specify the data that you're watching. Instead, it automatically tracks any reactive dependencies used inside it and re-runs the code whenever any of those dependencies change. We can rewrite the above example with the following syntax:

```Vue
<template>
  <main>
    {{ product.price }} = {{ product.quantity }} * 10
    <input v-model="product.quantity" type="number" />
  </main>
</template>

<script setup lang="ts">
const product = ref({
  price: 10,
  quantity: 1
});

// runs every time its dependencies (quantity) change
watchEffect(() => {
  product.value.price = product.value.quantity * 10;
});
</script>
```

## Usage

In the above example, we used `watch` or `watchEffect` to calculate the `price` value based on the `quantity` change. For examples like this, it is preferable to use [computed property](https://vuejs.org/guide/essentials/computed.html#basic-example), instead of watchers. Watchers are used mainly for side effects and common use cases may be:

- Making an API call
- Saving the changed state of the dependency into some local storage
- Redrawing a chart based on changed dependencies
- Tracking user behavior

## Summary

This blog post explores the differences between Vue's `watch` and `watchEffect` functions, which both allow you to observe changes to reactive data. `watch` is used to observe specific reactive data and perform actions in response to those changes, while `watchEffect` automatically tracks any reactive dependencies used inside it.

Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
