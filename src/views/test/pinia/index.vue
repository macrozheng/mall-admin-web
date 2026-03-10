<script lang="ts" setup>

defineOptions({
  name: 'TestPinia'
})

// 1. 导入use方法
import { useCounterStore } from '@/stores/counter'
// 2. 执行方法得到store store里有数据和方法
const counterStore = useCounterStore()
</script>

<template>
  <button @click="counterStore.increment">
    {{ counterStore.count }}
  </button>
</template>

<style scoped></style>
