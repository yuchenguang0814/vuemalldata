import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () => import('@/views/Home.vue')
const Welcome = () => import('@/views/Welcome.vue')
const Login = () => import('@/views/Login.vue')
const Users = () => import('@/views/user/Users.vue')
const Goods = () => import('@/views/goods/List.vue')
const GoodsAdd = () => import('@/views/goods/Add.vue')
const GoodsEdit = () => import('@/views/goods/Edit.vue')
const GoodsCate = () => import('@/views/goods/Cate.vue')
const PageList = () => import('@/views/pagesInfo/List.vue')
const Banner = () => import('@/views/pagesInfo/Banner')
const NewsList = () => import('@/views/news/NewsList.vue')
const AddNew = () => import('@/views/news/AddNew.vue')
const VideosList = () => import('@/views/news/VideosList.vue')
const AddVideo = () => import('@/views/news/AddVideo.vue')
const OrderList = () => import('@/views/orders/Order.vue')
const QuestionList = () => import('@/views/orders/Question.vue')
const LinkList = () => import('@/views/link/Link.vue')
const Factory = () => import('@/views/about/Factory.vue')
const Honor = () => import('@/views/about/Honor.vue')
const Reports = () => import('@/views/reports/Reports.vue')
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
    component: Home,
    redirect: '/welcome',
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
      },
      {
        path: '/goods/add',
        component: GoodsAdd
      },
      {
        path: '/goods/edit/:id',
        component: GoodsEdit
      },
      {
        path: '/cate',
        component: GoodsCate
      },
      {
        path: '/page',
        component: PageList
      },
      {
        path: '/banner',
        component: Banner
      },
      {
        path: '/news',
        component: NewsList
      },
      {
        path: '/news/add',
        component: AddNew
      },
      {
        path: '/videos',
        component: VideosList
      },
      {
        path: '/videos/add',
        component: AddVideo
      },
      {
        path: '/orders',
        component: OrderList
      },
      {
        path: '/question',
        component: QuestionList
      },
      {
        path: '/link',
        component: LinkList
      },
      {
        path: '/about',
        component: Honor
      },
      {
        path: '/factory',
        component: Factory
      },
      {
        path: '/reports',
        component: Reports
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
