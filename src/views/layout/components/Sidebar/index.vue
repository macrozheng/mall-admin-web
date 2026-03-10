<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SidebarItem from './SidebarItem.vue'
import ScrollBar from '@/components/ScrollBar/index.vue'
import { useAppStore } from '@/stores/app'
import usePermissionStore from '@/stores/permission'

// 定义组件名称
defineOptions({
  name: 'Sidebar'
})

// 使用 Pinia stores
const appStore = useAppStore()
const permissionStore = usePermissionStore()

const route = useRoute()
// 所有路由
const routes = computed(() => permissionStore.routers)
// 侧边栏打开状态
const isCollapse = computed(() => !appStore.sidebar.opened)
</script>

<template>
  <scroll-bar>
    <el-menu mode="vertical" :show-timeout="200" :default-active="route.path" :collapse="isCollapse"
      background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF">
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>
