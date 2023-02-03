## pinia-persisted-state

## 说明(个人使用)

#### pinia 本地持久化

## 1. 安装

```bash
npm i @jiuyue-/pinia-persisted-state
```

## 2. 引入 pinia-persisted-state

- 创建 pinia 并注册 pinia-persisted-state

```ts
// store/index.ts
import { createPinia } from "pinia";

import createPersistedState from "@jiuyue-/pinia-persisted-state";

const pinia = createPinia();

pinia.use(createPersistedState);

export default pinia;
```

- 在 main.ts 中注册 pinia

```ts
// main.ts
import { createApp } from "vue";
import pinia from "./store";

createApp(App).use(pinia).mount("#app");
```

- 创建 store
  - 在 store 中添加`persist`属性，默认设置为`true`，表示开启本地持久化, 存储`state`中的所有数据。
  - 也可以设置为一个`PersistOptions`对象，结构如下：
    - `key`属性表示存储的`key`，默认是`store.$id`。
    - `storage`属性表示存储的`storage`，默认是`localStorage`, 可以设置为`sessionStorage`。
    - `paths`属性表示需要持久化的`state`中的属性，如果不设置或者为空数组，则持久化`state`中的所有属性。

```ts
// store/counter.ts
import { defineStore } from "pinia";

export const useCounter = defineStore({
  id: "counter",
  state: () => ({
    count: 0,
    a: 3,
    b: 4,
  }),
  // persist: true,
  persist: {
    key: "counter",
    storage: localStorage,
    paths: ["count", "a"],
  },
});
```