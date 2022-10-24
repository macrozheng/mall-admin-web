import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import VCharts from 'v-charts'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control


import i18n from './lang/index';

import axios from 'axios'
//全局注册
Vue.prototype.$axios = axios;

Vue.use(ElementUI,{
  i18n:(key,value)=>i18n.t(key,value)
 } )
Vue.use(VCharts)

Vue.config.productionTip = false
import SlideVerify from 'vue-monoplasty-slide-verify';
Vue.use(SlideVerify)

new Vue({
  el: '#app',
  router,
  i18n,
  store,
  template: '<App/>',
  components: { App }
})
