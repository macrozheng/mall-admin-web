<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute, type RouteLocationMatched } from 'vue-router'
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'

// 定义组件名称
defineOptions({
  name: 'Breadcrumb'
})

// 显式注册Element Plus组件
defineExpose({
  ElBreadcrumb,
  ElBreadcrumbItem
})

// 响应式数据
const levelList = ref<RouteLocationMatched[]>([])
const route = useRoute()

// 计算属性，只返回有标题的面包屑项
const visibleLevelList = computed(() => {
  return levelList.value.filter(item => item.meta?.title)
})

// 获取面包屑路径
const getBreadcrumb = () => {
  let matched = route.matched.filter(item => item.name)
  const first = matched[0]
  if (first && first.name !== 'home') {
    const homeRoute: RouteLocationMatched = { ...first, path: '/home', meta: { title: '首页' }, name: 'home' }
    matched = [homeRoute].concat(matched)
  }
  levelList.value = matched
}

// 监听路由变化
watch(route, () => {
  getBreadcrumb()
}, { immediate: true })

// 初始化
getBreadcrumb()
</script>

<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in visibleLevelList" :key="item.path">
        <span v-if="item.redirect === 'noredirect' || index == visibleLevelList.length - 1" class="no-redirect">{{
          item.meta.title
          }}</span>
        <router-link v-else :to="typeof item.redirect === 'string' ? item.redirect : item.path">{{ item.meta.title
          }}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 10px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
