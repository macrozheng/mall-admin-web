import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  // 侧边栏状态
  const sidebar = reactive({
    opened: true,
    withoutAnimation: false,
  })
  // 设备状态
  const device = ref('desktop')

  // 切换侧边栏
  function toggleSideBar() {
    sidebar.opened = !sidebar.opened
  }

  // 关闭侧边栏
  function closeSideBar(withoutAnimation: boolean) {
    sidebar.opened = false
    sidebar.withoutAnimation = withoutAnimation
  }

  // 切换设备：desktop or mobile
  function toggleDevice(deviceType: string) {
    device.value = deviceType
  }

  return {
    sidebar,
    device,
    toggleSideBar,
    closeSideBar,
    toggleDevice,
  }
})
