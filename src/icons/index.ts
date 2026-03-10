import SvgIcon from '@/components/SvgIcon/index.vue' // svg组件
import type { App } from 'vue'

// 导出组件注册函数，在main.js中使用
export function setupSvgIcon(app: App) {
  app.component('svg-icon', SvgIcon)
}

// 用import.meta.glob自动导入所有svg图标
const modules = import.meta.glob('./svg/*.svg')

// 加载所有svg模块
Object.keys(modules).forEach(key => {
  const module = modules[key]
  if (module) {
    module()
  }
})
