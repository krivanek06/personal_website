---
title: 'How to Get Started with Pinia in Vue'
seoTitle: 'How to Get Started with Pinia in Vue'
seoDescription: 'You are starting your VueJs project and you get stuck on a question: how am I going to share data...'
slug: 2_how_to_get_started_with_pinia_in_vue
tags: javascript, vuejs, pinia
order: 2
datePublished: 19.09.2022
readTime: 4
coverImage: article-cover/2_how_to_get_started_with_pinia_in_vue.png
---

You are starting your VueJs project and you get stuck on a question: how am I going to share data across multiple components? While there are a variety of lightweight state management libraries for Vue, [Pinia](https://pinia.vuejs.org/introduction.html) is the one [officially recommended by the Vue team](https://vuejs.org/guide/scaling-up/state-management.html#pinia), that solves sharing data across components intuitively.

On one hand, the most used library in Vue is [Vuex](https://vuex.vuejs.org/); however, Pinia has almost the exact same or enhanced API as Vuex 5, described in [Vuex 5 RFC](https://github.com/vuejs/rfcs/pull/271). Pinia can be considered as a successor of Vuex with a different name and is also compatible with Vue 2.x.

## Why Pinia?

Pinia has solid type inference support when used with TypeScript and provides a simpler API that led it to become the new recommended state management library by Vue. Looking at the [NPM download](https://www.npmjs.com/package/pinia) and the almost 9K stars on the [Pinia Github repo](https://github.com/vuejs/pinia#readme), Pinia is gaining popularity.

Comparison, such as [Pinia against Vuex](https://npmtrends.com/pinia-vs-vuex), shows that Vuex, the previously recommended library, still has a higher download rate than Pinia. However, even the [Vuex official documentation](https://vuex.vuejs.org/) advises developers to opt-in for Pinia, since it is unlikely that Vuex will receive any additional functionalities.

## How to Install Pinia

Let’s take a look at how Pinia works. Installing and opting for Pinia is relatively straight forward. Follow the example below:

```bash
npm install pinia
```

```typescript
// main.js or main.ts

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).use(createPinia()).mount('#app');
```

## How Storage Works

Pinia’s approach to handling global storage is based on modularity. We create multiple smaller stores, as it makes sense for our application, give them a unique identification key and in the end, Pinia combines each store into a single one. A store definition consists of four properties:

- **id** - a unique key that identifies part of the application state
- **state** - function that returns an initial state
- **getters** - a place to define compute values for the state of the Store
- **actions** - a place to define methods for mutation of the Store

```typescript
import { defineStore } from 'pinia';

export const useTodoStore = defineStore({
  id: 'uniqueID',
  state: () => ({
    // ...
  }),
  getters: {
    // ...
  },
  actions: {
    // ...
  },
});
```

Pinia is also supported in [Vue.js devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en), where, as mentioned before, the global `state` object is composed of multiple modular `defineStore({...})` objects with a unique key.

![Pinia state in VueJs devtools](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ragjbiybqkm0gwfr97e8.png)

## Example Application

Let’s create a todo application, consisting of the following steps:

1. Creating a `Todo` item form in `TodoForm.vue`
2. Persisting a newly created `Todo` in the global store
3. Displaying a list of `Todo` items from the global store in `TodoList.vue`

The whole source code can be found in the following [GitHub repository](https://github.com/krivanek06/example_projects/tree/main/vue-pinia-getting-started). By using TypeScript, first, you create an interface representing your Todo items.

```typescript
// types/todo.ts

export interface ITodo {
  id: number;
  title: string;
  description?: string;
}
```

### Setting Up State Storage

Representation of our Todo storage is shown in the following snippet.

In the `action` section, you implement two mutation methods that will update the store state. The first one is `addTodo`, which adds a new `Todo` item to the list of todos, and the second one is `removeTodo`, which removes one by its `Id`. Mutations can access the store state by using the keyword `this`, so in your case, you access todos by `this.todos`.

It is also worth highlighting the `removeTodo` method to see that asynchronous mutations are performed in the same way as synchronous ones like the `addTodo` method in your case.

```typescript
// store/todo.ts

import type { ITodo } from '@/types/todo';
import axios from 'axios';
import { defineStore } from 'pinia';

export const useTodoStore = defineStore({
  id: 'todoState',
  state: () => ({
    todos: [] as ITodo[],
  }),
  getters: {
    totalTodos: state => state.todos.length,
  },
  actions: {
    addTodo(title: string, description?: string) {
      const todo: ITodo = {
        id: Math.floor(Math.random() * 10000), // random ID
        title,
        description,
      };
      this.todos = [todo, ...this.todos];
    },

    async removeTodo(id: number) {
      // example of an async request
      const response = await axios.get(
        'https://www.random.org/integers/?num=1&min=1&max=100&col=5&base=10&format=plain'
      );
      console.log('received data ', response.data);

      // remove todos
      this.todos = this.todos.filter(todo => todo.id !== id);
    },
  },
});
```

### Display Todos

Both components `TodoForm.vue` and `TodoList.vue` are basic Vue components. The main concept of both of them is the [setup()](https://vuejs.org/api/composition-api-setup.html#basic-usage) method, which serves as an entry point to the component, where we store the reference to the todo store by `const storeTodo = useTodoStore()` so that it becomes available for the whole component.

```typescript
// components/TodoForm.vue

<template>
  <form @submit="onSubmit">
    <h2>Todo Form</h2>

    <!-- title -->
    <div class="field">
      <label class="label">Title</label>
      <input type="text" class="input" name="title" v-model="title" />
    </div>

    <!-- description -->
    <div class="field">
      <label class="label">Description</label>
      <textarea class="input" name="description" v-model="description"></textarea>
    </div>

    <!-- submit -->
    <div class="field">
      <button type="submit">Create Todo</button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useTodoStore } from "../stores/todo";

export default defineComponent({
  name: "TodoForm",
  data() {
    return {
      title: "",
      description: "",
    };
  },
  setup() {
    const storeTodo = useTodoStore();
    return { storeTodo };
  },
  methods: {
    onSubmit(e: Event) {
      e.preventDefault();

      if (!this.title) {
        return;
      }

      // save data into store
      this.storeTodo.addTodo(this.title, this.description);
    },
  },
});
</script>

<style scoped>
/* ... */
</style>
```

```typescript
// components/TodoList.vue

<template>
  <div>
    <div v-for="todo of storeTodo.todos" :key="todo.id" class="wrapper">
      <div class="header">
        <div class="title">[{{ todo.id }}] {{ todo.title }}</div>
        <div>
          <button type="button" @click="storeTodo.removeTodo(todo.id)">
            remove
          </button>
        </div>
      </div>
      <div v-if="todo?.description">{{ todo?.description }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useTodoStore } from "../stores/todo";

export default defineComponent({
  name: "TodoList",
  setup() {
    const storeTodo = useTodoStore();

    return { storeTodo };
  },
});
</script>

<style>
/* ... */
</style>
```

## Summary

Even as a lightweight state management library, Pinia has become the recommended library both by Vue and Vuex developers and it is maintained by the core Vue team.

We took a look at how to write and read data from storage by a basic Todo application. Pinia can be used for both Vue 2 and Vue 3 users and from small to large-scale applications.

Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
