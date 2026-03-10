import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    vueDevTools(),
    // 配置element-plus组件自动导入
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      // 配置element-plus采用sass样式配色系统
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
    }),
    // 覆盖element-plus默认主题色
    ElementPlus({
      useSource: true,
    }),
    // 创建SVG图标创建插件
    createSvgIconsPlugin({
      // 指定存放SVG图标的目录
      iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
      // 定义图标 ID 的生成规则
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 指定覆盖主题色的scss文件
        additionalData: `
          @use "@/styles/element/index.scss" as *;
          @use "@/styles/var.scss" as *;
        `,
        // 屏蔽在使用el-col时出现的控制台警告信息
        silenceDeprecations: ['legacy-js-api', 'if-function'],
      },
    },
  },
})
