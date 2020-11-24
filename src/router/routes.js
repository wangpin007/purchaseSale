import { requireAll } from 'lib@/utils/require'
import exception from './exception'

export const moduleRoutes = requireAll(require.context('mod@', true, /((?!\/)[\s\S])+\/router\/index.js$/))

export const allRouter = [
  ...moduleRoutes,
  exception,
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/redirect',
    component: () => import('@/layout'),
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/',
    name: 'app',
    component: () => import('@/layout'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: '工作台',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  // 品质云系统跳转进销存专门配置的路由，没有菜单的页面
  {
    path: '/workshop',
    name: "workshop",
    component: () => import("mod@/system/views/mdm/workshop"),
    meta: {
      title: "车间",
      requiresAuth: true
    }
  },
  // 品质云系统跳转进销存专门配置的路由，没有菜单的页面
  {
    path: '/productionLine',
    name: "productionLine",
    component: () => import("mod@/system/views/mdm/productionLine"),
    meta: {
      title: "产线",
      requiresAuth: true
    }
  },
  {
    path: '*',
    redirect: '/exception/404'
  }
]

export default allRouter
