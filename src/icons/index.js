import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg组件

// register globally
Vue.component('svg-icon', SvgIcon)

// ./svg：指定目录路径。 false：表示不递归查找子目录。 /\.\svg$/：正则表达式，匹配文件扩展名为 .svg 的文件。

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', true, /\.svg$/)
requireAll(req)
