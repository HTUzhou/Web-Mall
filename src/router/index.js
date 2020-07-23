import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../components/Login')
const Home = () => import('../components/Home')
const Welcome = () => import('../components/Welcome')
const Users = () => import('../components/user/Users')
const Rights = () => import('../components/power/Rights')
const Roles = () => import("../components/power/Roles")

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/home/welcome',
    children: [
      {
        path: '/home/welcome',
        component: Welcome
      },
      {
        path: "/home/usersList",
        component: Users
      },
      {
        path: "/home/rightsPermissions",
        component: Rights
      },
      {
        path: "/home/rightsList",
        component: Roles
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

//挂载路由导航守卫
router.beforeEach((to, form, next) => {
//  to：将要访问的路径
//  from：代表从哪个路径跳转而来
//  next：是一个函数，表示放行，next() 放行，next('/login') 强制跳转
//  如果用户访问的login页面，则放行
  if (to.path === '/login') {
    return next();
  }
  //从sessionStorage获得token值
  const tokenStr = window.sessionStorage.getItem('token')
  //如果tokenStr为空，则强制跳转到登录界面
  if (!tokenStr) {
    return next('/login');
  }
  next();
})

export default router
