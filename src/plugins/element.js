import Vue from 'vue'
import {Button, Form, FormItem, Input, Message, Container, Header, Aside,
Main, Menu, MenuItem, Submenu, Breadcrumb, BreadcrumbItem, Card,
Option, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, Dialog,
MessageBox} from 'element-ui'

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(MenuItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Card)
Vue.use(Option)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
//把弹框组件挂载到原型组件上
Vue.prototype.$message = Message
//挂载messagebox
Vue.prototype.$confirm = MessageBox.confirm

