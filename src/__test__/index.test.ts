import { createApp } from "vue"
import { describe, it, expect } from 'vitest'
import { createPinia, setActivePinia } from "pinia"
import createPersistedState from ".."
import { useCounter } from "./counter"
import { useCounter as customStateKeyCounter } from './customStateKeyCounter'
import { useCounter as customStateStorageCounter } from './customStateStorageCounter'
import { useCounter as customStatePathsCounter } from './customStatePathsCounter'

describe('测试Pinia持久化', () => {

  it("创建注册pinia", () => {
    const app = createApp({})
    const pinia = setActivePinia(createPinia())!
    app.use(pinia)
    expect(pinia).toBeDefined()
  })

  it("注册持久化插件, 使用默认配置方式", () => {
    const app = createApp({})
    const pinia = setActivePinia(createPinia())!
    pinia.use(createPersistedState)
    app.use(pinia)

    const counterStore = useCounter()
    counterStore.count = 2
    setTimeout(() => {
      const piniaStore = JSON.parse(localStorage.getItem("pinia")!)
      expect(piniaStore.counter.count).toBe(2)
    })
  })

  it("注册持久化插件, 使用自定义配置方式", () => {
    const app = createApp({})
    const pinia = setActivePinia(createPinia())!
    pinia.use((context) => createPersistedState(context, {
      name: "custom-pinia", // 存储数据的key, 默认是pinia
      storage: sessionStorage, // 存储方式PersistStorage, 默认是localStorage, 可选项: sessionStorage
    }))
    app.use(pinia)

    const counterStore = useCounter()
    counterStore.count = 4

    setTimeout(() => {
      const piniaStore = JSON.parse(sessionStorage.getItem("custom-pinia")!)
      expect(piniaStore.counter.count).toBe(4)
    })
  })

  it("自定义持久化每个store数据存储的key", () => {
    const app = createApp({})
    const pinia = setActivePinia(createPinia())!
    pinia.use((context) => createPersistedState(context, {
      name: "custom-state-pinia",
      storage: sessionStorage,
    }))
    app.use(pinia)

    const counterStore = customStateKeyCounter()
    counterStore.count = 6

    setTimeout(() => {
      const piniaStore = JSON.parse(sessionStorage.getItem("custom-state-pinia")!)
      expect(piniaStore['custom-counter']).toBeDefined()
      expect(piniaStore['custom-counter'].count).toBe(6)
    })
  })

  it("自定义存储的方式storage", () => {
    const app = createApp({})
    const pinia = setActivePinia(createPinia())!
    pinia.use((context) => createPersistedState(context, {
      name: "custom-storage-pinia",
      storage: localStorage,
    }))
    app.use(pinia)

    const counterStore = customStateStorageCounter()
    counterStore.count = 8

    setTimeout(() => {
      const piniaStore = JSON.parse(sessionStorage.getItem("custom-storage-pinia")!)
      expect(piniaStore.counter).toBeDefined()
      expect(piniaStore.counter.count).toBe(8)
    })
  })

  it("自定义持久化state中的属性", () => {
    const app = createApp({})
    const pinia = setActivePinia(createPinia())!
    pinia.use((context) => createPersistedState(context, {
      name: "custom-paths-pinia",
      storage: localStorage,
    }))
    app.use(pinia)

    const counterStore = customStatePathsCounter()
    counterStore.count = 8

    setTimeout(() => {
      const piniaStore = JSON.parse(localStorage.getItem("custom-paths-pinia")!)
      expect(piniaStore.counter).toBeDefined()
      expect(piniaStore.counter.count).toBeUndefined()
      expect(piniaStore.counter.name).toBe("张三")
      expect(piniaStore.counter.age).toBe("18")
    })
  })
})
