<script lang="ts" setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar/index.vue'
import AppMain from './components/AppMain.vue'
import useResizeHandler from './composables/useResizeHandler'

// 使用 Pinia store
const appStore = useAppStore()

// 获取响应式状态
const sidebar = computed(() => appStore.sidebar)
const device = computed(() => appStore.device)

// 计算类名
const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === 'mobile'
}))

// 使用 resize handler composable
useResizeHandler()
</script>


<template>
  <div class="app-wrapper" :class="classObj">
    <Sidebar class="sidebar-container"></Sidebar>
    <div class="main-container">
      <Navbar></Navbar>
      <AppMain></AppMain>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/mixin.scss";

.app-wrapper {
  @include mixin.clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
