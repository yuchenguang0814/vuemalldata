import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element'
import axios from 'axios'

import './assets/fonts/iconfont.css'
import './assets/css/global.css'

Vue.config.productionTip = false
Vue.prototype.$http = axios

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  return `${y}-${m}-${d}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
