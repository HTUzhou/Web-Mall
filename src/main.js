import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
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

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
