import Vuex from 'vuex'

export function createStore() {
  return new Vuex.Store({
    state: {
      count: 0
    },
    mutations: {
      addCount(state) {
        state.count++
      }
    }
  })
}
