import { PiniaPluginContext } from "pinia"

type PersistStorage = Storage;

declare type PersistOptions = {
  key?: string;
  storage?: PersistStorage;
  paths?: string[];
};

type Store = PiniaPluginContext["store"];

type StoreState = Partial<Store["$state"]>;

declare module "pinia" {
  export interface DefineStoreOptionsBase<S, Store> {
    persist?: boolean | PersistOptions;
  }
}

const defaultStorage = localStorage;

const isBoolean = (target: any) => typeof target === "boolean";

const updateStorage = (store: Store, options: PersistOptions) => {
  const { paths, storage = defaultStorage, key = store.$id } = options;
  let state: StoreState = store.$state;

  if (paths && Array.isArray(paths) && paths.length > 0) {
    state = paths?.reduce((obj, key) => {
      obj[key] = store.$state[key];
      return obj;
    }, {} as StoreState);
  }

  storage.setItem(key, JSON.stringify(state));
};

// options中的persist 选项可以是一个布尔值，也可以是一个对象。
// 如果是一个布尔值，那么就使用默认的配置，key为store的id，storage为localStorage，默认缓存所有state值。
// 如果是一个对象，那么就使用对象中的配置，key为store的id，storage为localStorage，paths为需要缓存的state key。
// 如果没有配置paths或者paths为空数组，那么就缓存所有state值。

/**
 * 创建持久化Store数据
 * @param context pinia plugin context
 * @example
 * // main.ts
 * import { createPinia } from "pinia"
 * const pinia = createPinia()
 * pinia.use(createPersistedState)
 * 
 * // useCounter.ts
 * import { defineStore } from "pinia";
 * export const useCounter = defineStore({
 *   id: "counter",
 *   state: () => ({
 *     count: 0,
 *     a: 3,
 *     b: 4,
 *   }),
 *   getters: {
 *     doubleCount(): number {
 *       return this.count * 2;
 *     },
 *   },
 *   persist: true,
 * });
 * 
 * // useCounter.ts
 * import { defineStore } from "pinia";
 * export const useCounter = defineStore({
 *   id: "counter",
 *   state: () => ({
 *     count: 0,
 *     a: 3,
 *     b: 4,
 *   }),
 *   getters: {
 *     doubleCount(): number {
 *       return this.count * 2;
 *     },
 *   },
 *   persist: {
 *     key: "counter",
 *     storage: localStorage,
 *     paths: ["count", "a"],
 *   },
 * });
 */
const createPersistedState = ({ options, store }: PiniaPluginContext) => {
  const storeId = store.$id;
  const persist = options?.persist;

  let persistOptions: PersistOptions;

  if (!options?.persist) return;

  const defaultOptions: PersistOptions = {
    key: storeId,
    storage: defaultStorage,
    paths: [],
  };

  if (persist && isBoolean(persist)) {
    persistOptions = defaultOptions;
  } else {
    persistOptions = Object.assign(defaultOptions, persist);
  }

  const { key = storeId, storage = defaultStorage } = persistOptions;

  const result = storage?.getItem(key);
  
  result && store.$patch(JSON.parse(result));

  store.$subscribe(() => updateStorage(store, persistOptions));
};

export default createPersistedState;
