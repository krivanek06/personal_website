---
title: 'Collection of Vue Macros in Vue.js 3.3'
seoTitle: 'Collection of Vue Macros in Vue.js 3.3'
seoDescription: 'Many developers (myself included) were excited when Vue.js version 3.3 introduced several...'
slug: 12_collection-of-vue-macros-in-vuejs
tags: vuejs, beginner, opensource
order: 12
datePublished: 28.05.2023
readTime: 5
coverImage: article-cover/12_collection-of-vue-macros-in-vuejs.jpg
---

Many developers (myself included) were excited when [Vue.js version 3.3](https://blog.vuejs.org/posts/vue-3-3) introduced several functionalities from [Vue Macros](https://vue-macros.sxzz.moe/), the collection of proposed additions to Vue.js that extend its basic functionalities with syntactic sugar.

In this post, you will learn about Vue Macros that became a part of Vue version 3.3 and how you can use them if you are not yet on version 3.3.

## What is Vue Macros?

Let's go straight to the source! The official website claims the following:

> Vue Macros is a library that implements proposals or ideas that have not been officially implemented by Vue. That means it will explore and extend more features and syntax sugar to Vue.

Looking at its [GitHub](https://github.com/sxzz/vue-macros) repo, the library is well maintained. Moreover, Vue Macros supports Vue from version 2.7. To [install Vue Macros](https://vue-macros.sxzz.moe/guide/bundler-integration.html), you need to run `npm i -D unplugin-vue-macros`, configure `vite.config.ts`, and the `tsconfig.json` as is installation suggests to start using them.

_Which Macros do I want to use_, you ask? Let’s look into Macros introduced as part of Vue version 3.3.

### Macro defineModels

Prior to v3.3, when it came to component two-way  binding with `v-model`, we had to implement `props` and `emits` in the child component to receive or notify the parent component about a data change. You usually end up with the following example:

```Vue
    // MySearch.vue

    <template>
      <div>
        <button
          v-for="data in store.getLoadedElements"
          :key="data.title"
          @click="() => onInput(data)"
        >
         {{ data.title }}
        </button>
      </div>
    </template>

    <script setup lang="ts">
    // some additional code

    const store = useStore();

    const props = defineProps({
      modelValue: {
         type: Element,
         required: false
      }
    });

    const emits = defineEmits<{
      (e: "update:modelValue", value: Element): void;
    }>();

    function onInput(element: Element) {
      emit('update:modelValue', element)
    }

    // some additional code
    </script>
```

The [defineModels](https://vue-macros.sxzz.moe/macros/define-models.html) macro is a syntactic sugar by which you can avoid implementing two-way binding for using [v-model](https://vuejs.org/guide/components/v-model.html) on the component level instead of the default Vue.js implementation. You can achieve the above logic with the following syntax:

```Vue
    // MySearch.vue

    <template>
      <div>
        <button
         v-for="data in store.getLoadedElements"
         :key="data.title"
         @click="modelValue = data"
        >
         {{ data.title }}
        </button>
      </div>
    </template>

    <script setup lang="ts">
    // some additional code

    const store = useStore();
    const { modelValue } = defineModels<{ modelValue: Element }>();

    // some additional code
    </script>
```

Vue.js 3.3 recently received the `defineModels` enhancement for two-way binding under the name [defineModel](https://blog.vuejs.org/posts/vue-3-3#definemodel), which has the exact same functionality.

You will find more information in our blog post: [New in Vue.js 3.3: Two-Way Binding With defineModel Macro](https://www.bitovi.com/blog/new-in-vue-3.3-two-way-binding-with-definemodel-macro). However, opting for the `defineModel` functionality in Vue.js 3.3, as it is still an experimental feature, you have to modify your `vite.config.ts` in the following way:

```TS
    plugins: [
      vue({
        script: {
          defineModel: true
          // ^^ enables the feature
        }
      })
    ]
```

### Macro definePropsRefs

[Reactive props destructuring](https://blog.vuejs.org/posts/vue-3-3#reactive-props-destructure) was quite a requested feature from the Vue.js community. It’s safe to say the developer was excited about the feature released in Vue 3.3. However, the older Vue.js version still receives the following error message when trying to destructure props.

![macrodefineprops](https://www.bitovi.com/hubfs/macrodefineprops.png)

Fortunately, the [macro definePropsRefs](https://vue-macros.sxzz.moe/macros/define-props-refs.html) allows us property destructuring by writing the following code:

```TS
    const { showModal, inputValue } = definePropsRefs({
      showModal: {
        type: Boolean,
        required: false
      },
      inputValue: {
        type: String,
        required: false,
        default: ""
      }
    });
```

Using Vue Macros are much better developer experience than destructuring properties before version 3.3:

```TS
    const { showModal, inputValue } = toRefs(
      withDefaults(
        defineProps({
          showModal: {
            type: Boolean,
            required: false
          },
          inputValue: {
            type: String,
            required: false,
            default: ""
          }
       }),
       {
         showModal: false,
         inputValue: ""
       }
      )
    )
```

If you want to use `defineProps` an experimental feature in Vue version 3.3, you have to opt-in with the following configuration:

```TS
    // vite.config.js
    plugins: [
      vue({
        script: {
          propsDestructure: true
          // ^^ enables the feature
        }
      })
    ]
```

### Macro defineEmit

Using `defineEmits` wasn’t such a bad experience. You declared and used emits in the following way:

```TS
    const emit = defineEmits<{
      (e: 'foo', id: number): void
      (e: 'bar', name: string): void
    }>()

    emit('foo', 10);
    emit('bar', '10'');
```

Using [defineEmit](https://vue-macros.sxzz.moe/macros/define-emit.html) from Vue Macros, you get the advantage of declaring individual emits in the following way:

```Vue
    <script setup>
    // Declare emit
    const foo = defineEmit<number[]>('foo')

    // Infer emit name from variable name
    const bar = defineEmit<string[]>()

    // Emit array of strings
    const test = defineEmit<string[][]>()

    foo(10)
    bar('10')
    test(['test1', 'test2'])
    </script>
```

Vue 3.3 brought a little bit of syntactic sugar, [working with defineEmits](https://blog.vuejs.org/posts/vue-3-3#more-ergonomic-defineemits) in the following way:

```TS
    const emit = defineEmits<{
      foo: [id: number]
      bar: [name: string]
    }>()
```

Fortunately, there is no opting-in for this feature, so you can use it right away!

### Macro defineSlots

When working with [scoped slots](https://vuejs.org/guide/components/slots.html#scoped-slots) in Vue.js, one problem we faced was not knowing what properties were available on the parent component. Here is the following example before Vue version 3.3:

```Vue
    <!-- <ChildComponent> template -->
    <div>
      <slot :text="greetingMessage" :count="1"></slot>
    </div>

    // ------------------------------------------

    <!-- <ParentComponent> template -->
    <MyComponent v-slot="slotProps">
      {{ slotProps.text }} {{ slotProps.count }}
    </MyComponent>
```

A developer may access `slotProps.anything` and receive an error only during the runtime.

Vue.js 3.3 introduced `defineSlots`, which use [types slots](https://blog.vuejs.org/posts/vue-3-3#typed-slots-with-defineslots), eliminating the parent component of accessing non-existing props from the child. Here is the following example:

```Vue
    <!-- <ChildComponent> -->

    <template>
      <div v-for="item of items" :key="item">
        <h2>Name</h2>

        <!-- default slot -->
        <slot name="itemNameSlot" :item-name="item">
           {{ item }}
        </slot>
      </div>
    </template>

    <script setup lang="ts">
    const items = ref<string[]>(["item1", "item2", "item3"]);

    defineSlots<{
      itemNameSlot: (props: { itemName: string }) => any;
    }>();
    </script>

    // ----------------------------

    <!-- <ParentComponent> -->

    <template>
      <main>
       <Test>
         <template #itemNameSlot="{ itemName }">
           <a :href="`/someurl/${itemName}`">
             {{ itemName }} - click
           </a>
         </template>
       </Test>
      </main>
    </template>
```

If you replace the `itemName` with a different value in the `#itemNameSlot="{ itemName }"` in the parent component, you will receive the following error:

![macrodefineslots](https://www.bitovi.com/hubfs/macrodefineslots.png)

Fortunately, there is already a macro for the same functionality with the same name - [defineSlots](https://vue-macros.sxzz.moe/macros/define-slots.html) from Vue Macros if you are not yet on version 3.3.

## Summary

Vue.js 3.3 brought new features that developers were waiting for. The community has already implemented most of these features in a package called [Vue Macros](https://vue-macros.sxzz.moe/guide/getting-started.html). It is a small but convenient collection of utils that can be used even on Vue version 2.7.

Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
