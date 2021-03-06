// main.js入口函数


import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入插件 table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'

// 配置axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 通过axios请求拦截器添加token，保证拥有获取数据的权限
// axios请求拦截，为请求头对象挂载一个自定义属性，值就是保存到sessionStorage中的token
axios.interceptors.request.use(config =>{
  console.log(config)
  // 为请求头对象，添加Token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 固定写法，最后必须return config 
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false
// Vue.component将TreeTable注册为全局组件
Vue.component('tree-table',TreeTable)


// 注册一个全局的时间过滤器
Vue.filter('dateFormat',function(originVal) {
  const dt = new Date(originVal)
  const y= dt.getFullYear()
  const m= (dt.getMonth() + 1 +'').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')

  const hh=(dt.getHours() + '').padStart(2,'0')
  const mm= (dt.getMinutes() + '').padStart(2,'0')
  const ss= (dt.getSeconds() + '').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
