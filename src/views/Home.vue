<template>
  <div class="page">
    <h1>Home</h1>
    <div>当前Count：{{ count }}</div>
    <button @click="addCount">加1</button>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'HomePage',
  computed: {
    ...mapState(['count'])
  },
  async asyncData({ store }) {
    await Promise.resolve(store.commit('addCount'))
  },
  methods: {
    ...mapMutations(['addCount'])
  }
}
</script>
