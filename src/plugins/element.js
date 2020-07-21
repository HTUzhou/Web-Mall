import Vue from 'vue'
import {Button, Form, FormItem, Input, Message} from 'element-ui'

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
//把弹框组件挂载到原型组件上
Vue.prototype.$message = Message

