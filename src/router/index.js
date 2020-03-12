import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from  '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import Order from '../components/order/Order.vue'
import Report from '../components/report/Report.vue'
import List from '../components/goods/List.vue'


Vue.use(Router)

const router = new Router({
  routes: [
    // 重定向，直接定位到login
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path:'/home',
      component:Home,
      // 重定向到welcome
      redirect:'/welcome',
      // Welcome为home路由的子路由【登录后，直接展示home的子路由welcome对应的Welcome组件】
      children:[
        {path:'/welcome',component: Welcome},
        {path:'/users',component:Users},
        {path:'/rights',component:Rights},
        {path:'/roles',component:Roles},
        {path:'/categories',component:Cate},
        {path:'/params',component:Params},
        {path:'/orders',component:Order},
        {path:'/reports',component:Report},
        {path:'/goods',component:List}
      ]
    }
    
  ]
})

//拿到路由对象 挂载路由导航守卫 【点击本系统除登录页以外的其他网页时，强制跳转到登录页，登录后才能查看其他内容】
router.beforeEach((to,from,next)=>{
  // to 将要访问的路径
  // form 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
      //  next()放行   next('/login')强制跳转


    // 判断访问的是不是登录页
    // 如果是登录页，直接放行
    if(to.path === '/login') return next();
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token')
    // token可能是空值，也可能是真正的token
    // 如果token是空，证明没有登录，需要强制跳转到登录页
    if(!tokenStr) return next('/login')
    next()
})

export default router
