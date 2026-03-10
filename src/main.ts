import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import '@/styles/index.scss' // 引入全局css样式
import 'normalize.css/normalize.css' // 重置css统一浏览器默认样式
import { setupSvgIcon } from './icons'
import 'virtual:svg-icons-register' // 引入SVG图标注册器（关键步骤）
import '@/router/guard' // 引入vue-router的前置和后置守卫函数
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)
const pinia = createPinia()
// pinia启用持久化插件
pinia.use(piniaPluginPersistedstate)
// 以插件形式注册pinia
app.use(pinia)
// 以插件形式注册vue-router
app.use(router)
// 以插件形式注册SvgIcon组件
setupSvgIcon(app)
app.mount('#app')
