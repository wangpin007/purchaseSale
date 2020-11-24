import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import config from '@/config/user.env'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title' // 获取title
import baseConfig from "@/config/user.env";

Vue.use(Router)
NProgress.configure({ showSpinner: false }) // NProgress 配置

/* Router Modules */
export const constantRoutes = routes

const createRouter = () => new Router({
  // mode: 'history', // require service support
  routes: routes,
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 })
})

const router = createRouter()
// 设置白名单
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  // 设置页面 title
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()
  if (hasToken) { // 存在token
    if (to.path === '/login') {
      // 已经登录 直接跳转主界面
      next({ path: '/' })
      NProgress.done()
    } else {
      next()
    }
  } else {
    // debugger;
    // if (sessionStorage.getItem("Url")) {
      next()
    // } else {
    //   let url = window.location.origin + window.location.pathname;
    //   let LoginUrl = baseConfig.singlePointLogin + encodeURI(url); // window.location.href
    //   sessionStorage.setItem("Url", url);
    //   window.location.href = LoginUrl;
    // }
    
    // next()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

// 重置路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
