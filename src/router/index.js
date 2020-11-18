import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () => import('@/views/Home.vue')
const Welcome = () => import('@/views/Welcome.vue')
const Login = () => import('@/views/Login.vue')
const Users = () => import('@/views/user/Users.vue')
const Goods = () => import('@/views/goods/List.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/goods',
        component: Goods
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
