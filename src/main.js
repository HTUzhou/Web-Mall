import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

//配置请求的根路径
axios.defaults.baseURL = 'http://localhost:8081'
//配置请求拦截器
axios.interceptors.request.use(config => {
  //为请求头设置一个Bearer字段，设置值为sessionStorage中保存的token
  config.headers.Authorization = 'Bearer ' + window.sessionStorage.getItem('token');
  //最后必须返回config，固定写法
  return config;
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

//注册全局组件
Vue.component('tree-table', TreeTable)

//全局注册富文本编辑器
Vue.use(VueQuillEditor)

//注册全局过滤器,对时间进行格式化
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
