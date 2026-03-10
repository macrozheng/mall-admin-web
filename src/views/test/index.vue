<script lang="ts" setup>
import TestPinia from '@/views/test/pinia/index.vue'
import TestElement from '@/views/test/element/index.vue'
import TestAxios from '@/views/test/axios/index.vue'
</script>

<template>
  <div class="vertical-layout">
    <h1>组件测试页面</h1>
    <!-- pinia组件测试 -->
    <div>
      <TestPinia></TestPinia>
    </div>
    <!-- element-plus组件测试 -->
    <div>
      <TestElement></TestElement>
    </div>
    <!-- axiso调用接测试 -->
    <div>
      <TestAxios></TestAxios>
    </div>
  </div>
</template>

<style scoped>
.vertical-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}
</style>
