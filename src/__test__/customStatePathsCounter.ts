import { defineStore } from "pinia"

const useCounter = defineStore("counter", {
  state: () => ({
    count: 0,
    age: "18",
    name: '张三'
  }),
  persist: {
    paths: ["age", "name"]
  },
})

export { useCounter }
