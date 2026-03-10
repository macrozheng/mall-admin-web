<script lang="ts" setup>
import { ref } from 'vue'

// 定义组件名称
defineOptions({
  name: 'ScrollBar'
})

const delta = 15

// 响应式数据
const top = ref(0)
const scrollContainer = ref<HTMLDivElement>()
const scrollWrapper = ref<HTMLDivElement>()

// 处理滚动事件
const handleScroll = (e: WheelEvent) => {
  const eventDelta = -e.deltaY * 3
  const $container = scrollContainer.value
  if (!$container) return
  const $containerHeight = $container.offsetHeight
  const $wrapper = scrollWrapper.value
  if (!$wrapper) return
  const $wrapperHeight = $wrapper.offsetHeight

  if (eventDelta > 0) {
    top.value = Math.min(0, top.value + eventDelta)
  } else {
    if ($containerHeight - delta < $wrapperHeight) {
      if (top.value < -($wrapperHeight - $containerHeight + delta)) {
        // 当已经到达边界时，无需重新赋值
      } else {
        top.value = Math.max(top.value + eventDelta, $containerHeight - $wrapperHeight - delta)
      }
    } else {
      top.value = 0
    }
  }
}
</script>

<template>
  <div class="scroll-container" ref="scrollContainer" @wheel.prevent="handleScroll">
    <div class="scroll-wrapper" ref="scrollWrapper" :style="{ top: top + 'px' }">
      <slot></slot>
    </div>
  </div>
</template>

<style rel="stylesheet/scss" lang="scss" scoped>
@use '../../styles/variables.scss' as vars;

.scroll-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: vars.$menuBg;

  .scroll-wrapper {
    position: absolute;
    width: 100% !important;
  }
}
</style>
