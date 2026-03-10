<script lang="ts" setup>
import RouterLayoutHeader from './components/LayoutHeader.vue'
import RouterLayoutFooter from './components/LayoutFooter.vue'

defineOptions({
  name: 'RouterLayout'
})
</script>

<template>
  <RouterLayoutHeader />
  <RouterView />
  <RouterLayoutFooter />
</template>

<style scoped lang="scss"></style>
