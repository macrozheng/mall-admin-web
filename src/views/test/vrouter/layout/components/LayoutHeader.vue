<script lang="ts" setup>
defineOptions({
  name: 'RouterLayoutHeader'
})
</script>

<template>
  <nav>
    <RouterLink to="/">Go to Home</RouterLink>
    <span />
    <RouterLink to="/category">Go to Category</RouterLink>
  </nav>
  <div>
    我是RouterLayoutHeader部分
  </div>
</template>

<style scoped lang="scss"></style>
