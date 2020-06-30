import Vue from 'vue'
import VueMate from 'vue-meta'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import { sync } from 'vuex-router-sync'
import { createRouter } from './router'
import { createStore } from './store'
import App from './App.vue'
import './scss/common.scss'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueMate)

export function createApp() {
  const router = createRouter()
  const store = createStore()
  sync(store, router)
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return { app, router, store }
}
