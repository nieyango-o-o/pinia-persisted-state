import { defineStore } from "pinia"

const useCounter = defineStore("counter", {
  state: () => ({
    count: 0
  }),
  persist: {
    key: "custom-counter",
    storage: sessionStorage,
  },
})

export { useCounter }
