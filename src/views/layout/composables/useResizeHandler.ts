import { onMounted, onBeforeMount, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'

const { body } = document
const WIDTH = 1024
const RATIO = 3

export default function useResizeHandler() {
  const route = useRoute()
  const appStore = useAppStore()

  // 监听路由变化
  watch(
    () => route,
    () => {
      if (appStore.device === 'mobile' && appStore.sidebar.opened) {
        appStore.closeSideBar(false)
      }
    },
  )

  // 判断是否为移动端访问
  const isMobile = () => {
    const rect = body.getBoundingClientRect()
    return rect.width - RATIO < WIDTH
  }

  const resizeHandler = () => {
    if (!document.hidden) {
      const mobile = isMobile()
      appStore.toggleDevice(mobile ? 'mobile' : 'desktop')

      if (mobile) {
        appStore.closeSideBar(true)
      }
    }
  }

  // 在组件挂在之前调用
  onBeforeMount(() => {
    window.addEventListener('resize', resizeHandler)
  })

  // 在组件挂在之后调用
  onMounted(() => {
    const mobile = isMobile()
    if (mobile) {
      appStore.toggleDevice('mobile')
      appStore.closeSideBar(true)
    }
  })

  // 在组件卸载之前调用
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
  })

  return {
    isMobile,
    resizeHandler,
  }
}
