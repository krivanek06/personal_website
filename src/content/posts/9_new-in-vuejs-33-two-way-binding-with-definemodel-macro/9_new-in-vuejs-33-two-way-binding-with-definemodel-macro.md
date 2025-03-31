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

With the upcoming [VueJS version 3.3](https://github.com/vuejs/core/blob/main/CHANGELOG.md#330-2023-05-08) the community once again doesn’t disappoint and releases many useful features for developers to be more productive, and ship features faster.

One of the newly welcomed features is [defineModel](https://github.com/vuejs/core/pull/8018) which allows us to implement much smoother 2-way binding. Let’s demonstrate its usage in the following blogpost.

## What is 2-Way Binding?

Two-way binding is a feature in VueJS that allows changes in the data to update the view automatically and vice versa. This means that when the user updates the view, the underlying data is also updated, and when the data is updated programmatically, the view is automatically updated to reflect the new data. It is achieved using the `v-model` directive, which binds a form input element to a piece of data.

```VUE
<template>
    <input v-model="message" />
</template>

<script setup>
	import { ref } from 'vue'

	const message = ref('Hello from Bitovi!')
</script>
```

Two-way binding is useful because it eliminates the need for manual event handling to keep the view and data in sync, which can be tedious and error-prone. Using v-model is the equivalent of

```VUE
<template>
    <input
      :value="message"
      @input="message = $event.target.value"
    />
</template>

<script setup>
	import { ref } from 'vue'

	const message = ref('Hello from Bitovi!')
</script>
```

## Custom 2-way binding

An example may be having a custom search component, allowing the user to type some value into the search, which will display multiple options until he chooses one. This behavior is demonstrated in the following code:

```VUE
// MySearch.vue

<template>
  <div>
    <!-- search text input -->
    <input v-model="searchRef" type="text" placeholder="Search"/>

    <!-- display selected value -->
    <div v-if="props.modelValue">
      Selected: {{ props.modelValue.title }}
    </div>

    <!-- results -->
    <div v-if="searchRef.length > 3">
      <button
        v-for="data in store.getLoadedElements"
        :key="data.id"
        @click="onClick(data)"
      >
        {{ data.title }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports

const store = useStore();

const props = defineProps({
  modelValue: {
    type: Object as PropType<Element | null>,
    required: true,
    default: null
  }
});

const emit = defineEmits<{
  (e: "update:modelValue", value: Element): void;
}>();

// reference to search input
const searchRef = ref<string>("");

// fetch data from API
watchEffect(() => {
   store.fetchElements(searchRef.value);
});

const onClick = (data: Element) => {
  emit("update:modelValue", data);
};
</script>
```

In the above example, to make the custom 2-way binding work, you use `defineProps` to create a `modelValue` input property for the component and you use the `defineEmits` with `update:modelValue` to notify the parent about the change.

The usage of the above child component is achieved by the following syntax in another component.

```VUE
<MySearch v-model="someRef" />
<!-- same as -->
<MySearch
    :modelValue="someRef"
    @update:modelValue="someRef = $event"
/>
```

> **_NOTE:_** One useful tip is that you can define multiple properties for the `MySearch` component into the defineProps and `defineEmits`. The name `modelValue` is the name for the default value, however creating multiple properties, you can access them in the parent component by `<MySearch v-model:first="first" v-model:second="second"/>`.

## Using defineModel

With the upcoming VueJS version, 3.3 comes a new [defineModel macro](https://twitter.com/sanxiaozhizi/status/1644564064931307522), you no longer need to write out all the above-mentioned steps to implement custom 2-way binding.

This new feature is available from version-3.3.0-alpha.9, however, It is still considered an experimental feature. If you wish to use it or have difficulty upgrading to version 3.3m, you can still use its alternative, defineModels, from [Vue Macros library](https://vue-macros.sxzz.moe/macros/define-models.html), by which this feature was inspired. Overal they work the same way.

After completing the [installation guidelines](https://vue-macros.sxzz.moe/guide/bundler-integration.html), you can use [defineModels](https://vue-macros.sxzz.moe/macros/define-models.html) with the following syntax:

```VUE
// MySearch.vue

<template>
  <div>
    <!-- search text input -->
    <input v-model="searchRef" type="text" placeholder="Search"/>

    <!-- display selected value -->
    <div v-if="modelValue">Selected: {{ modelValue.title }}</div>

    <!-- results -->
    <div v-if="searchRef.length > 3">
      <button
        v-for="data in store.getLoadedElements"
        :key="data.title"
        @click="modelValue = data"
      >
        {{ data.title }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports

const store = useStore();
const { modelValue } = defineModels<{ modelValue: Element }>();

// reference to search input
const searchRef = ref<string>("");

// fetch data from API
watchEffect(() => {
  store.fetchElements(searchRef.value);
});
</script>
```

The macro `defineModels` replaces the previously used `defineProps` and `defineEmits` into one functionality.

Every time, the user passes some value to this component by `<MySearch :modelValue="someRef" />` the `MySearch` component will be updated and also on the other hand, in line 16, when the user selects an element, by `modelValue = data`, the listener on the parent component will be triggered.

## Summary

It’s great to see that the VueJS team recognizes valuable contributions from developers to the VueJS ecosystem and over time, they ship their implementation. With the upcoming version 3.3, VueJS brings us many more useful tools that will speed up our development.

Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
