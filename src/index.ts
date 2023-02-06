import { PiniaPluginContext } from 'pinia'

type PersistStorage = Storage

type PersistConfig = {
  name?: string
  storage?: PersistStorage
}

type PersistOptions = {
  key?: string
  storage?: PersistStorage
  paths?: string[]
}

type Store = PiniaPluginContext['store']

type StoreState = Partial<Store['$state']>

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    persist?: boolean | PersistOptions
  }
}

let defaultStorage = localStorage

let defaultPiniaName = 'pinia'

const isBoolean = (target: unknown) => typeof target === 'boolean'

const getPiniaStore = (storage: PersistStorage) => {
  const store = storage.getItem(defaultPiniaName)
  if (store) {
    return JSON.parse(store)
  }
  return {}
}

const updateStorage = (store: Store, options: PersistOptions) => {
  const { paths, storage = defaultStorage, key = store.$id } = options
  let state: StoreState = store.$state
  let piniaStore = getPiniaStore(storage)

  if (paths && Array.isArray(paths) && paths.length > 0) {
    state = paths?.reduce((obj, key) => {
      obj[key] = store.$state[key]
      return obj
    }, {} as StoreState)
  }
  storage.setItem(
    defaultPiniaName,
    JSON.stringify(Object.assign(piniaStore, { [key]: state }))
  )
}

const setConfig = (config: PersistConfig) => {
  const { name, storage } = config
  if (name) {
    defaultPiniaName = name
  }
  if (storage) {
    defaultStorage = storage
  }
}

function createPersistedState(context: PiniaPluginContext): void

function createPersistedState(
  context: PiniaPluginContext,
  config: PersistConfig
): void

function createPersistedState(
  context: PiniaPluginContext,
  config?: PersistConfig
) {
  if (config) {
    setConfig(config)
  }

  const { options, store } = context
  const storeId = store.$id
  const persist = options?.persist

  let persistOptions: PersistOptions

  if (!options?.persist) return

  const defaultOptions: PersistOptions = {
    key: storeId,
    storage: defaultStorage,
    paths: [],
  }

  if (persist && isBoolean(persist)) {
    persistOptions = defaultOptions
  } else {
    persistOptions = Object.assign(defaultOptions, persist)
  }

  const { key = storeId, storage = defaultStorage } = persistOptions

  const piniaStore = getPiniaStore(storage)

  const result = piniaStore[key]
  result && store.$patch(result)

  store.$subscribe(() => updateStorage(store, persistOptions))
}

export default createPersistedState
