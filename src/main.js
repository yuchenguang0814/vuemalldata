import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element'
import axios from 'axios'

import './assets/fonts/iconfont.css'
import './assets/css/global.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$baseUrl = 'http://localhost:3000'

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  return `${y}-${m}-${d}`
})
Vue.filter('hoursFormat', function (originVal) {
  const dt = new Date(originVal)
  const h = (dt.getHours() + '').padStart(2, '0')
  const m = (dt.getMinutes() + '').padStart(2, '0')
  return `${h}:${m}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
